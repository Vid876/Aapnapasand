import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { Product } from "@/models/Product";
import { toPublicProductRating } from "@/lib/public-rating";

const objectId = z.string().refine(mongoose.isValidObjectId, "Invalid product id");
const wishlistSchema = z.object({
  productId: objectId.optional(),
  productIds: z.array(objectId).max(2000).optional(),
});

async function getAuthenticatedUserId() {
  const session = await getServerSession(authOptions);
  return session?.user?.id;
}

export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const user = await User.findById(userId).select("wishlist").lean();
    const items = (user?.wishlist || []).map((id) => String(id));
    const products = await Product.find({
      _id: { $in: items },
      isActive: true,
    })
      .populate("category", "name slug")
      .lean();
    const productMap = new Map(
      products.map((product) => [String(product._id), toPublicProductRating(product)])
    );

    return NextResponse.json({
      items,
      products: items.map((id) => productMap.get(id)).filter(Boolean),
    });
  } catch (error) {
    console.error("Wishlist fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = wishlistSchema.parse(await request.json());
    const productIds = [...new Set([data.productId, ...(data.productIds || [])].filter(Boolean))];
    if (!productIds.length) {
      return NextResponse.json({ error: "A product id is required" }, { status: 400 });
    }

    await connectDB();
    const existingCount = await Product.countDocuments({ _id: { $in: productIds }, isActive: true });
    if (!existingCount) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: { $each: productIds } } },
      { new: true }
    )
      .select("wishlist")
      .lean();

    return NextResponse.json({ items: (user?.wishlist || []).map((id) => String(id)) });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Wishlist update error:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const productId = request.nextUrl.searchParams.get("productId");
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product id" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: productId } },
      { new: true }
    )
      .select("wishlist")
      .lean();

    return NextResponse.json({ items: (user?.wishlist || []).map((id) => String(id)) });
  } catch (error) {
    console.error("Wishlist delete error:", error);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}

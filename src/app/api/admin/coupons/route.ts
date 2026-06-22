import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const couponSchema = z.object({
  code: z.string().min(3).max(20),
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional(),
  usageLimit: z.number().min(1).optional(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ coupons });
  } catch (error) {
    console.error("Coupons fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const data = couponSchema.parse(body);

    await connectDB();

    const existing = await Coupon.findOne({ code: data.code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await Coupon.create({
      ...data,
      code: data.code.toUpperCase(),
      minOrderAmount: data.minOrderAmount ?? 0,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    });

    return NextResponse.json({ coupon }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Coupon create error:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/admin";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    await connectDB();
    const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
    const limit = 25;
    const search = request.nextUrl.searchParams.get("search")?.trim() || "";
    const filter: Record<string, unknown> = { role: "customer" };
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }];

    const [customers, total] = await Promise.all([
      User.find(filter).select("name email phone role isActive emailVerifiedAt lastLoginAt loginCount signupSource addresses wishlist createdAt updatedAt").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
      User.countDocuments(filter),
    ]);
    const ids = customers.map((customer) => customer._id);
    const orderStats = await Order.aggregate([
      { $match: { user: { $in: ids } } },
      { $group: { _id: "$user", orderCount: { $sum: 1 }, totalSpent: { $sum: { $cond: [{ $ne: ["$status", "cancelled"] }, "$total", 0] } }, latestOrderAt: { $max: "$createdAt" } } },
    ]);
    const statsByUser = new Map(orderStats.map((item) => [String(item._id), item]));

    return NextResponse.json({
      customers: customers.map((customer) => ({
        ...customer,
        addressCount: customer.addresses?.length || 0,
        wishlistCount: customer.wishlist?.length || 0,
        orderCount: statsByUser.get(String(customer._id))?.orderCount || 0,
        totalSpent: statsByUser.get(String(customer._id))?.totalSpent || 0,
        latestOrderAt: statsByUser.get(String(customer._id))?.latestOrderAt,
        addresses: undefined,
        wishlist: undefined,
      })),
      pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) },
    });
  } catch (error) {
    console.error("Admin customers fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}

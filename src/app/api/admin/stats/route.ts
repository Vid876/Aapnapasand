import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { Coupon } from "@/models/Coupon";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      revenueAgg,
      recentOrders,
      monthlyRevenue,
      dailyRevenue,
      topProducts,
      activeCoupons,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: "customer" }),
      Order.aggregate([
        { $match: { paymentStatus: { $in: ["paid", "pending"] }, status: { $ne: "cancelled" } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("orderNumber total status paymentStatus createdAt shippingAddress.fullName")
        .lean(),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
            paymentStatus: { $in: ["paid", "pending"] },
            status: { $ne: "cancelled" },
          },
        },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: sevenDaysAgo },
            status: { $ne: "cancelled" },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            image: { $first: "$items.image" },
            sold: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: 5 },
      ]),
      Coupon.countDocuments({ isActive: true }),
    ]);

    const pendingOrders = await Order.countDocuments({
      status: { $in: ["pending", "confirmed", "processing"] },
    });

    const chartData = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sevenDaysAgo);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().split("T")[0];
      const found = dailyRevenue.find((r: { _id: string }) => r._id === key);
      chartData.push({
        date: key,
        label: d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric" }),
        revenue: found?.revenue || 0,
        orders: found?.orders || 0,
      });
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        totalProducts,
        totalCustomers,
        totalRevenue: revenueAgg[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingOrders,
        activeCoupons,
      },
      recentOrders,
      chartData,
      topProducts,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

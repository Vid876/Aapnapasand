import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { getRazorpayInstance, isRazorpayConfigured } from "@/lib/razorpay";

export async function POST(request: NextRequest) {
  try {
    if (!isRazorpayConfigured()) {
      return NextResponse.json(
        { error: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env" },
        { status: 503 }
      );
    }

    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.paymentStatus === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 400 });
    }

    const razorpay = getRazorpayInstance()!;
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.total * 100),
      currency: "INR",
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    order.paymentId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      orderNumber: order.orderNumber,
      customerName: order.shippingAddress.fullName,
      customerEmail: order.guestEmail || "",
      customerPhone: order.shippingAddress.phone,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
  }
}

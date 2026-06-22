import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { sendOrderEmailFromOrder } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderId) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await connectDB();
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    order.paymentStatus = "paid";
    order.paymentId = razorpay_payment_id;
    order.status = "confirmed";
    await order.save();

    let userEmail: string | undefined;
    if (order.user) {
      const user = await User.findById(order.user).select("email");
      userEmail = user?.email;
    }
    sendOrderEmailFromOrder(order.toObject(), userEmail).catch(console.error);

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Payment verification failed" }, { status: 500 });
  }
}

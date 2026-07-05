import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { Coupon } from "@/models/Coupon";
import { User } from "@/models/User";
import { authOptions } from "@/lib/auth";
import { sendOrderEmailFromOrder } from "@/lib/email";
import { sendOrderConfirmedSMS } from "@/lib/sms";
import { z } from "zod";

const orderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      image: z.string(),
      quantity: z.number().min(1),
      size: z.string(),
      color: z.string(),
      price: z.number(),
      currency: z.enum(["INR", "USD"]).optional(),
    })
  ),
  shippingAddress: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(10),
    addressLine1: z.string().min(5),
    addressLine2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().length(6),
  }),
  paymentMethod: z.string(),
  guestEmail: z.string().email().optional(),
  couponCode: z.string().optional(),
});

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `AP${timestamp}${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const data = orderSchema.parse(body);

    if (!session && !data.guestEmail) {
      return NextResponse.json(
        { error: "Email required for guest checkout" },
        { status: 400 }
      );
    }

    await connectDB();

    const currency = data.items[0]?.currency || "INR";
    const freeShippingThreshold = currency === "USD" ? 75 : 999;
    const shippingCharge = currency === "USD" ? 8 : 99;
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (data.couponCode) {
      const coupon = await Coupon.findOne({
        code: data.couponCode.toUpperCase(),
        isActive: true,
      });

      if (coupon && subtotal >= coupon.minOrderAmount) {
        if (coupon.discountType === "percentage") {
          discount = (subtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
        } else {
          discount = coupon.discountValue;
        }
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    const shippingCost = subtotal >= freeShippingThreshold ? 0 : shippingCharge;
    const tax = Math.round((subtotal - discount) * 0.05);
    const total = subtotal - discount + shippingCost + tax;

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      user: session?.user?.id,
      guestEmail: data.guestEmail,
      items: data.items.map((item) => ({
        product: item.productId,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.price,
        currency: item.currency || currency,
      })),
      shippingAddress: data.shippingAddress,
      subtotal,
      shippingCost,
      discount,
      tax,
      total,
      currency,
      couponCode: data.couponCode,
      paymentMethod: data.paymentMethod,
      paymentStatus: "pending",
      status: data.paymentMethod === "razorpay" ? "pending" : "confirmed",
    });

    if (data.paymentMethod === "cod") {
      let userEmail: string | undefined;
      if (session?.user?.id) {
        const user = await User.findById(session.user.id).select("email");
        userEmail = user?.email;
      }
      sendOrderEmailFromOrder(order.toObject(), userEmail).catch(console.error);
      sendOrderConfirmedSMS(data.shippingAddress.phone, order.orderNumber).catch(console.error);
    }

    return NextResponse.json(
      {
        message: "Order placed successfully",
        order: {
          id: order._id,
          orderNumber: order.orderNumber,
          total: order.total,
          paymentMethod: order.paymentMethod,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find({ user: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Orders fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

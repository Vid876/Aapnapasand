import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Order } from "@/models/Order";
import { requireAdmin } from "@/lib/admin";
import { generateTrackingNumber } from "@/lib/shipping";
import { sendOrderShippedSMS } from "@/lib/sms";
import { z } from "zod";

const updateSchema = z.object({
  status: z
    .enum(["pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "returned"])
    .optional(),
  paymentStatus: z.enum(["pending", "paid", "failed", "refunded"]).optional(),
  trackingNumber: z.string().optional(),
  generateTracking: z.boolean().optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).populate("user", "name email phone").lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await request.json();
    const data = updateSchema.parse(body);
    const { id } = await params;

    await connectDB();
    const existing = await Order.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const update: Record<string, unknown> = { ...data };
    delete update.generateTracking;

    if (data.generateTracking || (data.status === "shipped" && !data.trackingNumber && !existing.trackingNumber)) {
      update.trackingNumber = generateTrackingNumber();
    }

    const order = await Order.findByIdAndUpdate(id, update, { new: true });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (data.status === "shipped" && order.trackingNumber) {
      sendOrderShippedSMS(
        order.shippingAddress.phone,
        order.orderNumber,
        order.trackingNumber
      ).catch(console.error);
    }

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

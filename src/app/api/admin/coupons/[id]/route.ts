import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Coupon } from "@/models/Coupon";
import { requireAdmin } from "@/lib/admin";
import { z } from "zod";

const updateSchema = z.object({
  description: z.string().optional(),
  discountType: z.enum(["percentage", "fixed"]).optional(),
  discountValue: z.number().min(0).optional(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).optional().nullable(),
  usageLimit: z.number().min(1).optional().nullable(),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional().nullable(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    const body = await request.json();
    const data = updateSchema.parse(body);

    await connectDB();
    const update: Record<string, unknown> = { ...data };
    if (data.expiresAt !== undefined) {
      update.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    }

    const coupon = await Coupon.findByIdAndUpdate(id, update, { new: true });
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ coupon });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Coupon update error:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;
    await connectDB();
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }
    return NextResponse.json({ message: "Coupon deleted" });
  } catch (error) {
    console.error("Coupon delete error:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}

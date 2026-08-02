import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { inrToUsd } from "@/lib/public-pricing";
import { Coupon } from "@/models/Coupon";

export async function POST(request: NextRequest) {
  try {
    const { code, subtotal, currency = "USD" } = await request.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code required" }, { status: 400 });
    }

    await connectDB();

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 });
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { error: "Coupon usage limit reached" },
        { status: 400 }
      );
    }

    const publicCurrency = currency === "INR" ? "INR" : "USD";
    const convertMoney = (amount: number) =>
      publicCurrency === "USD" ? inrToUsd(amount) : amount;
    const minOrderAmount = convertMoney(coupon.minOrderAmount);

    if (subtotal < minOrderAmount) {
      const formattedMinimum = new Intl.NumberFormat(
        publicCurrency === "USD" ? "en-US" : "en-IN",
        { style: "currency", currency: publicCurrency }
      ).format(minOrderAmount);
      return NextResponse.json(
        { error: `Minimum order amount is ${formattedMinimum}` },
        { status: 400 }
      );
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, convertMoney(coupon.maxDiscount));
      }
    } else {
      discount = convertMoney(coupon.discountValue);
    }

    return NextResponse.json({
      valid: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount:
        publicCurrency === "USD"
          ? Math.round(discount * 100) / 100
          : Math.round(discount),
      description: coupon.description,
    });
  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json(
      { error: "Failed to validate coupon" },
      { status: 500 }
    );
  }
}

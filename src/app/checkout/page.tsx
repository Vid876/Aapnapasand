"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { CheckCircle } from "lucide-react";
import { openRazorpayCheckout } from "@/lib/razorpay-client";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const [form, setForm] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "cod",
  });

  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax;

  useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      router.push("/cart");
    }
  }, [items.length, orderPlaced, router]);

  if (items.length === 0 && !orderPlaced) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscount(data.discount);
      } else {
        setCouponError(data.error);
        setDiscount(0);
      }
    } catch {
      setCouponError("Failed to validate coupon");
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setPaymentError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            price: item.price,
          })),
          shippingAddress: {
            fullName: form.fullName,
            phone: form.phone,
            addressLine1: form.addressLine1,
            addressLine2: form.addressLine2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
          paymentMethod: form.paymentMethod,
          guestEmail: !session ? form.email : undefined,
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPaymentError(data.error || "Failed to place order");
        return;
      }

      if (form.paymentMethod === "razorpay") {
        const paymentRes = await fetch("/api/payments/razorpay/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId: data.order.id }),
        });

        const paymentData = await paymentRes.json();
        if (!paymentRes.ok) {
          setPaymentError(paymentData.error || "Payment setup failed");
          return;
        }

        setLoading(false);
        await openRazorpayCheckout(
          paymentData,
          data.order.id,
          (orderNum) => {
            setOrderNumber(orderNum);
            setOrderPlaced(true);
            clearCart();
          },
          (err) => setPaymentError(err)
        );
        return;
      }

      setOrderNumber(data.order.orderNumber);
      setOrderPlaced(true);
      clearCart();
    } catch {
      setPaymentError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <div className="container-app py-20 text-center max-w-lg mx-auto">
        <CheckCircle className="mx-auto mb-6 text-green-500" size={64} />
        <h1 className="text-3xl font-display font-bold mb-3">Order Placed!</h1>
        <p className="text-gray-500 mb-2">Thank you for your purchase.</p>
        <p className="text-lg font-semibold mb-8">
          Order Number: <span className="text-brand-600">{orderNumber}</span>
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/shop">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
          {session && (
            <Link href="/account/orders">
              <Button>View Orders</Button>
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container-app py-8 lg:py-12">
      <h1 className="text-3xl font-display font-bold mb-8">Checkout</h1>

      <div className="flex gap-2 mb-8">
        {["Shipping", "Payment", "Review"].map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step > i + 1
                  ? "bg-green-500 text-white"
                  : step === i + 1
                    ? "bg-brand-900 text-white"
                    : "bg-gray-200 text-gray-500"
              }`}
            >
              {i + 1}
            </div>
            <span className="text-sm font-medium hidden sm:block">{label}</span>
            {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              {!session && (
                <Input
                  label="Email"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              )}
              <Input label="Full Name" id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required />
              <Input label="Phone" id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
              <Input label="Address Line 1" id="addressLine1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required />
              <Input label="Address Line 2 (Optional)" id="addressLine2" name="addressLine2" value={form.addressLine2} onChange={handleChange} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City" id="city" name="city" value={form.city} onChange={handleChange} required />
                <Input label="State" id="state" name="state" value={form.state} onChange={handleChange} required />
              </div>
              <Input label="Pincode" id="pincode" name="pincode" value={form.pincode} onChange={handleChange} required maxLength={6} />
              <Button onClick={() => setStep(2)} size="lg" className="mt-4">
                Continue to Payment
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              {[
                { value: "cod", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                { value: "razorpay", label: "Pay Online", desc: "UPI, Cards, Net Banking, Wallets via Razorpay" },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${
                    form.paymentMethod === method.value
                      ? "border-brand-600 bg-brand-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method.value}
                    checked={form.paymentMethod === method.value}
                    onChange={handleChange}
                    className="accent-brand-600"
                  />
                  <div>
                    <p className="font-medium">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
              <div className="flex gap-4 mt-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)} size="lg">Review Order</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review Your Order</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium mb-2">Shipping to:</h3>
                <p className="text-sm text-gray-600">
                  {form.fullName}<br />
                  {form.addressLine1}{form.addressLine2 && `, ${form.addressLine2}`}<br />
                  {form.city}, {form.state} - {form.pincode}<br />
                  Phone: {form.phone}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-medium mb-2">Payment:</h3>
                <p className="text-sm text-gray-600">
                  {form.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : "Pay Online (Razorpay)"}
                </p>
              </div>
              {paymentError && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">{paymentError}</div>
              )}
              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={handlePlaceOrder} size="lg" isLoading={loading}>
                  Place Order - {formatPrice(total)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-xl p-6 sticky top-28">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-60 overflow-y-auto mb-4">
              {items.map((item) => (
                <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                  <div className="relative w-14 h-18 shrink-0 rounded overflow-hidden bg-gray-200">
                    <Image src={item.image} alt={item.name} fill className="object-cover" sizes="56px" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.size} | {item.color} x{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg"
              />
              <Button size="sm" variant="outline" onClick={applyCoupon}>Apply</Button>
            </div>
            {couponError && <p className="text-xs text-red-500 mb-2">{couponError}</p>}
            {discount > 0 && (
              <p className="text-xs text-green-600 mb-2">Coupon applied! You save {formatPrice(discount)}</p>
            )}

            <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? "FREE" : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax (5% GST)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

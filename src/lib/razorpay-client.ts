declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, callback: (response: { error: { description: string } }) => void) => void;
}

interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayCheckoutData {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function openRazorpayCheckout(
  data: RazorpayCheckoutData,
  orderId: string,
  onSuccess: (orderNumber: string) => void,
  onError: (message: string) => void
): Promise<void> {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    onError("Failed to load payment gateway");
    return;
  }

  const options: RazorpayOptions = {
    key: data.keyId,
    amount: data.amount,
    currency: data.currency,
    name: "Aapnapasand",
    description: `Order ${data.orderNumber}`,
    order_id: data.razorpayOrderId,
    prefill: {
      name: data.customerName,
      email: data.customerEmail,
      contact: data.customerPhone,
    },
    theme: { color: "#2f1912" },
    handler: async (response) => {
      try {
        const verifyRes = await fetch("/api/payments/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId,
          }),
        });

        const verifyData = await verifyRes.json();
        if (verifyRes.ok) {
          onSuccess(verifyData.orderNumber);
        } else {
          onError(verifyData.error || "Payment verification failed");
        }
      } catch {
        onError("Payment verification failed");
      }
    },
    modal: {
      ondismiss: () => onError("Payment cancelled"),
    },
  };

  const razorpay = new window.Razorpay(options);
  razorpay.on("payment.failed", (response) => {
    onError(response.error.description);
  });
  razorpay.open();
}

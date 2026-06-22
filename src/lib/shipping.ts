export function generateTrackingNumber(): string {
  const prefix = "AP";
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefix}${timestamp}${random}`;
}

export function getTrackingUrl(trackingNumber: string): string {
  const base = process.env.SHIPPING_TRACK_URL || "https://www.delhivery.com/track/package";
  return `${base}/${trackingNumber}`;
}

export interface ShippingRate {
  name: string;
  cost: number;
  estimatedDays: string;
}

export function calculateShippingRates(subtotal: number, pincode: string): ShippingRate[] {
  const isMetro = ["110", "400", "560", "600", "700", "500"].some((p) => pincode.startsWith(p));

  if (subtotal >= 999) {
    return [{ name: "Standard (Free)", cost: 0, estimatedDays: isMetro ? "2-4 days" : "4-7 days" }];
  }

  return [
    { name: "Standard", cost: 99, estimatedDays: isMetro ? "3-5 days" : "5-8 days" },
    { name: "Express", cost: 199, estimatedDays: isMetro ? "1-2 days" : "2-4 days" },
  ];
}

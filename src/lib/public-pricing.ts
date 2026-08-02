import type { CurrencyCode, Product } from "@/types";

// FBIL reference rate published by RBI for 27 July 2026. Keep this configurable
// so storefront prices can be updated without changing catalog records.
export const USD_TO_INR_RATE = Number(process.env.USD_TO_INR_RATE) || 96.1856;

export function inrToUsd(amount: number) {
  return Math.round((amount / USD_TO_INR_RATE) * 100) / 100;
}

export function usdToInr(amount: number) {
  return Math.round(amount * USD_TO_INR_RATE * 100) / 100;
}

type PriceBearingProduct = {
  price: number;
  compareAtPrice?: number;
  currency?: CurrencyCode;
  variants?: Product["variants"];
};

export function toPublicUsdProduct<T extends PriceBearingProduct>(product: T): T {
  if (product.currency === "USD") return product;

  return {
    ...product,
    price: inrToUsd(product.price),
    compareAtPrice:
      product.compareAtPrice === undefined
        ? undefined
        : inrToUsd(product.compareAtPrice),
    currency: "USD",
    variants: product.variants?.map((variant) => ({
      ...variant,
      price:
        variant.price === undefined ? undefined : inrToUsd(variant.price),
    })),
  } as T;
}

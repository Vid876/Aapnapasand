import type { Product } from "@/types";

export type PurchaseChoice = {
  value: string;
  name: string;
  detail?: string;
  price?: number;
};

export type PurchaseOptions = {
  sizes: PurchaseChoice[];
  fabrics: PurchaseChoice[];
};

const SIZE_TOKEN =
  /fabric\s+sample(?:\s*10\s*[x×]\s*10)?|(?:2|two)\s+(?:extra\s+)?pillow(?:\s+covers?)?(?:\s*20\s*[x×]\s*30)?|cal(?:ifornia)?\.?\s*king|twin\s*xl|crib\s*\/\s*baby|baby\s*\/\s*crib|crib|baby|twin|full|double|queen|king|custom\s+size|one\s+size|\b(?:4|6|8|10|12|14|16)\s*(?:seater|seat)\b/gi;

const SIZE_ORDER = [
  "Fabric Sample",
  "2 Extra Pillow Covers",
  "Crib / Baby",
  "Twin",
  "Twin XL",
  "Full",
  "Queen",
  "King",
  "California King",
  "One Size",
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "XXXL",
  "4 Seater",
  "6 Seater",
  "8 Seater",
  "10 Seater",
  "12 Seater",
  "14 Seater",
  "16 Seater",
  "Custom Size",
] as const;

function normalizeText(value: string) {
  return value.replace(/Ã—/g, "×").replace(/â€“|â€”/g, "–").trim();
}

function canonicalSizeName(value: string) {
  const normalized = value.toLowerCase().replace(/\s+/g, " ").trim();

  if (normalized.startsWith("fabric sample")) return "Fabric Sample";
  if (normalized.includes("pillow")) return "2 Extra Pillow Covers";
  if (/cal(?:ifornia)?\.? king/.test(normalized)) return "California King";
  if (normalized === "twin xl") return "Twin XL";
  if (normalized === "twin") return "Twin";
  if (normalized === "full" || normalized === "double") return "Full";
  if (normalized === "queen") return "Queen";
  if (normalized === "king") return "King";
  if (normalized.includes("crib") || normalized === "baby") return "Crib / Baby";
  if (normalized === "custom size") return "Custom Size";
  if (normalized === "one size") return "One Size";
  if (/^\d+\s*(?:seater|seat)$/.test(normalized)) {
    return `${normalized.match(/^\d+/)?.[0]} Seater`;
  }

  const apparelSizes: Record<string, string> = {
    xs: "XS",
    small: "S",
    medium: "M",
    large: "L",
    xl: "XL",
    xxl: "XXL",
    xxxl: "XXXL",
  };

  return apparelSizes[normalized] || value.trim();
}

function getLineDetail(description: string, index: number) {
  const lineStart = Math.max(description.lastIndexOf("\n", index), 0);
  const nextNewline = description.indexOf("\n", index);
  const lineEnd = nextNewline === -1 ? description.length : nextNewline;
  const line = normalizeText(description.slice(lineStart, lineEnd));
  const dimensions = [
    ...line.matchAll(/\d+(?:\.\d+)?\s*(?:x|×)\s*\d+(?:\.\d+)?(?:\s*(?:inches?|in|cm|centimeters?))?/gi),
  ].map((match) => normalizeText(match[0]).replace(/\s*x\s*/i, " × "));

  return dimensions.length ? [...new Set(dimensions)].join("; ") : undefined;
}

function getDescriptionSizes(product: Product) {
  const description = normalizeText(product.description || "");
  const choices: PurchaseChoice[] = [];
  const seen = new Map<string, PurchaseChoice>();

  for (const match of description.matchAll(SIZE_TOKEN)) {
    const name = canonicalSizeName(match[0]);
    const key = name.toLowerCase();

    const detail = getLineDetail(description, match.index || 0);
    const existing = seen.get(key);
    if (existing) {
      existing.detail ??= detail;
      continue;
    }
    const choice = {
      value: name,
      name,
      detail,
    };
    seen.set(key, choice);
    choices.push(choice);
  }

  return choices.sort((first, second) => {
    const firstIndex = SIZE_ORDER.indexOf(first.name as (typeof SIZE_ORDER)[number]);
    const secondIndex = SIZE_ORDER.indexOf(second.name as (typeof SIZE_ORDER)[number]);
    return (firstIndex === -1 ? 999 : firstIndex) - (secondIndex === -1 ? 999 : secondIndex);
  });
}

function getVariantSizes(product: Product) {
  const choices: PurchaseChoice[] = [];
  const seen = new Set<string>();

  for (const variant of product.variants || []) {
    const rawSize = normalizeText(variant.size || "");
    if (!rawSize || /^os$/i.test(rawSize)) continue;

    const name = canonicalSizeName(rawSize);
    const key = name.toLowerCase();
    if (seen.has(key)) continue;

    seen.add(key);
    choices.push({
      value: name,
      name,
      price: variant.price,
    });
  }

  return choices;
}

function mergeSizeChoices(product: Product) {
  const descriptionChoices = getDescriptionSizes(product);
  const variantChoices = getVariantSizes(product);
  const merged: PurchaseChoice[] = [];
  const seen = new Set<string>();

  for (const choice of [...descriptionChoices, ...variantChoices]) {
    const key = choice.value.toLowerCase();
    const existing = merged.find((item) => item.value.toLowerCase() === key);

    if (existing) {
      existing.price ??= choice.price;
      existing.detail ??= choice.detail;
      continue;
    }

    seen.add(key);
    merged.push(choice);
  }

  if (merged.length) return merged;

  const rawFallback = product.variants?.[0]?.size || "One Size";
  const fallback = /^os$/i.test(rawFallback) ? "One Size" : rawFallback;
  return [{ value: fallback, name: fallback }];
}

function getFabricChoices(product: Product) {
  const values: PurchaseChoice[] = [];
  const seen = new Set<string>();
  const add = (value?: string, price?: number) => {
    const name = normalizeText(value || "");
    const normalized = name.toLowerCase();
    if (!name || normalized === "as shown" || seen.has(normalized)) return;
    seen.add(normalized);
    values.push({ value: name, name, price });
  };

  for (const variant of product.variants || []) {
    add(variant.fabric, variant.price);
  }

  const searchable = `${product.material || ""}\n${product.description || ""}`;
  const hasCotton = /\b(?:100%\s*)?cotton\b/i.test(searchable);
  const hasLinen = /\b(?:100%\s*)?linen\b/i.test(searchable);
  const hasBlend = /\bcotton\s*(?:\/|&|and|-)\s*linen\s+blend\b|\blinen\s*(?:\/|&|and|-)\s*cotton\s+blend\b/i.test(searchable);

  if (hasBlend) add("Cotton Linen Blend");
  if (hasCotton) add("Pure 100% Cotton");
  if (hasLinen) add("Pure 100% Linen");
  if (/\brayon\b/i.test(searchable)) add("Rayon");
  if (/\bsilk\b/i.test(searchable)) add("Silk");

  if (!values.length && product.material) add(product.material);
  return values;
}

export function getProductPurchaseOptions(product: Product): PurchaseOptions {
  return {
    sizes: mergeSizeChoices(product),
    fabrics: getFabricChoices(product),
  };
}

export function getChoicePrice(
  basePrice: number,
  size?: PurchaseChoice,
  fabric?: PurchaseChoice
) {
  return fabric?.price ?? size?.price ?? basePrice;
}

export function getChoicePriceRange(
  basePrice: number,
  choice: PurchaseChoice,
  otherChoices: PurchaseChoice[]
) {
  if (choice.price !== undefined) {
    return { min: choice.price, max: choice.price };
  }

  const knownPrices = otherChoices
    .map((otherChoice) => otherChoice.price)
    .filter((price): price is number => price !== undefined);
  const prices = knownPrices.length ? knownPrices : [basePrice];

  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export function getConciseProductDescription(product: Product) {
  return product.description.trim();
}

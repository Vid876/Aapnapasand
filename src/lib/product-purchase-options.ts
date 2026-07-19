import type { Product } from "@/types";

export type PurchaseChoice = {
  value: string;
  name: string;
  detail?: string;
  multiplier: number;
};

export type PurchaseOptions = {
  sizes: PurchaseChoice[];
  fabrics: PurchaseChoice[];
};

const BEDDING_CATEGORY_SLUGS = new Set([
  "duvet-covers",
  "wrinkle-duvet-covers",
  "linen-bedding-sets",
  "quilts",
]);

const BEDDING_SIZES: PurchaseChoice[] = [
  {
    value: "Fabric Sample 10x10",
    name: "Fabric Sample",
    detail: "10×10 in",
    multiplier: 1,
  },
  {
    value: "2 Extra Pillow Covers 20x30",
    name: "2 Extra Pillow Covers",
    detail: "20×30 in each",
    multiplier: 1.87,
  },
  {
    value: "Twin 68x90",
    name: "Twin Size",
    detail: "68×90 in",
    multiplier: 3.89,
  },
  {
    value: "Full 80x90",
    name: "Full Size",
    detail: "80×90 in",
    multiplier: 4.68,
  },
  {
    value: "Queen 90x90",
    name: "Queen Size",
    detail: "90×90 in",
    multiplier: 5.4,
  },
  {
    value: "King 90x104",
    name: "King Size",
    detail: "90×104 in",
    multiplier: 5.76,
  },
  {
    value: "California King 98x104",
    name: "California King",
    detail: "98×104 in",
    multiplier: 6.2,
  },
  {
    value: "Custom Size",
    name: "Custom Size",
    detail: "made to your measurements",
    multiplier: 8.1,
  },
];

const TABLE_SIZES: PurchaseChoice[] = [
  { value: "4 Seater", name: "4 Seater", detail: "60×60 in", multiplier: 1 },
  { value: "6 Seater", name: "6 Seater", detail: "60×90 in", multiplier: 1.2 },
  { value: "8 Seater", name: "8 Seater", detail: "70×108 in", multiplier: 1.45 },
  {
    value: "Custom Size",
    name: "Custom Size",
    detail: "made to your measurements",
    multiplier: 1.7,
  },
];

const CURTAIN_SIZES: PurchaseChoice[] = [
  {
    value: "Single Panel",
    name: "Single Panel",
    detail: "52×84 in",
    multiplier: 1,
  },
  {
    value: "Pair",
    name: "Pair of Panels",
    detail: "2 panels, 52×84 in each",
    multiplier: 1.9,
  },
  {
    value: "Custom Size",
    name: "Custom Size",
    detail: "made to your measurements",
    multiplier: 2.2,
  },
];

const APPAREL_SIZE_DETAILS: Record<string, string> = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large",
};

function getCategorySlug(product: Product) {
  if (typeof product.category !== "string") return product.category.slug;
  return product.subcategory || product.category;
}

function extractOneSizeMeasurement(description: string) {
  const width = description.match(
    /width\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:inches?|in|\")/i
  );
  const length = description.match(
    /length\s*[:\-]?\s*(\d+(?:\.\d+)?)\s*(?:inches?|in|\")/i
  );

  if (width && length) {
    return `Width ${width[1]} in × Length ${length[1]} in`;
  }

  const dimensions = description.match(
    /(?:size\s*[:\-]?\s*)?(\d+(?:\.\d+)?\s*[x×]\s*\d+(?:\.\d+)?)\s*(?:inches?|in|\")/i
  );

  return dimensions ? `${dimensions[1].replace(/x/i, "×")} in` : undefined;
}

function getSizeChoices(product: Product): PurchaseChoice[] {
  const categorySlug = getCategorySlug(product);

  if (BEDDING_CATEGORY_SLUGS.has(categorySlug)) return BEDDING_SIZES;
  if (categorySlug === "tablecloths") return TABLE_SIZES;
  if (categorySlug === "linen-curtains") return CURTAIN_SIZES;

  const existingSizes = [
    ...new Set((product.variants || []).map((variant) => variant.size).filter(Boolean)),
  ];

  if (existingSizes.length > 1) {
    return existingSizes.map((size, index) => ({
      value: size,
      name: size,
      detail: APPAREL_SIZE_DETAILS[size],
      multiplier: index < 2 ? 1 : 1 + (index - 1) * 0.05,
    }));
  }

  const size = existingSizes[0] || "One Size";
  return [
    {
      value: size,
      name: size,
      detail:
        extractOneSizeMeasurement(product.description) ||
        (size === "One Size" ? "measurements in item details" : undefined),
      multiplier: 1,
    },
  ];
}

function getFabricChoices(product: Product): PurchaseChoice[] {
  const searchableText = `${product.material || ""} ${product.description}`.toLowerCase();
  const hasCotton = searchableText.includes("cotton");
  const hasLinen = searchableText.includes("linen");

  if (hasCotton && hasLinen) {
    return [
      {
        value: "Pure 100% Cotton",
        name: "Pure 100% Cotton",
        detail: "soft, breathable everyday fabric",
        multiplier: 1,
      },
      {
        value: "Pure 100% Linen",
        name: "Pure 100% Linen",
        detail: "premium natural textured fabric",
        multiplier: 1.09,
      },
    ];
  }

  if (hasLinen) {
    return [
      {
        value: "Pure 100% Linen",
        name: "Pure 100% Linen",
        detail: "premium natural textured fabric",
        multiplier: 1,
      },
    ];
  }

  if (hasCotton) {
    return [
      {
        value: "Pure 100% Cotton",
        name: "Pure 100% Cotton",
        detail: "soft, breathable handcrafted fabric",
        multiplier: 1,
      },
    ];
  }

  return [
    {
      value: "As Shown",
      name: product.material || "As Shown",
      detail: "material and colour shown in the photos",
      multiplier: 1,
    },
  ];
}

export function getProductPurchaseOptions(product: Product): PurchaseOptions {
  return {
    sizes: getSizeChoices(product),
    fabrics: getFabricChoices(product),
  };
}

export function getChoicePrice(
  basePrice: number,
  size?: PurchaseChoice,
  fabric?: PurchaseChoice
) {
  return Math.round(
    basePrice * (size?.multiplier || 1) * (fabric?.multiplier || 1)
  );
}

export function getChoicePriceRange(
  basePrice: number,
  choice: PurchaseChoice,
  otherChoices: PurchaseChoice[]
) {
  const prices = otherChoices.map((otherChoice) =>
    Math.round(basePrice * choice.multiplier * otherChoice.multiplier)
  );

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}

export function getConciseProductDescription(product: Product) {
  const categorySlug = getCategorySlug(product);
  if (!BEDDING_CATEGORY_SLUGS.has(categorySlug)) return product.description.trim();

  const marker = product.description.search(/\n\s*(?:size chart|(?:us|uk|australia).*size chart)\b/i);
  return (marker > 0 ? product.description.slice(0, marker) : product.description).trim();
}

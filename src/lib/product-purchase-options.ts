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

const BASIC_SIZE_TOKEN =
  /fabric\s+sample(?:\s*10\s*[x×]\s*10)?|(?:2|two)\s+(?:extra\s+)?pillow(?:\s+covers?)?|cal(?:ifornia)?\.?\s*king|twin\s*xl|crib\s*\/\s*baby|baby\s*\/\s*crib|custom\s+size|one\s+size|\b(?:xs|s|m|l|xl|xxl|xxxl|twin|full|double|queen|king)\b|\b(?:1|2)\s*yards?\b|\b(?:4|6|8|10|12|14|16)\s*(?:seater|seat)\b/gi;

const SIZE_SECTION_HEADING =
  /\b(?:size\s*chart|size\s*guide|available\s+(?:curtain\s+|duvet\s+|table\s+)?sizes?|size\s+information|size\s+details?|measurement\s*chart|dimensions?)\b/i;

const NEXT_SECTION_HEADING =
  /^(?:care|washing|wash care|included|what(?:'s| is) included|product details|item details|details|materials?|fabric|why you(?:'|’)ll love it|shipping|delivery|returns?|taxes?|important notes?|note|usage|welcome|customization|disclaimer)\b/i;

function normalizeText(value: string) {
  return value
    .replace(/Ãƒâ€”|Ã—/g, "×")
    .replace(/Ã¢â‚¬â€œ|Ã¢â‚¬â€|â€“|â€”/g, "–")
    .replace(/\u00a0/g, " ")
    .trim();
}

function stripDecoration(value: string) {
  return normalizeText(value)
    .replace(/^[^A-Za-z0-9]+/, "")
    .replace(/^[•◆●▪✓✔✦✨🌿📏🛏️🇺🇸🇦🇺🇬🇧]+\s*/u, "")
    .trim();
}

function getDimensions(value: string) {
  return [
    ...normalizeText(value).matchAll(
      /\d+(?:\.\d+)?\s*(?:x|×)\s*\d+(?:\.\d+)?(?:\s*(?:inches?|inch|in|cm|centimeters?))?/gi
    ),
  ].map((match) =>
    normalizeText(match[0]).replace(/\s*(?:x|×)\s*/i, " × ")
  );
}

function canonicalSizeName(value: string) {
  const normalized = stripDecoration(value)
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (/^os$|^one size$/.test(normalized)) return "One Size";
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
  if (/^\d+\s*(?:seater|seat)$/.test(normalized)) {
    return `${normalized.match(/^\d+/)?.[0]} Seater`;
  }
  if (/^(?:1|2)\s*yards?$/.test(normalized)) {
    return `${normalized.match(/^\d+/)?.[0]} Yard`;
  }

  const apparelSizes: Record<string, string> = {
    xs: "XS",
    s: "S",
    small: "S",
    m: "M",
    medium: "M",
    l: "L",
    large: "L",
    xl: "XL",
    xxl: "XXL",
    xxxl: "XXXL",
  };

  return apparelSizes[normalized] || stripDecoration(value);
}

function getSectionPrefix(line: string) {
  const normalized = stripDecoration(line).toLowerCase();
  if (/\baustralia|\bau\b/.test(normalized)) return "AU";
  if (/\bunited kingdom|\buk\b/.test(normalized)) return "UK";
  if (/\bunited states|\bus\b/.test(normalized)) return "US";
  return "";
}

function cleanChartLabel(value: string, sectionPrefix: string) {
  let label = stripDecoration(value)
    .replace(/[-–—:|]+$/g, "")
    .replace(/\b(?:duvet|doona|quilt|cover)\b/gi, "")
    .replace(/\bsize\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!label) return "";
  if (sectionPrefix && !/^(?:US|AU|UK)\b/i.test(label)) {
    label = `${sectionPrefix} ${label}`;
  }

  return label
    .replace(/^us\b/i, "US")
    .replace(/^au\b/i, "AU")
    .replace(/^uk\b/i, "UK")
    .replace(/cal(?:ifornia)?\.?\s*king/i, "California King")
    .replace(/twin\s*xl/i, "Twin XL")
    .replace(/super\s*king/i, "Super King")
    .replace(/over\s*size(?:d)?/i, "Oversized")
    .trim();
}

function makeChoiceValue(name: string, detail?: string) {
  return detail ? `${name} — ${detail}` : name;
}

function getDescriptionSizes(product: Product) {
  const lines = normalizeText(product.description || "").split(/\r?\n/);
  const choices: PurchaseChoice[] = [];
  let inSizeSection = false;
  let sectionPrefix = "";
  let lastChoice: PurchaseChoice | undefined;

  const addChoice = (name: string, detail?: string) => {
    const cleanName = stripDecoration(name);
    if (!cleanName) return;
    const value = makeChoiceValue(cleanName, detail);
    if (choices.some((choice) => choice.value.toLowerCase() === value.toLowerCase())) {
      return;
    }
    const choice = { value, name: cleanName, detail };
    choices.push(choice);
    lastChoice = choice;
  };

  for (const rawLine of lines) {
    const line = stripDecoration(rawLine);
    if (!line) continue;

    const dimensions = getDimensions(line);
    const isSizeHeading = SIZE_SECTION_HEADING.test(line);
    if (isSizeHeading) {
      inSizeSection = true;
      sectionPrefix = getSectionPrefix(line) || sectionPrefix;
      if (!dimensions.length) continue;
    }

    if (
      inSizeSection &&
      !isSizeHeading &&
      !dimensions.length &&
      NEXT_SECTION_HEADING.test(line)
    ) {
      inSizeSection = false;
      sectionPrefix = "";
      lastChoice = undefined;
    }

    if (!inSizeSection) {
      if (/\bsize(?:s| options?)?\s*[:–-]/i.test(line)) {
        for (const match of line.matchAll(BASIC_SIZE_TOKEN)) {
          const name = canonicalSizeName(match[0]);
          addChoice(name);
        }
      }
      continue;
    }

    if (/pillow/i.test(line) && dimensions.length && lastChoice) {
      const pillowDetail = `Pillow: ${dimensions.join(" / ")}`;
      lastChoice.detail = lastChoice.detail
        ? `${lastChoice.detail}; ${pillowDetail}`
        : pillowDetail;
      lastChoice.value = makeChoiceValue(lastChoice.name, lastChoice.detail);
      continue;
    }

    if (dimensions.length) {
      const firstDimensionIndex = normalizeText(line).search(
        /\d+(?:\.\d+)?\s*(?:x|×)\s*\d+(?:\.\d+)?/i
      );
      const rawLabel =
        firstDimensionIndex > 0
          ? normalizeText(line).slice(0, firstDimensionIndex)
          : "";
      const label = cleanChartLabel(rawLabel, sectionPrefix);
      const detail = dimensions.join(" / ");
      addChoice(label || dimensions[0], label ? detail : dimensions.slice(1).join(" / ") || undefined);
      continue;
    }

    if (/custom\s+size/i.test(line)) {
      addChoice("Custom Size");
    }
  }

  return choices;
}

function getVariantSizes(product: Product) {
  const choices: PurchaseChoice[] = [];
  const seen = new Set<string>();

  for (const variant of product.variants || []) {
    const rawSize = normalizeText(variant.size || "");
    if (!rawSize) continue;
    const name = canonicalSizeName(rawSize);
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    choices.push({ value: name, name, price: variant.price });
  }

  return choices;
}

function baseSizeKey(value: string) {
  return value
    .toLowerCase()
    .replace(/^(?:us|au|uk)\s+/, "")
    .replace(/\([^)]*\)/g, "")
    .replace(/\b(?:standard|extended|super|oversized)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mergeSizeChoices(product: Product) {
  const descriptionChoices = getDescriptionSizes(product);
  const variantChoices = getVariantSizes(product);

  if (descriptionChoices.length) {
    for (const variant of variantChoices) {
      const variantKey = baseSizeKey(variant.name);
      const matching = descriptionChoices.filter((choice) =>
        baseSizeKey(choice.name).endsWith(variantKey)
      );
      if (matching.length) {
        matching.forEach((choice) => {
          choice.price ??= variant.price;
        });
      } else {
        descriptionChoices.push(variant);
      }
    }
    return descriptionChoices;
  }

  return variantChoices.length
    ? variantChoices
    : [{ value: "One Size", name: "One Size" }];
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

  for (const variant of product.variants || []) add(variant.fabric, variant.price);

  const searchable = `${product.material || ""}\n${product.description || ""}`;
  const hasCotton = /\b(?:100%\s*)?cotton\b/i.test(searchable);
  const hasLinen = /\b(?:100%\s*)?linen\b/i.test(searchable);
  const hasBlend =
    /\bcotton\s*(?:\/|&|and|-)\s*linen\s+blend\b|\blinen\s*(?:\/|&|and|-)\s*cotton\s+blend\b/i.test(
      searchable
    );

  if (hasBlend) add("Cotton Linen Blend");
  if (hasCotton) add("Pure 100% Cotton");
  if (hasLinen) add("Pure 100% Linen");
  if (/\brayon\b/i.test(searchable)) add("Rayon");
  if (/\bsilk\b/i.test(searchable)) add("Silk");
  if (!values.length && product.material) add(product.material);
  return values;
}

function stripSizeChartBlocks(description: string) {
  const lines = normalizeText(description).split(/\r?\n/);
  const kept: string[] = [];
  let inSizeSection = false;

  for (const rawLine of lines) {
    const line = stripDecoration(rawLine);
    const dimensions = getDimensions(line);
    const isSizeHeading = SIZE_SECTION_HEADING.test(line);

    if (isSizeHeading) {
      inSizeSection = true;
      continue;
    }

    if (
      inSizeSection &&
      line &&
      !dimensions.length &&
      NEXT_SECTION_HEADING.test(line)
    ) {
      inSizeSection = false;
    }

    if (!inSizeSection) kept.push(rawLine.trimEnd());
  }

  return kept.join("\n").replace(/\n{3,}/g, "\n\n").trim();
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
  return stripSizeChartBlocks(product.description || "");
}

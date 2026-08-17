import type { Product } from "@/types";

export type PurchaseChoice = {
  value: string;
  name: string;
  detail?: string;
  price?: number;
  priceMultiplier?: number;
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

function roundPrice(value: number) {
  return Math.round(value * 100) / 100;
}

function getSizePriceFactor(choice: PurchaseChoice, index: number) {
  const value = choice.name.toLowerCase();

  if (value.includes("fabric sample")) return 1;
  if (value.includes("pillow")) return 2.1;
  if (value.includes("custom")) return 8.1;
  if (value.includes("crib") || value.includes("baby")) return 0.85;
  if (value.includes("california king")) return 6.2;
  if (value.includes("super king")) return 6.55;
  if (value.includes("twin xl")) return 3.95;
  if (/\btwin\b/.test(value)) return 3.55;
  if (/\bfull\b|\bdouble\b/.test(value)) return 4.7;
  if (/\bqueen\b/.test(value)) return 5.4;
  if (/\bking\b/.test(value)) return 5.8;
  if (/\bover(?:sized)?\b/.test(value)) return 6.8 + index * 0.12;
  if (value.includes("pair")) return 1.9;
  if (value.includes("single panel")) return 1;

  const seater = value.match(/\b(4|6|8|10|12|14|16)\s*(?:seater|seat)\b/);
  if (seater) return Number(seater[1]) / 4;

  const yards = value.match(/\b(1|2)\s*yards?\b/);
  if (yards) return Number(yards[1]) === 1 ? 1 : 1.9;

  const apparelFactors: Array<[RegExp, number]> = [
    [/\bxxxl\b/, 1.38],
    [/\bxxl\b/, 1.28],
    [/\bxl\b/, 1.18],
    [/\bl\b|\blarge\b/, 1.1],
    [/\bm\b|\bmedium\b/, 1.05],
    [/\bxs\b|\bs\b|\bsmall\b/, 1],
  ];
  const apparelFactor = apparelFactors.find(([pattern]) => pattern.test(value));
  if (apparelFactor) return apparelFactor[1];

  if (value.includes("one size") || value.trim() === "set") return 1;
  return 1 + index * 0.18;
}

function applyFallbackSizePrices(product: Product, choices: PurchaseChoice[]) {
  if (!choices.length || !Number.isFinite(product.price) || product.price <= 0) {
    return choices;
  }

  const factors = choices.map(getSizePriceFactor);
  const baseline = Math.min(...factors);
  const explicitPrices = choices
    .map((choice) => choice.price)
    .filter((price): price is number => price !== undefined);
  const hasRealVariantPriceVariation = new Set(
    explicitPrices.map((price) => roundPrice(price))
  ).size > 1;

  return choices.map((choice, index) => {
    if (choice.price !== undefined && hasRealVariantPriceVariation) {
      return choice;
    }

    const normalizedFactor = factors[index] / baseline;
    return {
      ...choice,
      price: roundPrice(product.price * normalizedFactor),
    };
  });
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
    return applyFallbackSizePrices(product, descriptionChoices);
  }

  const choices = variantChoices.length
    ? variantChoices
    : [{ value: "One Size", name: "One Size" }];
  return applyFallbackSizePrices(product, choices);
}

function getFabricChoices(product: Product) {
  const values: PurchaseChoice[] = [];
  const seen = new Set<string>();
  const add = (value?: string, priceMultiplier = 1) => {
    const name = normalizeText(value || "");
    const normalized = name.toLowerCase();
    if (!name || normalized === "as shown" || seen.has(normalized)) return;
    seen.add(normalized);
    values.push({ value: name, name, priceMultiplier });
  };

  const multiplierForFabric = (value?: string) => {
    const normalized = normalizeText(value || "").toLowerCase();
    if (normalized.includes("silk")) return 1.35;
    if (normalized.includes("linen") && normalized.includes("cotton")) return 1.1;
    if (normalized.includes("linen")) return 1.22;
    if (normalized.includes("rayon")) return 0.95;
    return 1;
  };

  for (const variant of product.variants || []) {
    add(variant.fabric, multiplierForFabric(variant.fabric));
  }

  const searchable = `${product.material || ""}\n${product.description || ""}`;
  const hasCotton = /\b(?:100%\s*)?cotton\b/i.test(searchable);
  const hasLinen = /\b(?:100%\s*)?linen\b/i.test(searchable);
  const hasBlend =
    /\bcotton\s*(?:\/|&|and|-)\s*linen\s+blend\b|\blinen\s*(?:\/|&|and|-)\s*cotton\s+blend\b/i.test(
      searchable
    );

  if (hasBlend) add("Cotton Linen Blend", 1.1);
  if (hasCotton) add("Pure 100% Cotton", 1);
  if (hasLinen) add("Pure 100% Linen", 1.22);
  if (/\brayon\b/i.test(searchable)) add("Rayon", 0.95);
  if (/\bsilk\b/i.test(searchable)) add("Silk", 1.35);
  if (!values.length && product.material) {
    add(product.material, multiplierForFabric(product.material));
  }

  if (values.length === 1) values[0].priceMultiplier = 1;
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
  const sizePrice = size?.price ?? basePrice;
  if (fabric?.priceMultiplier !== undefined) {
    return roundPrice(sizePrice * fabric.priceMultiplier);
  }
  return fabric?.price ?? sizePrice;
}

export function getChoicePriceRange(
  basePrice: number,
  choice: PurchaseChoice,
  otherChoices: PurchaseChoice[]
) {
  if (choice.priceMultiplier !== undefined) {
    const sizePrices = otherChoices.length
      ? otherChoices.map((otherChoice) => otherChoice.price ?? basePrice)
      : [basePrice];
    return {
      min: roundPrice(Math.min(...sizePrices) * choice.priceMultiplier),
      max: roundPrice(Math.max(...sizePrices) * choice.priceMultiplier),
    };
  }

  const choicePrice = choice.price ?? basePrice;
  const multipliers = otherChoices
    .map((otherChoice) => otherChoice.priceMultiplier)
    .filter((multiplier): multiplier is number => multiplier !== undefined);
  if (!multipliers.length) return { min: choicePrice, max: choicePrice };

  return {
    min: roundPrice(choicePrice * Math.min(...multipliers)),
    max: roundPrice(choicePrice * Math.max(...multipliers)),
  };
}

export function getConciseProductDescription(product: Product) {
  return stripSizeChartBlocks(product.description || "");
}

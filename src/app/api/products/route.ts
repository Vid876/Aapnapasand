import { NextRequest, NextResponse } from "next/server";
import { publicJson } from "@/lib/api-response";
import { connectDB } from "@/lib/db";
import { PRODUCT_IMAGE_FILTER } from "@/lib/image-utils";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import {
  CATEGORY_ALIASES,
  getCanonicalCategorySlug,
} from "@/lib/category-aliases";
import { toPublicProductRating } from "@/lib/public-rating";

function getList(searchParams: URLSearchParams, key: string) {
  return searchParams
    .getAll(key)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function positiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value || "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function resolveCategoryIds(values: string[]) {
  const objectIds = values.filter((value) => /^[0-9a-fA-F]{24}$/.test(value));
  const slugs = values.filter((value) => !/^[0-9a-fA-F]{24}$/.test(value));
  const expandedSlugs = new Set<string>();

  for (const slug of slugs) {
    const canonical = getCanonicalCategorySlug(slug);
    expandedSlugs.add(canonical);
    for (const [source, target] of Object.entries(CATEGORY_ALIASES)) {
      if (target === canonical) expandedSlugs.add(source);
    }
  }

  const categories = expandedSlugs.size
    ? await Category.find({
        slug: { $in: [...expandedSlugs] },
        isActive: true,
      })
        .select("_id")
        .lean()
    : [];

  return [...objectIds, ...categories.map((category) => category._id)];
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const categories = getList(searchParams, "category");
    const sizes = getList(searchParams, "size");
    const colors = getList(searchParams, "color");
    const fabrics = getList(searchParams, "fabric");
    const ids = getList(searchParams, "ids").filter((id) =>
      /^[0-9a-fA-F]{24}$/.test(id)
    );
    const gender = searchParams.get("gender");
    const search = searchParams.get("search")?.trim();
    const minPrice = searchParams.has("minPrice")
      ? Number(searchParams.get("minPrice"))
      : Number.NaN;
    const maxPrice = searchParams.has("maxPrice")
      ? Number(searchParams.get("maxPrice"))
      : Number.NaN;
    const minRating = searchParams.has("minRating")
      ? Number(searchParams.get("minRating"))
      : Number.NaN;
    const sort = searchParams.get("sort") || "newest";
    const featured = searchParams.get("featured");
    const page = positiveInteger(searchParams.get("page"), 1);
    const requestedLimit = positiveInteger(searchParams.get("limit"), 12);
    const limit = Math.min(requestedLimit, ids.length ? 100 : 50);

    const filter: Record<string, unknown> = {
      isActive: true,
      ...PRODUCT_IMAGE_FILTER,
    };
    const andConditions: Record<string, unknown>[] = [];

    if (ids.length) filter._id = { $in: ids };

    if (categories.length) {
      const categoryIds = await resolveCategoryIds(categories);
      if (!categoryIds.length) {
        return publicJson({
          products: [],
          pagination: { page: 1, limit, total: 0, pages: 0 },
        });
      }
      filter.category = { $in: categoryIds };
    }

    if (gender) filter.gender = gender;
    if (featured === "true") filter.isFeatured = true;

    if (Number.isFinite(minPrice) || Number.isFinite(maxPrice)) {
      const priceFilter: Record<string, number> = {};
      if (Number.isFinite(minPrice) && minPrice >= 0) priceFilter.$gte = minPrice;
      if (Number.isFinite(maxPrice) && maxPrice >= 0) priceFilter.$lte = maxPrice;
      if (Object.keys(priceFilter).length) filter.price = priceFilter;
    }

    if (Number.isFinite(minRating) && minRating >= 3) {
      filter.rating = { $gte: Math.min(minRating, 5) };
    }

    if (sizes.length) {
      andConditions.push({
        $or: [
          { "variants.size": { $in: sizes } },
          {
            description: {
              $regex: sizes.map(escapeRegex).join("|"),
              $options: "i",
            },
          },
        ],
      });
    }

    if (colors.length) {
      andConditions.push({
        $or: [
          { "variants.color": { $in: colors } },
          {
            name: {
              $regex: colors.map(escapeRegex).join("|"),
              $options: "i",
            },
          },
        ],
      });
    }

    if (fabrics.length) {
      const fabricPattern = fabrics.map(escapeRegex).join("|");
      andConditions.push({
        $or: [
          { "variants.fabric": { $in: fabrics } },
          { material: { $regex: fabricPattern, $options: "i" } },
          { description: { $regex: fabricPattern, $options: "i" } },
        ],
      });
    }

    if (andConditions.length) filter.$and = andConditions;
    if (search) filter.$text = { $search: search };

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case "price-asc":
        sortOption = { price: 1 };
        break;
      case "price-desc":
        sortOption = { price: -1 };
        break;
      case "rating":
        sortOption = { rating: -1, reviewCount: -1 };
        break;
      case "popular":
        sortOption = { reviewCount: -1, rating: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(filter),
    ]);

    return publicJson(
      {
        products: products.map((product) => toPublicProductRating(product)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
      search ? 10 : 30
    );
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

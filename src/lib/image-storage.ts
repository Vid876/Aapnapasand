import { unlink } from "fs/promises";
import path from "path";
import { Category } from "@/models/Category";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { getCloudinary } from "@/lib/cloudinary";

function getLocalUploadPath(url: string): string | null {
  if (!url.startsWith("/uploads/")) return null;

  const uploadDir = path.resolve(process.cwd(), "public", "uploads");
  const filename = decodeURIComponent(url.slice("/uploads/".length));
  const target = path.resolve(uploadDir, filename);

  if (!target.startsWith(`${uploadDir}${path.sep}`)) {
    throw new Error("Invalid upload path");
  }

  return target;
}

function getCloudinaryPublicId(url: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.hostname !== "res.cloudinary.com") return null;

  const parts = parsed.pathname.split("/").filter(Boolean);
  const uploadIndex = parts.indexOf("upload");
  if (uploadIndex < 0) return null;

  const publicIdParts = parts.slice(uploadIndex + 1);
  if (publicIdParts[0]?.startsWith("v") && /^v\d+$/.test(publicIdParts[0])) {
    publicIdParts.shift();
  }

  const publicId = publicIdParts.join("/").replace(/\.[a-z0-9]+$/i, "");
  return publicId || null;
}

export async function deleteStoredImage(url: string): Promise<void> {
  const localPath = getLocalUploadPath(url);
  if (localPath) {
    await unlink(localPath).catch((error: NodeJS.ErrnoException) => {
      if (error.code !== "ENOENT") throw error;
    });
    return;
  }

  const publicId = getCloudinaryPublicId(url);
  const cloudinary = publicId ? getCloudinary() : null;
  if (cloudinary && publicId) {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  }
}

export async function deleteImagesIfUnused(urls: string[]): Promise<void> {
  const uniqueUrls = Array.from(new Set(urls.filter(Boolean)));

  await Promise.all(
    uniqueUrls.map(async (url) => {
      const [productUses, categoryUses, orderUses] = await Promise.all([
        Product.countDocuments({ images: url }),
        Category.countDocuments({ image: url }),
        Order.countDocuments({ "items.image": url }),
      ]);

      if (productUses === 0 && categoryUses === 0 && orderUses === 0) {
        await deleteStoredImage(url);
      }
    })
  );
}

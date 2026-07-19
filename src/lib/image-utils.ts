export const UPLOADED_IMAGE_PATTERN =
  "^(\\/uploads\\/|https:\\/\\/(res\\.cloudinary\\.com|i\\.etsystatic\\.com)\\/)";

export const PRODUCT_IMAGE_FILTER = {
  "images.0": { $regex: UPLOADED_IMAGE_PATTERN },
};

export const CATEGORY_IMAGE_FILTER = {
  image: { $regex: UPLOADED_IMAGE_PATTERN },
};

export function isValidStoredImage(value: string): boolean {
  if (!value) return false;
  if (value.startsWith("/uploads/")) return true;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["res.cloudinary.com", "i.etsystatic.com"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function isNextImageCompatible(value?: string): value is string {
  if (!value) return false;
  if (value.startsWith("/")) return true;

  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      ["res.cloudinary.com", "i.etsystatic.com"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}

export function getRenderableImageSrc(value?: string): string | undefined {
  return value;
}

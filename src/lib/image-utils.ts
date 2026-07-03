export const PRODUCT_IMAGE_FILTER = {
  "images.0": { $exists: true, $nin: ["", null] },
};

export function isValidStoredImage(value: string): boolean {
  if (!value) return false;
  if (value.startsWith("/uploads/")) return true;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
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
      (url.hostname === "images.unsplash.com" || url.hostname === "res.cloudinary.com")
    );
  } catch {
    return false;
  }
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { uploadImage, isCloudinaryConfigured } from "@/lib/cloudinary";
import { deleteImagesIfUnused } from "@/lib/image-storage";
import { saveLocalImage } from "@/lib/local-upload";

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported image format. Upload JPG, PNG, or WebP." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image size exceeds 5 MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let url: string;

    if (isCloudinaryConfigured()) {
      url = await uploadImage(buffer);
    } else {
      url = await saveLocalImage(file);
    }

    return NextResponse.json({ url, storage: isCloudinaryConfigured() ? "cloudinary" : "local" });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed, please try again." }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { url } = await request.json();
    if (typeof url !== "string" || !url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    await deleteImagesIfUnused([url]);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Image delete error:", error);
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 });
  }
}

"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Star, GripVertical } from "lucide-react";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  label?: string;
  helperText?: string;
  multiple?: boolean;
}

export function ImageUpload({
  images,
  onChange,
  label = "Product Images",
  helperText = "First image = main product photo",
  multiple = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Upload failed");
    }
    return data.url;
  };

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      setError("Please select image files only");
      return;
    }

    setUploading(true);
    setError("");
    setUploadCount(imageFiles.length);

    const uploaded: string[] = [];
    try {
      for (const file of imageFiles) {
        if (file.size > 5 * 1024 * 1024) {
          setError(`${file.name} exceeds 5MB limit`);
          continue;
        }
        const url = await uploadFile(file);
        if (url) uploaded.push(url);
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      setUploadCount(0);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [images]
  );

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setPrimary = (index: number) => {
    if (index === 0) return;
    const reordered = [...images];
    const [img] = reordered.splice(index, 1);
    reordered.unshift(img);
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-gray-900">
          {label} {images.length > 0 && `(${images.length})`}
        </label>
        {images.length > 0 && (
          <span className="text-xs text-gray-500">{helperText}</span>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {images.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className={`relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group border-2 ${
                i === 0 ? "border-brand-600 ring-2 ring-brand-200" : "border-gray-200"
              }`}
            >
              <Image src={url} alt="" fill className="object-cover" sizes="120px" />
              {i === 0 && (
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-brand-600 text-white text-[10px] font-bold rounded flex items-center gap-0.5">
                  <Star size={8} className="fill-white" /> MAIN
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    title="Set as main image"
                    className="p-1.5 bg-white rounded-full text-brand-600 hover:bg-brand-50"
                  >
                    <Star size={14} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-600"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="absolute bottom-1 left-1 p-0.5 bg-white/80 rounded opacity-0 group-hover:opacity-100">
                <GripVertical size={12} className="text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-xl cursor-pointer transition-colors ${
          dragOver
            ? "border-brand-600 bg-brand-50"
            : "border-gray-300 hover:border-brand-500 hover:bg-gray-50"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        {uploading ? (
          <>
            <Loader2 size={32} className="animate-spin text-brand-600" />
            <p className="text-sm text-gray-600">Uploading {uploadCount} image(s)...</p>
          </>
        ) : (
          <>
            <div className="p-3 bg-brand-100 rounded-full">
              <Upload size={24} className="text-brand-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                Drag & drop images here, or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
            </div>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

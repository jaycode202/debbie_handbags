"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Save,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/currency";

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [published, setPublished] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError("");
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      if (!name.trim()) {
        throw new Error("Product name is required.");
      }

      if (!price || Number(price) <= 0) {
        throw new Error("Enter a valid price.");
      }

      if (!category) {
        throw new Error("Please select a category.");
      }

      if (stock === "" || Number(stock) < 0) {
        throw new Error("Enter a valid stock quantity.");
      }

      let imageUrl: string | null = null;

      // Upload image
      if (image) {
        const extension = image.name.split(".").pop();

        const fileName = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2)}.${extension}`;

        const filePath = `products/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(filePath, image);

        if (uploadError) {
          throw new Error(
            `Image upload failed: ${uploadError.message}`
          );
        }

        const { data } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        imageUrl = data.publicUrl;
      }

      // Save product
      const { error: productError } = await supabase
        .from("products")
        .insert({
          name: name.trim(),
          description: description.trim(),
          price: Number (price),
          category,
          stock: Number(stock),
          published,
          image_url: imageUrl,
        });

      if (productError) {
        throw new Error(
          `Product save failed: ${productError.message}`
        );
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/products"
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Add Product
          </h1>

          <p className="text-gray-500 mt-1">
            Add a new handbag to your store
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Product information */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Product Information
            </h2>

            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elegant Pink Handbag"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the handbag..."
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                     Price (ZMW)
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="450"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select category</option>
                  <option value="Handbags">Handbags</option>
                  <option value="Shoulder Bags">
                    Shoulder Bags
                  </option>
                  <option value="Crossbody Bags">
                    Crossbody Bags
                  </option>
                  <option value="Tote Bags">
                    Tote Bags
                  </option>
                  <option value="Clutches">Clutches</option>
                  <option value="Backpacks">Backpacks</option>
                </select>
              </div>

            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">

            {/* Image upload */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Product Image
              </h2>

              <label className="block cursor-pointer">

                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Product preview"
                      className="w-full aspect-square object-cover rounded-xl"
                    />

                    <div className="absolute bottom-3 left-3 right-3 bg-black/60 text-white text-sm text-center py-2 rounded-lg">
                      Click to change image
                    </div>
                  </div>
                ) : (
                  <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-pink-400 transition">
                    <ImagePlus className="w-10 h-10 text-gray-400 mb-3" />

                    <p className="font-medium text-gray-600">
                      Upload image
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      JPG, PNG up to 5MB
                    </p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

              </label>
            </div>

            {/* Published */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between">

                <div>
                  <h2 className="font-semibold text-gray-900">
                    Publish Product
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Make this product visible in the store.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPublished(!published)}
                  className={`relative w-12 h-6 rounded-full transition ${
                    published
                      ? "bg-pink-600"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      published
                        ? "left-7"
                        : "left-1"
                    }`}
                  />
                </button>

              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm">
                {error}
              </div>
            )}

            {/* Save */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-300 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving Product...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Add Product
                </>
              )}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
}
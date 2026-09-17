"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  ShoppingBag,
  Pencil,
  Trash2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  stock: number;
  published: boolean;
  image_url: string | null;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading products:", error);
    } else {
      setProducts(data ?? []);
    }

    setLoading(false);
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting product:", error);
      return;
    }

    setProducts((current) =>
      current.filter((product) => product.id !== id)
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between border-b border-pink-100 bg-white px-6 lg:px-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Products
          </h1>

          <p className="text-sm text-gray-500">
            Manage your handbag collection
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </header>

      <div className="p-6 lg:p-10">
        {loading ? (
          <div className="py-20 text-center text-gray-500">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-pink-200 bg-white py-20 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-pink-300" />

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              No products yet
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Add your first handbag to get started.
            </p>

            <Link
              href="/admin/products/new"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-pink-100 bg-pink-50/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Category
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Stock
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-pink-50">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-pink-50">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ShoppingBag className="h-5 w-5 text-pink-300" />
                            )}
                          </div>

                          <span className="font-semibold text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {product.category}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        ${Number(product.price).toFixed(2)}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {product.stock === 0 ? (
                          <span className="font-semibold text-red-500">
                            0
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            {product.stock}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        {product.stock === 0 ? (
                          <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                            Sold Out
                          </span>
                        ) : product.published ? (
                          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-600">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500">
                            Draft
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            className="rounded-lg p-2 text-gray-500 hover:bg-pink-50 hover:text-pink-600"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-500"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
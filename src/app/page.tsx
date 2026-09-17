import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddToCartButton from "./components/cart/AddToCartButton";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  stock: number;
};

export default async function HomePage() {
  const { data: products, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, category, image_url, stock"
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading products:", error);
  }

  const publishedProducts: Product[] = products ?? [];

  return (
    <main className="min-h-screen bg-pink-50">
      {/* Navigation */}
      <nav className="border-b border-pink-100 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-pink-600">
                Debbie's Handbags
              </h1>
              <p className="text-xs text-grey-500">
                Ladies Handbags
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-pink-600"
            >
              Home
            </Link>

            <a
              href="#products"
              className="text-sm font-medium text-gray-600 hover:text-pink-600"
            >
              Shop
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-gray-600 hover:text-pink-600"
            >
              About
            </a>
            <Link
              href="admin/"
              className="text-sm font-semibold text-pink-600"
            >
              Admin
            </Link>
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="flex items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-pink-400 hover:text-pink-600"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
          </Link>

        </div>
      </nav>

     {/* Hero */}
    <section className="px-4 pt-6 sm:px-6 lg:px-10 lg:pt-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-pink-50 via-white to-pink-100">

        {/* Decorative background shapes */}
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-pink-100/60 blur-3xl" />
        <div className="absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />

        {/* Hero content */}
        <div className="relative grid min-h-[620px] items-center lg:grid-cols-2">

          {/* Left side - Text */}
          <div className="relative z-10 px-6 py-14 sm:px-10 lg:px-14 lg:py-20">

            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-pink-600">
              Your style. Your bag. Your confidence.
            </p>

            <h2 className="max-w-2xl text-4xl font-bold leading-[1.05] tracking-tight text-gray-900 sm:text-5xl lg:text-6xl xl:text-7xl">
              Beautiful handbags
              <span className="block text-pink-600">
                made for you.
              </span>
            </h2>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-600 sm:text-lg sm:leading-8">
              Discover stylish and elegant ladies&apos; handbags
              carefully selected to complete your look.
            </p>

            <a
              href="#products"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-pink-600 px-7 py-4 font-semibold text-white shadow-lg shadow-pink-200 transition hover:bg-pink-700 hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" />
              Shop Handbags
              <span className="text-xl">→</span>
            </a>
          </div>

          {/* Right side - Handbag */}
          <div className="relative flex min-h-[350px] items-end justify-center px-6 pb-0 sm:min-h-[450px] lg:min-h-[620px] lg:px-4">

            {/* Soft pink circle behind handbag */}
            <div className="absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full bg-pink-100/80 sm:h-[520px] sm:w-[520px] lg:h-[600px] lg:w-[600px]" />

            {/* Handbag image */}
            <img
              src="/back2.jpg"
              alt="Elegant ladies handbag"
              className="relative z-10 h-auto w-full max-w-[420px] object-contain drop-shadow-2xl sm:max-w-[500px] lg:max-w-[580px]"
            />

            {/* Decorative flower/vase area */}
            <div className="absolute bottom-10 right-5 z-20 hidden lg:block">
              <div className="h-32 w-20 rounded-b-[40%] rounded-t-xl bg-white/80 shadow-sm" />
              <div className="absolute -top-20 left-1/2 h-24 w-1 -translate-x-1/2 rotate-12 bg-pink-200" />
              <div className="absolute -top-16 left-3 h-8 w-8 rounded-full bg-pink-200/70" />
              <div className="absolute -top-24 right-0 h-7 w-7 rounded-full bg-pink-100" />
            </div>
          </div>

          {/* Decorative corner leaves */}
          <div className="absolute left-4 top-4 text-pink-200 sm:left-8 sm:top-8">
            <svg
              width="70"
              height="90"
              viewBox="0 0 70 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 85C12 55 22 28 52 8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M23 55C12 49 7 40 10 31C21 32 27 41 23 55Z"
                fill="currentColor"
              />
              <path
                d="M35 38C29 27 31 17 40 12C47 21 45 31 35 38Z"
                fill="currentColor"
              />
              <path
                d="M17 70C7 66 2 58 5 49C15 51 21 59 17 70Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="absolute bottom-3 right-4 text-pink-200 sm:right-8">
            <svg
              width="70"
              height="90"
              viewBox="0 0 70 90"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M58 85C58 55 48 28 18 8"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M47 55C58 49 63 40 60 31C49 32 43 41 47 55Z"
                fill="currentColor"
              />
              <path
                d="M35 38C41 27 39 17 30 12C23 21 25 31 35 38Z"
                fill="currentColor"
              />
              <path
                d="M53 70C63 66 68 58 65 49C55 51 49 59 53 70Z"
                fill="currentColor"
              />
            </svg>
          </div>

        </div>
      </div>
    </section>


    {/* Products */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-6 py-16 lg:px-10"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-pink-600">
              Our Collection
            </p>

            <h2 className="mt-2 text-3xl font-bold text-gray-900">
              Latest Handbags
            </h2>

            <p className="mt-2 text-gray-500">
              Find your perfect handbag.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-xl border border-pink-100 bg-white px-4 py-2 text-sm text-gray-500 sm:flex">
            <Search className="h-4 w-4" />
            Browse collection
          </div>
        </div>

        {publishedProducts.length === 0 ? (
          <div className="rounded-2xl border border-pink-100 bg-white px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-pink-300" />

            <h3 className="mt-4 text-lg font-bold text-gray-900">
              No products available yet
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              New handbags will appear here when they are
              published from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {publishedProducts.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-pink-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden bg-pink-50">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-16 w-16 text-pink-200" />
                    </div>
                  )}

                  {/* Stock Badge */}
                  {product.stock === 0 ? (
                    <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                      Sold Out
                    </span>
                  ) : product.stock <= 3 ? (
                    <span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                      Only {product.stock} left
                    </span>
                  ) : (
                    <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm">
                      In Stock
                    </span>
                  )}
                </div>

                {/* Product Information */}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-pink-600">
                    {product.category}
                  </p>

                  <h3 className="mt-2 text-lg font-bold text-gray-900">
                    {product.name}
                  </h3>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {product.description}
                    </p>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="text-xl font-bold text-gray-900">
                      K{product.price.toFixed(2)}
                    </p>

                    <AddToCartButton
                        product={{
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          image_url: product.image_url,
                          stock: product.stock,
                        }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-pink-100 bg-white"
      >
        <div className="mx-auto max-w-7xl px-6 py-16 text-center lg:px-10">
          <p className="text-sm font-bold uppercase tracking-widest text-pink-600">
            Debbie's Handbags
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900">
            Carry your confidence.
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-500">
            Stylish handbags for every occasion. Browse our
            collection and find something that matches your
            personality and style.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-8 text-center">
        <p className="font-semibold text-white">
          Debbie's Handbags
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Beautiful handbags. Beautiful you.
        </p>
        
         <h1 className="mt-2 text-sm text-white">
          Contact us 
          <p>Tel: +260 974508241 | +260 968193041</p>
        </h1>

        <p className="mt-4 text-xs text-gray-500">
          © 2026 Debbie's Handbags. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
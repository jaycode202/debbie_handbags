"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
} from "lucide-react";
import { useCart } from "../components/cart/CartProvider";

export default function CartPage() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  // Empty cart
  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-pink-50">
        <Header />

        <section className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm">
              <ShoppingBag className="h-9 w-9 text-pink-400" />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h2>

            <p className="mt-2 text-gray-500">
              You haven&apos;t added any handbags yet.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50">
      <Header />

      <section className="mx-auto max-w-6xl px-6 py-12">
        {/* Page heading */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Your Cart
            </h2>

            <p className="mt-1 text-gray-500">
              Review your selected handbags before ordering.
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-sm font-semibold text-red-500 transition hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart items */}
          <div className="space-y-4 lg:col-span-2">
            {cart.map((product) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-2xl border border-pink-100 bg-white p-4 shadow-sm"
              >
                {/* Product image */}
                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-pink-50">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ShoppingBag className="h-8 w-8 text-pink-200" />
                    </div>
                  )}
                </div>

                {/* Product information */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        K{product.price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeFromCart(product.id)
                      }
                      className="text-gray-400 transition hover:text-red-500"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Quantity + item total */}
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center overflow-hidden rounded-xl border border-gray-200">
                      <button
                        onClick={() =>
                          decreaseQuantity(product.id)
                        }
                        className="p-2.5 text-gray-600 transition hover:bg-pink-50"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="min-w-10 text-center text-sm font-bold text-gray-900">
                        {product.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(product.id)
                        }
                        disabled={
                          product.quantity >= product.stock
                        }
                        className="p-2.5 text-gray-600 transition hover:bg-pink-50 disabled:cursor-not-allowed disabled:text-gray-300"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="font-bold text-gray-900">
                      K
                      {(
                        product.price * product.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="h-fit rounded-2xl border border-pink-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900">
              Order Summary
            </h3>

            <div className="mt-6 flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-500">
                Items
              </span>

              <span className="font-semibold text-gray-900">
                {cart.reduce(
                  (total, item) =>
                    total + item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="mt-4 flex justify-between border-b border-gray-100 pb-4">
              <span className="text-gray-500">
                Subtotal
              </span>

              <span className="font-semibold text-gray-900">
                K{cartTotal.toFixed(2)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="font-bold text-gray-900">
                Total
              </span>

              <span className="text-2xl font-bold text-pink-600">
                K{cartTotal.toFixed(2)}
              </span>
            </div>

            <Link
              href="/checkout"
              className="block w-full rounded-xl bg-pink-600 px-5 py-3 text-center font-semibold text-white transition hover:bg-pink-700"
            >
              Proceed to Order
            </Link>

            {/*<p className="mt-3 text-center text-xs text-gray-400">
              WhatsApp ordering is coming next.
            </p>*/}

            <Link
              href="/"
              className="mt-4 flex items-center justify-center gap-2 text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* Header */
function Header() {
  return (
    <nav className="border-b border-pink-100 bg-white">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600">
            <ShoppingBag className="h-5 w-5 text-white" />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              Debbie's Handbags
            </h1>

            <p className="text-xs text-pink-600">
              Ladies Handbags
            </p>
          </div>
        </Link>

        <Link
          href="/"
          className="text-sm font-semibold text-pink-600 hover:text-pink-700"
        >
          Continue Shopping
        </Link>
      </div>
    </nav>
  );
}
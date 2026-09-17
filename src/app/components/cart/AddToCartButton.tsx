"use client";

import { Check, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCart } from "./CartProvider";

type AddToCartButtonProps = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url: string | null;
    stock: number;
  };
};

export default function AddToCartButton({
  product,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const [showMessage, setShowMessage] = useState(false);

  function handleAddToCart() {
    if (product.stock <= 0) return;

    addToCart(product);

    // Show success message
    setShowMessage(true);

    // Hide it automatically after 2 seconds
    setTimeout(() => {
      setShowMessage(false);
    }, 10000);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={product.stock <= 0}
       className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-4 py-3 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:bg-gray-300"
      >
        <ShoppingCart className="h-5 w-5" />

        {product.stock <= 0 ? "Sold Out" : "Add to Cart"}
      </button>

      {/* Success notification */}
      {showMessage && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-5 py-3 shadow-xl ring-1 ring-gray-100">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
              <Check className="h-5 w-5 text-green-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                Added to cart!
              </p>

              <p className="text-xs text-gray-500">
                {product.name}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
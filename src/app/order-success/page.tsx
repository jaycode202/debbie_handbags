"use client";

import Link from "next/link";
import { CheckCircle, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Order Received! 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Thank you for shopping with Debbie&apos;s Handbags.
          Your order has been received successfully.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl bg-pink-50 p-4">
            <p className="text-sm text-gray-500">
              Your Order Number
            </p>

            <p className="mt-1 break-all font-mono text-sm font-bold text-pink-600">
              {orderId}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left">
          <h2 className="font-bold text-gray-900">
            What happens next?
          </h2>

          <ul className="mt-3 space-y-2 text-sm text-gray-600">
            <li>✓ Your order has been saved.</li>
            <li>✓ Your WhatsApp order has been prepared.</li>
            <li>✓ We&apos;ll confirm your payment and delivery details.</li>
          </ul>
        </div>

        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white transition hover:bg-pink-700"
        >
          <ShoppingBag className="h-5 w-5" />
          Continue Shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
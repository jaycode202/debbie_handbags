"use client";

import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { useCart } from "../components/cart/CartProvider";
import { supabase } from "@/lib/supabase";

export default function CheckoutPage() {
  const {
    cart,
    cartTotal,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handlePlaceOrder() {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      alert("Please fill in your name, phone number and delivery address.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrderId = crypto.randomUUID();

      // 1. Create the order
      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          id: newOrderId,
          customer_name: name.trim(),
          phone: phone.trim(),
          delivery_address: address.trim(),
          notes: notes.trim() || null,
          total: cartTotal,
          status: "pending",
          payment_confirmed: false,
        });

      if (orderError) {
        console.error("ORDER ERROR:", orderError);
        alert(`Could not create order: ${orderError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 2. Create the order items
      const orderItems = cart.map((item) => ({
        order_id: newOrderId,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("ORDER ITEMS ERROR:", itemsError);
        alert(`Could not save order items: ${itemsError.message}`);
        setIsSubmitting(false);
        return;
      }

      // 3. Prepare the WhatsApp message
      const items = cart
        .map(
          (item) =>
            `🛍️ ${item.name}\nQty: ${
              item.quantity
            }\nPrice: K${(item.price * item.quantity).toFixed(2)}`
        )
        .join("\n\n");

      const message = `Hello Debbie's Handbags! 👋

I'd like to place an order:

${items}

💰 Total: K${cartTotal.toFixed(2)}

👤 Customer: ${name}
📱 Phone: ${phone}
📍 Delivery Address: ${address}
📝 Notes: ${notes || "None"}

Order #: ${newOrderId}

Thank you! ❤️`;

      const whatsappNumber = "260763204132";

      const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        message
      )}`;

      // 4. Clear the cart
      clearCart();

      // 5. Store success information
      setOrderId(newOrderId);
      setWhatsappUrl(url);

      // 6. Show the success popup
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (showSuccessModal) {
    return (
      <main className="min-h-screen bg-pink-50 px-4 py-8">
        {/* Dark overlay */}
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          {/* Success Modal */}
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-md rounded-3xl bg-white p-7 text-center shadow-2xl sm:p-9"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Success icon */}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>

            <h1 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
              Order Received! 🎉
            </h1>

            <p className="mt-3 text-gray-600">
              Your order has been received successfully.
             <p className="text-xl">Kindly pay via Mobile Money Tel: 0974508241.</p> 
            </p>

            {/* Order number */}
            <div className="mt-6 rounded-2xl bg-pink-50 p-4">
              <p className="text-sm text-gray-500">
                Your Order Number <br></br>
                <p className="text-xl">Thank you!!</p>
              </p>

              <p className="mt-1 break-all font-mono text-sm font-bold text-pink-600">
                {orderId}
              </p>
            </div>

            {/* Next steps */}
            <div className="mt-5 rounded-2xl bg-gray-50 p-4 text-left">
              <p className="font-semibold text-gray-900">
                What happens next?
              </p>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                We&apos;ll contact you to confirm payment and
                delivery details.
              </p>
            </div>

            {/* WhatsApp */}
            <button
              type="button"
              onClick={() => {
                window.open(
                  whatsappUrl,
                  "_blank",
                  "noopener,noreferrer"
                );
              }}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              <MessageCircle className="h-5 w-5" />
              Send on WhatsApp
            </button>

            {/* Continue shopping */}
            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-5 py-3 font-semibold text-pink-700 transition hover:bg-pink-100"
            >
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Link>

            <button
              type="button"
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 text-sm font-medium text-gray-500 hover:text-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-pink-50 px-6 py-12">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
          <div className="w-full rounded-3xl bg-white p-8 text-center shadow-sm sm:p-12">
            <ShoppingBag className="mx-auto h-16 w-16 text-pink-500" />

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Your cart is empty
            </h1>

            <p className="mt-2 text-gray-600">
              Add some beautiful handbags before checking out.
            </p>

            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-pink-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/cart"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-pink-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cart
        </Link>

        <h1 className="text-3xl font-bold text-gray-900">
          Checkout
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">
          {/* Customer information */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-xl font-bold text-gray-900">
                Delivery Information
              </h2>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Full Name
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Delivery Address
                  </label>

                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your delivery address"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Notes (Optional)
                  </label>

                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional information?"
                    rows={3}
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-100"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">
                Your Order
              </h2>

              <div className="mt-5 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 border-b border-gray-100 pb-4"
                  >
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <ShoppingBag className="h-7 w-7 text-gray-300" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.name}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        K{item.price.toFixed(2)}
                      </p>

                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id)}
                          className="rounded-lg border border-gray-200 p-1 hover:bg-gray-50"
                        >
                          <Minus className="h-3 w-3" />
                        </button>

                        <span className="min-w-6 text-center text-sm font-medium">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id)}
                          className="rounded-lg border border-gray-200 p-1 hover:bg-gray-50"
                        >
                          <Plus className="h-3 w-3" />
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-auto text-gray-400 hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <p className="font-semibold text-gray-900">
                      K{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                <span className="text-lg font-bold text-gray-900">
                  Total
                </span>

                <span className="text-2xl font-bold text-pink-600">
                  K{cartTotal.toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3.5 font-semibold text-white transition hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ShoppingBag className="h-5 w-5" />

                {isSubmitting ? "Creating Order..." : "Place Order"}
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                After placing your order, you can optionally send
                the order details through WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import {
  Clock,
  Eye,
  Package,
  Phone,
  MapPin,
  User,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Order = {
  id: string;
  customer_name: string;
  phone: string;
  delivery_address: string;
  notes: string | null;
  total: number;
  status: string;
  payment_confirmed: boolean;
  stock_deducted: boolean;
  created_at: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  price: number;
  quantity: number;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmingOrderId, setConfirmingOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ORDERS ERROR:", error);
      alert(`Could not load orders: ${error.message}`);
      setLoading(false);
      return;
    }

    setOrders(data || []);
    setLoading(false);
  }

  async function viewOrder(order: Order) {
    setSelectedOrder(order);

    const { data, error } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", order.id);

    if (error) {
      console.error("ORDER ITEMS ERROR:", error);
      alert(`Could not load order items: ${error.message}`);
      return;
    }

    setOrderItems(data || []);
  }

  async function confirmPayment(order: Order) {
    if (order.payment_confirmed || order.stock_deducted) {
      return;
    }

    const confirmed = window.confirm(
      `Confirm payment for ${order.customer_name}'s order?\n\n` +
        `Total: ${formatPrice(order.total)}\n\n` +
        `This will deduct the ordered quantities from your product stock.`
    );

    if (!confirmed) {
      return;
    }

    setConfirmingOrderId(order.id);

    const { error } = await supabase.rpc("confirm_order_payment", {
      p_order_id: order.id,
    });

    if (error) {
      console.error("CONFIRM PAYMENT ERROR:", error);

      alert(
        `Could not confirm payment.\n\n${error.message}`
      );

      setConfirmingOrderId(null);
      return;
    }

    // Update the order immediately in the UI
    setOrders((currentOrders) =>
      currentOrders.map((item) =>
        item.id === order.id
          ? {
              ...item,
              payment_confirmed: true,
              stock_deducted: true,
              status: "confirmed",
            }
          : item
      )
    );

    // Also update the modal if this order is currently open
    setSelectedOrder((currentOrder) =>
      currentOrder && currentOrder.id === order.id
        ? {
            ...currentOrder,
            payment_confirmed: true,
            stock_deducted: true,
            status: "confirmed",
          }
        : currentOrder
    );

    setConfirmingOrderId(null);

    alert(
      "Payment confirmed successfully!\n\nStock has been deducted."
    );
  }

  {/*end of confirmpayment*/}

  async function updateOrderStatus(
    order: Order,
    newStatus: string
    ) {
    if (order.status === newStatus) {
        return;
    }

    // Don't allow an unpaid order to be moved to processing/delivered
    if (
        !order.payment_confirmed &&
        (newStatus === "processing" || newStatus === "delivered")
    ) {
        alert(
        "Payment must be confirmed before moving this order to processing or delivered."
        );
        return;
    }

    const { error } = await supabase
        .from("orders")
        .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

    if (error) {
        console.error("UPDATE STATUS ERROR:", error);
        alert(`Could not update order status: ${error.message}`);
        return;
    }

    // Update the orders list immediately
    setOrders((currentOrders) =>
        currentOrders.map((item) =>
        item.id === order.id
            ? {
                ...item,
                status: newStatus,
            }
            : item
        )
    );

    // Update the modal if this order is open
    setSelectedOrder((currentOrder) =>
        currentOrder && currentOrder.id === order.id
        ? {
            ...currentOrder,
            status: newStatus,
            }
        : currentOrder
    );
    }

  function closeOrder() {
    setSelectedOrder(null);
    setOrderItems([]);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  function formatPrice(price: number) {
    return `K${Number(price).toFixed(2)}`;
  }

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Orders
          </h1>

          <p className="mt-1 text-gray-500">
            Manage customer orders and payment status.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && orders.length === 0 && (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <Package className="mx-auto mb-4 h-12 w-12 text-pink-500" />

            <h2 className="text-xl font-bold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer orders will appear here.
            </p>
          </div>
        )}

        {/* Orders */}
        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-3xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Customer */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-pink-100 p-2">
                        <User className="h-5 w-5 text-pink-600" />
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          {order.customer_name}
                        </h2>

                        <p className="text-sm text-gray-500">
                          Order #{order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {order.phone}
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{order.delivery_address}</span>
                    </div>
                  </div>

                  {/* Order info */}
                  <div className="space-y-3 lg:text-right">
                    <div>
                      <p className="text-sm text-gray-500">
                        Total
                      </p>

                      <p className="text-2xl font-bold text-pink-600">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 lg:justify-end">
                      <select
                            value={order.status}
                            onChange={(e) =>
                                updateOrderStatus(order, e.target.value)
                            }
                            className={`rounded-full border-0 px-3 py-1 text-xs font-semibold capitalize outline-none ${
                                order.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : order.status === "confirmed"
                                ? "bg-green-100 text-green-700"
                                : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "delivered"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-red-100 text-red-700"
                            }`}
                            >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                        </select>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.payment_confirmed
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.payment_confirmed
                          ? "Payment Confirmed"
                          : "Payment Pending"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-400 lg:justify-end">
                      <Clock className="h-4 w-4" />
                      {formatDate(order.created_at)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    {/* Confirm Payment */}
                    {!order.payment_confirmed &&
                      !order.stock_deducted && (
                        <button
                          onClick={() => confirmPayment(order)}
                          disabled={
                            confirmingOrderId === order.id
                          }
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 lg:w-auto"
                        >
                          {confirmingOrderId === order.id ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                              Confirm Payment
                            </>
                          )}
                        </button>
                      )}

                    {/* Already confirmed */}
                    {order.payment_confirmed && (
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
                        <CheckCircle className="h-4 w-4" />
                        Payment Confirmed
                      </div>
                    )}

                    {/* View Order */}
                    <button
                      onClick={() => viewOrder(order)}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-pink-600 px-5 py-3 font-semibold text-white transition hover:bg-pink-700 lg:w-auto"
                    >
                      <Eye className="h-4 w-4" />
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Order Details
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    #{selectedOrder.id}
                  </p>
                </div>

                <button
                  onClick={closeOrder}
                  className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>

              {/* Customer */}
              <div className="mt-6 rounded-2xl bg-gray-50 p-5">
                <h3 className="font-bold text-gray-900">
                  Customer Information
                </h3>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.customer_name}
                  </p>

                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.phone}
                  </p>

                  <p>
                    <strong>Address:</strong>{" "}
                    {selectedOrder.delivery_address}
                  </p>

                  <p>
                    <strong>Notes:</strong>{" "}
                    {selectedOrder.notes || "None"}
                  </p>
                </div>
              </div>

              {/* Products */}
              <div className="mt-6">
                <h3 className="font-bold text-gray-900">
                  Ordered Products
                </h3>

                <div className="mt-4 space-y-3">
                  {orderItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-2xl border border-gray-100 p-4"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.product_name}
                        </p>

                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        {formatPrice(
                          item.price * item.quantity
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-5">
                <span className="text-lg font-bold">
                  Total
                </span>

                <span className="text-2xl font-bold text-pink-600">
                  {formatPrice(selectedOrder.total)}
                </span>
              </div>

              {/* Current status */}
              <div className="mt-6 rounded-2xl bg-yellow-50 p-4">
                <p className="text-sm text-yellow-800">
                  Status:{" "}
                  <strong>{selectedOrder.status}</strong>
                </p>

                <p className="mt-1 text-sm text-yellow-800">
                  Payment:{" "}
                  <strong>
                    {selectedOrder.payment_confirmed
                      ? "Confirmed"
                      : "Not confirmed"}
                  </strong>
                </p>

                <p className="mt-1 text-sm text-yellow-800">
                  Stock:{" "}
                  <strong>
                    {selectedOrder.stock_deducted
                      ? "Deducted"
                      : "Not deducted"}
                  </strong>
                </p>
              </div>

              {/* Confirm Payment inside modal */}
              {!selectedOrder.payment_confirmed &&
                !selectedOrder.stock_deducted && (
                  <button
                    onClick={() =>
                      confirmPayment(selectedOrder)
                    }
                    disabled={
                      confirmingOrderId === selectedOrder.id
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400"
                  >
                    {confirmingOrderId === selectedOrder.id ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Confirming Payment...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Confirm Payment & Deduct Stock
                      </>
                    )}
                  </button>
                )}

              <button
                onClick={closeOrder}
                className="mt-6 w-full rounded-xl border border-gray-200 px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import {
  ShoppingBag,
  Package,
  DollarSign,
  AlertCircle,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/lib/currency";
import Greeting from "./components/Greeting";

const stats = [
  {
    title: "Total Products",
    value: "24",
    icon: ShoppingBag,
    description: "Products in your store",
  },
  {
    title: "Available Stock",
    value: "86",
    icon: Package,
    description: "Items currently available",
  },
  {
    title: "Total Sales",
    value: "K1,248",
    icon: DollarSign,
    description: "Confirmed orders",
  },
  {
    title: "Sold Out",
    value: "6",
    icon: AlertCircle,
    description: "Products out of stock",
  },
];

const recentProducts = [
  {
    name: "Pink Luxury Tote",
    category: "Tote Bags",
    price: "K35",
    stock: 8,
  },
  {
    name: "Classic Chain Bag",
    category: "Shoulder Bags",
    price: "K42",
    stock: 3,
  },
  {
    name: "Mini Pearl Clutch",
    category: "Clutches",
    price: "K28",
    stock: 0,
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Header */}
      <header className="flex min-h-20 items-center justify-between border-b border-pink-100 bg-white px-6 lg:px-10">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="text-sm text-gray-500">
            Manage your handbag store
          </p>
        </div>

        <Link
          href="admin/products/new"
          className="flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-700"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </header>

      <div className="p-6 lg:p-10">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            <Greeting />
          </h2>

          <p className="mt-1 text-gray-500">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>

                    <p className="mt-2 text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-pink-50 p-3">
                    <Icon className="h-5 w-5 text-pink-600" />
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-400">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recent products */}
        <div className="mt-8 rounded-2xl border border-pink-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-pink-100 px-6 py-5">
            <div>
              <h3 className="font-bold text-gray-900">
                Recent Products
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Recently added handbags
              </p>
            </div>

            <Link
              href="/admin/products"
              className="text-sm font-semibold text-pink-600 hover:text-pink-700"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-pink-50">
            {recentProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between px-6 py-5"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-50">
                    <ShoppingBag className="h-5 w-5 text-pink-400" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {product.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {product.price}
                  </p>

                  {product.stock === 0 ? (
                    <span className="text-xs font-semibold text-red-500">
                      Sold Out
                    </span>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {product.stock} in stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

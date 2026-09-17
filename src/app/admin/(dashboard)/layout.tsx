"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Settings,
  LogOut,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const { data } = await supabase.auth.getSession();

      if (!mounted) return;

      if (!data.session) {
        router.replace("/admin/login");
        return;
      }

      setCheckingAuth(false);
    }

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/admin/login");
      } else {
        setCheckingAuth(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center mr-3">
            <ShoppingBag className="w-5 h-5 text-pink-600" />
          </div>

          <div>
            <h1 className="font-bold text-gray-900">
              Debbie Bags
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;

            const active =
              pathname === item.href ||
              (item.href !== "/admin" &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                  active
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
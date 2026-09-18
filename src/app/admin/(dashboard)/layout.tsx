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
  Menu,
  X,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  function handleNavigation() {
    setMobileMenuOpen(false);
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-pink-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-pink-200 border-t-pink-600" />

          <p className="mt-4 text-gray-500">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">

      {/* =========================
          MOBILE HEADER
      ========================== */}
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-pink-100 bg-white px-4 md:hidden">

        {/* Logo */}
        <Link
          href="/admin"
          onClick={handleNavigation}
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
            <ShoppingBag className="h-5 w-5 text-pink-600" />
          </div>

          <div>
            <h1 className="font-bold leading-tight text-gray-900">
              Debbie's Handbags 
            </h1>

            <p className="text-xs text-gray-500">
              Admin Panel
            </p>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 text-gray-700 transition hover:bg-pink-50 hover:text-pink-600"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </header>

      {/* =========================
          MOBILE MENU
      ========================== */}
      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-16 z-30 border-b border-pink-100 bg-white shadow-lg md:hidden">

          <nav className="space-y-1 p-4">
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
                  onClick={handleNavigation}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                    active
                      ? "bg-pink-100 text-pink-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5" />

                  <span className="font-medium">
                    {item.name}
                  </span>
                </Link>
              );
            })}

            {/* Mobile Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />

              <span className="font-medium">
                Logout
              </span>
            </button>
          </nav>
        </div>
      )}

      {/* =========================
          DESKTOP SIDEBAR
      ========================== */}
      <aside className="fixed left-0 top-0 hidden h-screen w-64 flex-col border-r border-gray-200 bg-white md:flex">

        {/* Logo */}
        <div className="flex h-20 items-center border-b border-gray-100 px-6">
          <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100">
            <ShoppingBag className="h-5 w-5 text-pink-600" />
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
        <nav className="flex-1 space-y-1 p-4">
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
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  active
                    ? "bg-pink-100 text-pink-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5" />

                <span className="font-medium">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-5 w-5" />

            <span className="font-medium">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* =========================
          MAIN CONTENT
      ========================== */}
      <main className="min-h-screen min-w-0 md:ml-64">
        {children}
      </main>
    </div>
  );
            }

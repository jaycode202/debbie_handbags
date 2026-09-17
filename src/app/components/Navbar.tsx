"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, ShoppingBag, X } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b border-pink-100 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

        {/* Navbar */}
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600">
              <ShoppingBag className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-pink-600 sm:text-xl">
                Debbie's Handbags
              </h1>

              <p className="text-xs text-gray-500">
                Ladies Handbags
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
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
              href="/admin"
              className="text-sm font-semibold text-pink-600"
            >
              Admin
            </Link>
          </div>

          {/* Desktop Cart */}
          <Link
            href="/cart"
            className="hidden items-center gap-2 rounded-xl border border-pink-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-pink-400 hover:text-pink-600 md:flex"
          >
            <ShoppingBag className="h-4 w-4" />
            Cart
          </Link>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">

            {/* Cart */}
            <Link
              href="/cart"
              aria-label="Cart"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 text-gray-700 hover:border-pink-400 hover:text-pink-600"
            >
              <ShoppingBag className="h-5 w-5" />
            </Link>

            {/* Hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-pink-200 text-gray-700 hover:border-pink-400 hover:text-pink-600"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-pink-100 py-4 md:hidden">
            <div className="flex flex-col gap-1">

              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-pink-600 hover:bg-pink-50"
              >
                Home
              </Link>

              <a
                href="#products"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              >
                Shop
              </a>

              <a
                href="#about"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-gray-600 hover:bg-pink-50 hover:text-pink-600"
              >
                About
              </a>

              <Link
                href="/admin"
                onClick={() => setMenuOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-pink-600 hover:bg-pink-50"
              >
                Admin
              </Link>

            </div>
          </div>
        )}

      </div>
    </nav>
  );
}
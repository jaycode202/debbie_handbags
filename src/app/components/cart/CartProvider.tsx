"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  quantity: number;
};

type CartContextType = {
  cart: CartProduct[];
  addToCart: (product: Omit<CartProduct, "quantity">) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<CartProduct[]>([]);

  // Load cart from browser storage
  useEffect(() => {
    const savedCart = localStorage.getItem("chic-carry-cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("chic-carry-cart");
      }
    }
  }, []);

  // Save cart whenever it changes
  useEffect(() => {
    localStorage.setItem("chic-carry-cart", JSON.stringify(cart));
  }, [cart]);

  function addToCart(
    product: Omit<CartProduct, "quantity">
  ) {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        if (existingProduct.quantity >= product.stock) {
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });
  }

  function removeFromCart(id: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  }

  function increaseQuantity(id: string) {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== id) {
          return item;
        }

        if (item.quantity >= item.stock) {
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  }

  function decreaseQuantity(id: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
  }

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
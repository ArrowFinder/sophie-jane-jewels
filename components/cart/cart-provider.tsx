"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createCheckout } from "@/lib/shopify/checkout";
import type { SelectedOption } from "@/lib/shopify/types";

export type CartItem = {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  image: { url: string; altText: string };
  price: { amount: string; currencyCode: string };
  options: SelectedOption[];
  quantity: number;
};

type CheckoutState = "idle" | "loading" | "not-configured" | "error";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotal: number;
  currencyCode: string;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  checkout: () => Promise<void>;
  checkoutState: CheckoutState;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "sjj-cart-v2";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutState, setCheckoutState] = useState<CheckoutState>("idle");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hydrate cart from storage once on mount.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage may be unavailable */
    }
  }, [items, hydrated]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem: CartContextValue["addItem"] = useCallback((item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i,
        );
      }
      return [...prev, { ...item, quantity }];
    });
    setCheckoutState("idle");
    setIsOpen(true);
  }, []);

  const updateQuantity: CartContextValue["updateQuantity"] = useCallback((variantId, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => i.variantId !== variantId)
        : prev.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)),
    );
  }, []);

  const removeItem: CartContextValue["removeItem"] = useCallback((variantId) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const checkout = useCallback(async () => {
    if (items.length === 0) return;
    setCheckoutState("loading");
    const result = await createCheckout(
      items.map((i) => ({ merchandiseId: i.variantId, quantity: i.quantity })),
    );
    if (result.ok) {
      window.location.href = result.checkoutUrl;
      return;
    }
    setCheckoutState(result.reason === "not-configured" ? "not-configured" : "error");
  }, [items]);

  const count = useMemo(() => items.reduce((n, i) => n + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + parseFloat(i.price.amount) * i.quantity, 0),
    [items],
  );
  const currencyCode = items[0]?.price.currencyCode ?? "USD";

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    currencyCode,
    isOpen,
    openCart,
    closeCart,
    addItem,
    updateQuantity,
    removeItem,
    checkout,
    checkoutState,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

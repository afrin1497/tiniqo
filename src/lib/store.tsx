import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";

import { getProductById } from "@/data";
import type { Product } from "@/data/types";
import type { DeliveryMethod } from "@/lib/pricing";
import type { PaymentMethod } from "@/lib/payments";
import { subtotalOf } from "@/lib/pricing";

export interface CartLine { productId: string; size: string; qty: number }
export interface CartLineDetailed extends CartLine { product: Product; key: string; lineTotal: number }

export interface Address {
  id: string;
  name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem { productId: string; slug: string; title: string; size: string; qty: number; price: number; image: string }

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shipping: number;
  total: number;
  email: string;
  phone: string;
  address: Address;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  paymentId: string;
  note: string;
  estimatedDelivery: string;
  status: "placed" | "packed" | "shipped" | "out-for-delivery" | "delivered";
}

export interface MockUser { name: string; email: string; phone: string }

interface StoreState {
  hydrated: boolean;
  cart: CartLine[];
  cartLines: CartLineDetailed[];
  cartCount: number;
  cartSubtotal: number;
  cartNote: string;
  setCartNote: (note: string) => void;
  addToCart: (product: Product, size: string, qty?: number, opts?: { openDrawer?: boolean; silent?: boolean }) => void;
  updateQty: (productId: string, size: string, qty: number) => void;
  removeFromCart: (productId: string, size: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;

  wishlist: string[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => void;

  recentlyViewed: string[];
  trackViewed: (productId: string) => void;

  user: MockUser | null;
  signIn: (user: MockUser) => void;
  signOut: () => void;
  addresses: Address[];
  saveAddress: (a: Address) => void;
  removeAddress: (id: string) => void;

  orders: Order[];
  addOrder: (o: Order) => void;
}

const StoreContext = createContext<StoreState | null>(null);

const KEYS = {
  cart: "tiniqo.cart",
  note: "tiniqo.cartNote",
  wishlist: "tiniqo.wishlist",
  recent: "tiniqo.recent",
  user: "tiniqo.user",
  addresses: "tiniqo.addresses",
  orders: "tiniqo.orders",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartNote, setCartNote] = useState("");
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentlyViewed, setRecent] = useState<string[]>([]);
  const [user, setUser] = useState<MockUser | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // Load persisted state after hydration so server and client render the same markup.
  useEffect(() => {
    setCart(read(KEYS.cart, []));
    setCartNote(read(KEYS.note, ""));
    setWishlist(read(KEYS.wishlist, []));
    setRecent(read(KEYS.recent, []));
    setUser(read(KEYS.user, null));
    setAddresses(read(KEYS.addresses, []));
    setOrders(read(KEYS.orders, []));
    setHydrated(true);
  }, []);

  const persist = useRef(<T,>(key: string, value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }).current;

  useEffect(() => { if (hydrated) persist(KEYS.cart, cart); }, [cart, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.note, cartNote); }, [cartNote, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.wishlist, wishlist); }, [wishlist, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.recent, recentlyViewed); }, [recentlyViewed, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.user, user); }, [user, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.addresses, addresses); }, [addresses, hydrated, persist]);
  useEffect(() => { if (hydrated) persist(KEYS.orders, orders); }, [orders, hydrated, persist]);

  const cartLines = useMemo<CartLineDetailed[]>(
    () =>
      cart.flatMap((l) => {
        const product = getProductById(l.productId);
        return product ? [{ ...l, product, key: `${l.productId}-${l.size}`, lineTotal: product.price * l.qty }] : [];
      }),
    [cart],
  );
  const cartCount = cartLines.reduce((n, l) => n + l.qty, 0);
  const cartSubtotal = subtotalOf(cartLines.map((l) => ({ price: l.product.price, qty: l.qty })));

  const addToCart = useCallback<StoreState["addToCart"]>((product, size, qty = 1, opts = {}) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === product.id && l.size === size);
      if (existing) return prev.map((l) => (l === existing ? { ...l, qty: Math.min(10, l.qty + qty) } : l));
      return [...prev, { productId: product.id, size, qty }];
    });
    if (!opts.silent) toast.success("Added to cart", { description: `${product.title} · Size ${size}` });
    if (opts.openDrawer ?? true) setCartOpen(true);
  }, []);

  const updateQty = useCallback((productId: string, size: string, qty: number) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.size === size))
        : prev.map((l) => (l.productId === productId && l.size === size ? { ...l, qty: Math.min(10, qty) } : l)),
    );
  }, []);

  const removeFromCart = useCallback((productId: string, size: string) => {
    setCart((prev) => prev.filter((l) => !(l.productId === productId && l.size === size)));
  }, []);

  const toggleWishlist = useCallback((product: Product) => {
    setWishlist((prev) => {
      const has = prev.includes(product.id);
      toast(has ? "Removed from wishlist" : "Saved to wishlist", { description: product.title });
      return has ? prev.filter((id) => id !== product.id) : [product.id, ...prev];
    });
  }, []);

  const trackViewed = useCallback((productId: string) => {
    setRecent((prev) => [productId, ...prev.filter((id) => id !== productId)].slice(0, 12));
  }, []);

  const value: StoreState = {
    hydrated,
    cart,
    cartLines,
    cartCount,
    cartSubtotal,
    cartNote,
    setCartNote,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart: () => setCart([]),
    cartOpen,
    setCartOpen,
    wishlist,
    isWishlisted: (id) => wishlist.includes(id),
    toggleWishlist,
    recentlyViewed,
    trackViewed,
    user,
    signIn: (u) => setUser(u),
    signOut: () => setUser(null),
    addresses,
    saveAddress: (a) => setAddresses((prev) => [a, ...prev.filter((x) => x.id !== a.id)]),
    removeAddress: (id) => setAddresses((prev) => prev.filter((x) => x.id !== id)),
    orders,
    addOrder: (o) => setOrders((prev) => [o, ...prev]),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreState {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

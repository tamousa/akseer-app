import React, { createContext, useContext, useState } from "react";

export interface CartItem {
  id: string;
  providerId: string;
  providerName: string;
  providerType: string;
  serviceId: string;
  serviceName: string;
  price: number;
  date: string;
  time: string;
  duration: number;
  doctorName?: string;
  bookingMethod?: "in-person" | "video" | "phone";
}

export interface ProductCartItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  originalPrice?: number;
  qty: number;
  storeId: string;
  storeName: string;
  emoji: string;
}

export interface InvoiceData {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  providerName: string;
  providerType: string;
  date: string;
  status: "paid";
}

export interface ProductOrder {
  id: string;
  items: ProductCartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  storeName: string;
  storeId: string;
  deliveryMethod: "pickup" | "home";
  shippingMethod?: "standard" | "express";
  address?: string;
  city?: string;
  paymentMethod: string;
  date: string;
  status: "placed" | "confirmed" | "preparing" | "shipped" | "delivered";
  estimatedTime?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  totalPrice: number;
  invoices: InvoiceData[];
  addInvoice: (invoice: InvoiceData) => void;
  productItems: ProductCartItem[];
  addProductToCart: (item: Omit<ProductCartItem, "id">) => void;
  removeProductFromCart: (id: string) => void;
  updateProductQty: (id: string, qty: number) => void;
  clearProductCart: () => void;
  productTotal: number;
  productOrders: ProductOrder[];
  addProductOrder: (order: ProductOrder) => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [productItems, setProductItems] = useState<ProductCartItem[]>([]);
  const [productOrders, setProductOrders] = useState<ProductOrder[]>([]);

  const addToCart = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = { ...item, id: Date.now().toString() };
    setItems((prev) => [...prev, newItem]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totalPrice = items.reduce((sum, i) => sum + i.price, 0);

  const addInvoice = (invoice: InvoiceData) => {
    setInvoices((prev) => [invoice, ...prev]);
  };

  const addProductToCart = (item: Omit<ProductCartItem, "id">) => {
    setProductItems((prev) => {
      const existing = prev.find(
        (p) => p.productId === item.productId && p.storeId === item.storeId
      );
      if (existing) {
        return prev.map((p) =>
          p.productId === item.productId && p.storeId === item.storeId
            ? { ...p, qty: p.qty + 1 }
            : p
        );
      }
      return [...prev, { ...item, id: Date.now().toString() }];
    });
  };

  const removeProductFromCart = (id: string) => {
    setProductItems((prev) => prev.filter((p) => p.id !== id));
  };

  const updateProductQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setProductItems((prev) => prev.filter((p) => p.id !== id));
    } else {
      setProductItems((prev) =>
        prev.map((p) => (p.id === id ? { ...p, qty } : p))
      );
    }
  };

  const clearProductCart = () => setProductItems([]);

  const productTotal = productItems.reduce(
    (sum, p) => sum + p.price * p.qty,
    0
  );

  const addProductOrder = (order: ProductOrder) => {
    setProductOrders((prev) => [order, ...prev]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        invoices,
        addInvoice,
        productItems,
        addProductToCart,
        removeProductFromCart,
        updateProductQty,
        clearProductCart,
        productTotal,
        productOrders,
        addProductOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

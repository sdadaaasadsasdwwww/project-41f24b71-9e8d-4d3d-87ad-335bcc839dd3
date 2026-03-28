import React, { createContext, useContext, useState, useCallback } from 'react';
import type { Product } from '@/data/products';
import { categories as defaultCategories } from '@/data/products';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  sender: 'client' | 'admin';
  text: string;
  time: string;
}

export interface Chat {
  id: string;
  clientName: string;
  messages: ChatMessage[];
  unread: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  comment: string;
  items: { product: Product; quantity: number }[];
  total: number;
  status: string;
  date: string;
}

export interface SiteSettings {
  shopName: string;
  phone: string;
  email: string;
  address: string;
}

interface StoreContextType {
  products: Product[];
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (category: Category) => void;
  updateCategory: (id: string, updates: Partial<Omit<Category, 'id'>>) => void;
  deleteCategory: (id: string) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrderStatus: (id: string, status: string) => void;
  chats: Chat[];
  addChat: (chat: Chat) => void;
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function load<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

const defaultSettings: SiteSettings = {
  shopName: 'Квітковий Рай',
  phone: '+380 (50) 123-45-67',
  email: 'info@kvitkovyrai.ua',
  address: 'м. Київ, вул. Хрещатик, 1',
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => load('store_products', []));
  const [cats, setCats] = useState<Category[]>(() => load('store_categories', defaultCategories));
  const [orders, setOrders] = useState<Order[]>(() => load('store_orders', []));
  const [chats, setChats] = useState<Chat[]>(() => load('store_chats', []));
  const [settings, setSettings] = useState<SiteSettings>(() => load('store_settings', defaultSettings));

  const addProduct = useCallback((p: Product) => {
    setProducts(prev => { const n = [...prev, p]; save('store_products', n); return n; });
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => { const n = prev.filter(p => p.id !== id); save('store_products', n); return n; });
  }, []);

  const addCategory = useCallback((cat: Category) => {
    setCats(prev => { const n = [...prev, cat]; save('store_categories', n); return n; });
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setCats(prev => { const n = prev.map(c => c.id === id ? { ...c, ...updates } : c); save('store_categories', n); return n; });
  }, []);

  const deleteCategory = useCallback((id: string) => {
    setCats(prev => { const n = prev.filter(c => c.id !== id); save('store_categories', n); return n; });
  }, []);

  const addOrder = useCallback((o: Order) => {
    setOrders(prev => { const n = [o, ...prev]; save('store_orders', n); return n; });
  }, []);

  const updateOrderStatus = useCallback((id: string, status: string) => {
    setOrders(prev => { const n = prev.map(o => o.id === id ? { ...o, status } : o); save('store_orders', n); return n; });
  }, []);

  const addChat = useCallback((c: Chat) => {
    setChats(prev => { const n = [...prev, c]; save('store_chats', n); return n; });
  }, []);

  const addMessageToChat = useCallback((chatId: string, msg: ChatMessage) => {
    setChats(prev => {
      const n = prev.map(c => c.id === chatId ? { ...c, messages: [...c.messages, msg], unread: msg.sender === 'client' } : c);
      save('store_chats', n);
      return n;
    });
  }, []);

  const updateSettings = useCallback((s: SiteSettings) => {
    setSettings(s);
    save('store_settings', s);
  }, []);

  return (
    <StoreContext.Provider value={{ products, addProduct, deleteProduct, categories: cats, addCategory, updateCategory, deleteCategory, orders, addOrder, updateOrderStatus, chats, addChat, addMessageToChat, settings, updateSettings }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

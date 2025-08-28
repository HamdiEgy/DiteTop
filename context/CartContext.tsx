import React, { createContext, useState } from 'react';
import { Meal, CartItem, SubscriptionCartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  subscription: SubscriptionCartItem | null;
  addToCart: (meal: Meal) => void;
  decreaseQuantity: (mealId: string) => void;
  removeFromCart: (mealId: string) => void;
  getItemQuantity: (mealId: string) => number;
  addSubscription: (subscription: SubscriptionCartItem) => void;
  removeSubscription: () => void;
  clearCart: () => void;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [subscription, setSubscription] = useState<SubscriptionCartItem | null>(null);

  const addToCart = (meal: Meal) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.meal.id === meal.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.meal.id === meal.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { meal, quantity: 1 }];
    });
  };

  const decreaseQuantity = (mealId: string) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.meal.id === mealId);
      if (existingItem && existingItem.quantity > 1) {
        return prevItems.map(item =>
          item.meal.id === mealId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // Remove item if quantity is 1 or less
      return prevItems.filter(item => item.meal.id !== mealId);
    });
  };

  const removeFromCart = (mealId: string) => {
    setItems(prevItems => prevItems.filter(item => item.meal.id !== mealId));
  };

  const addSubscription = (newSubscription: SubscriptionCartItem) => {
    setSubscription(newSubscription);
  };

  const removeSubscription = () => {
    setSubscription(null);
  };

  const clearCart = () => {
    setItems([]);
    setSubscription(null);
  };

  const getItemQuantity = (mealId: string): number => {
    const item = items.find(item => item.meal.id === mealId);
    return item ? item.quantity : 0;
  };

  const itemCount = items.reduce((total, item) => total + item.quantity, 0) + (subscription ? 1 : 0);

  return (
    <CartContext.Provider value={{ items, subscription, addToCart, decreaseQuantity, removeFromCart, getItemQuantity, addSubscription, removeSubscription, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

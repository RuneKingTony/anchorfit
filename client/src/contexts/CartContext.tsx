
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: Record<string, string>;
  prices?: Record<string, number>;
  size: string;
  color: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  applyPromoCode: (code: string) => Promise<boolean>;
  discount: number;
  promoCode: string;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

const getCartItemId = (item: { id: string, size: string, color: string }) => `${item.id}-${item.size}-${item.color}`;

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState('');
  const { user } = useAuth();

  const addToCart = (product: Product) => {
    setItems(prev => {
      const compositeId = getCartItemId(product);
      const existingItem = prev.find(item => getCartItemId(item) === compositeId);
      
      // Get the correct price based on color
      const productPrice = product.prices && product.prices[product.color] 
        ? product.prices[product.color] 
        : product.price;
      
      const productToAdd = {
        ...product,
        price: productPrice
      };
      
      if (existingItem) {
        return prev.map(item =>
          getCartItemId(item) === compositeId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prev, { ...productToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (compositeId: string) => {
    setItems(prev => prev.filter(item => getCartItemId(item) !== compositeId));
  };

  const updateQuantity = (compositeId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(compositeId);
      return;
    }
    
    setItems(prev =>
      prev.map(item => getCartItemId(item) === compositeId ? { ...item, quantity } : item)
    );
  };

  const getTotalPrice = () => {
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return subtotal - (subtotal * discount / 100);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const applyPromoCode = async (code: string) => {
    try {
      const upperCode = code.toUpperCase();
      
      // Check if it's a valid discount code from database
      const response = await fetch('/api/discount/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: upperCode }),
      });

      const result = await response.json();
      
      if (result.valid && result.discount) {
        setDiscount(result.discount.discount_percentage);
        setPromoCode(upperCode);
        return true;
      }

      return false;
    } catch (error) {
      return false;
    }
  };

  const clearCart = () => {
    setItems([]);
    setDiscount(0);
    setPromoCode('');
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      applyPromoCode,
      discount,
      promoCode,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

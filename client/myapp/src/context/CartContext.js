import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    
    const newTotal = cart.reduce((sum, item) => {
      const price = item.discount > 0 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
    
    setTotal(newTotal);
  }, [cart]);

  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item._id === product._id);
      
      if (existingItemIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId ? { ...item, quantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        total,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
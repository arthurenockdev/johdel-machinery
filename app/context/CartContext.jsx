'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(undefined)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState(null)

  useEffect(() => {
    // Load cart from local storage on initial render
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }, [])

  useEffect(() => {
    // Save cart to local storage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        // If the item already exists, increase its quantity
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      // If it's a new item, add it to the cart
      return [...prevCart, { ...product, quantity: 1 }]
    })
    setLastAddedProduct(product)
    setShowConfirmation(true)
  }

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id, quantity) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: Math.max(0, quantity) } : item
      )
    )
  }

  const clearCart = () => {
    setCart([])
  }

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      showConfirmation,
      setShowConfirmation,
      lastAddedProduct
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
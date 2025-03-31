import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  const { cart, total, updateQuantity, removeFromCart } = useContext(CartContext);
  const navigate = useNavigate();
  
  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, parseInt(quantity));
  };
  
  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
  };
  
  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        
        {cart.length === 0 ? (
          <div className="empty-cart">
            <div className="empty-cart-message">Your cart is empty</div>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
          </div>
        ) : (
          <div className="cart-container">
            <div className="cart-items">
              <div className="cart-header">
                <div className="cart-header-product">Product</div>
                <div className="cart-header-price">Price</div>
                <div className="cart-header-quantity">Quantity</div>
                <div className="cart-header-total">Total</div>
                <div className="cart-header-actions"></div>
              </div>
              
              {cart.map(item => {
                const itemPrice = item.discount > 0 
                  ? item.price * (1 - item.discount / 100) 
                  : item.price;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item._id} className="cart-item">
                    <div className="cart-item-product">
                      <img src={item.images[0] || "/placeholder.svg"} alt={item.name} className="cart-item-image" />
                      <div className="cart-item-details">
                        <Link to={`/products/${item._id}`} className="cart-item-name">{item.name}</Link>
                        {item.discount > 0 && (
                          <div className="cart-item-discount">-{item.discount}% OFF</div>
                        )}
                      </div>
                    </div>
                    
                    <div className="cart-item-price">
                      {item.discount > 0 ? (
                        <>
                          <span className="discounted-price">${itemPrice.toFixed(2)}</span>
                          <span className="original-price">${item.price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span>${item.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    <div className="cart-item-quantity">
                      <select 
                        value={item.quantity} 
                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                        className="quantity-select"
                      >
                        {[...Array(10).keys()].map(x => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="cart-item-total">
                      ${itemTotal.toFixed(2)}
                    </div>
                    
                    <div className="cart-item-actions">
                      <button 
                        className="remove-item-btn"
                        onClick={() => handleRemoveItem(item._id)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="cart-summary">
              <h3 className="summary-title">Order Summary</h3>
              
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="summary-row">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <button 
                className="btn btn-primary checkout-btn"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
              
              <div className="continue-shopping">
                <Link to="/products">Continue Shopping</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.name.split(' ')[0] || '',
    lastName: user?.name.split(' ')[1] || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    paymentMethod: 'credit-card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvv: ''
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cart, navigate, orderSuccess]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const orderData = {
        orderItems: cart.map(item => ({
          product: item._id,
          name: item.name,
          image: item.images[0],
          price: item.discount > 0 ? item.price * (1 - item.discount / 100) : item.price,
          quantity: item.quantity
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: total,
        taxPrice: total * 0.1, 
        shippingPrice: total > 100 ? 0 : 10,
        totalPrice: total + (total * 0.1) + (total > 100 ? 0 : 10)
      };
      
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: {
          Authorization: `Bearer ${token}`
        }
      } : {};
      
      const res = await axios.post('/api/orders', orderData, config);
      
      setOrderId(res.data._id);
      setOrderSuccess(true);
      clearCart();
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrors({
        submit: err.response?.data?.message || 'An error occurred while placing your order'
      });
    }
  };
  
  if (orderSuccess) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="order-success">
            <div className="success-icon">✓</div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been received.</p>
            <div className="order-info">
              <p>Order ID: <span>{orderId}</span></p>
              <p>A confirmation email has been sent to <span>{formData.email}</span></p>
            </div>
            <div className="success-actions">
              <button 
                className="btn btn-primary"
                onClick={() => navigate('/products')}
              >
                Continue Shopping
              </button>
              {user && (
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/profile/orders')}
                >
                  View My Orders
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkout-page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        
        <div className="checkout-container">
          <form onSubmit={handleSubmit} className="checkout-form">
            <div className="form-section">
              <h2 className="section-title">Shipping Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input 
                    type="text" 
                    id="firstName" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange}
                    className={errors.firstName ? 'form-control error' : 'form-control'}
                  />
                  {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input 
                    type="text" 
                    id="lastName" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    className={errors.lastName ? 'form-control error' : 'form-control'}
                  />
                  {errors.lastName && <div className="error-message">{errors.lastName}</div>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange}
                    className={errors.email ? 'form-control error' : 'form-control'}
                  />
                  {errors.email && <div className="error-message">{errors.email}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange}
                    className={errors.phone ? 'form-control error' : 'form-control'}
                  />
                  {errors.phone && <div className="error-message">{errors.phone}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="address">Address</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange}
                  className={errors.address ? 'form-control error' : 'form-control'}
                />
                {errors.address && <div className="error-message">{errors.address}</div>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange}
                    className={errors.city ? 'form-control error' : 'form-control'}
                  />
                  {errors.city && <div className="error-message">{errors.city}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input 
                    type="text" 
                    id="state" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleChange}
                    className={errors.state ? 'form-control error' : 'form-control'}
                  />
                  {errors.state && <div className="error-message">{errors.state}</div>}
                </div>
                
                <div className="form-group">
                  <label htmlFor="zipCode">ZIP Code</label>
                  <input 
                    type="text" 
                    id="zipCode" 
                    name="zipCode" 
                    value={formData.zipCode} 
                    onChange={handleChange}
                    className={errors.zipCode ? 'form-control error' : 'form-control'}
                  />
                  {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="country">Country</label>
                <select 
                  id="country" 
                  name="country" 
                  value={formData.country} 
                  onChange={handleChange}
                  className="form-control"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
            
            <div className="form-section">
              <h2 className="section-title">Payment Method</h2>
              
              <div className="payment-methods">
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="credit-card" 
                    name="paymentMethod" 
                    value="credit-card" 
                    checked={formData.paymentMethod === 'credit-card'} 
                    onChange={handleChange}
                  />
                  <label htmlFor="credit-card">Credit Card</label>
                </div>
                
                <div className="payment-method">
                  <input 
                    type="radio" 
                    id="paypal" 
                    name="paymentMethod" 
                    value="paypal" 
                    checked={formData.paymentMethod === 'paypal'} 
                    onChange={handleChange}
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit-card' && (
                <div className="credit-card-form">
                  <div className="form-group">
                    <label htmlFor="cardNumber">Card Number</label>
                    <input 
                      type="text" 
                      id="cardNumber" 
                      name="cardNumber" 
                      value={formData.cardNumber} 
                      onChange={handleChange}
                      placeholder="1234 5678 9012 3456"
                      className={errors.cardNumber ? 'form-control error' : 'form-control'}
                    />
                    {errors.cardNumber && <div className="error-message">{errors.cardNumber}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="cardName">Name on Card</label>
                    <input 
                      type="text" 
                      id="cardName" 
                      name="cardName" 
                      value={formData.cardName} 
                      onChange={handleChange}
                      className={errors.cardName ? 'form-control error' : 'form-control'}
                    />
                    {errors.cardName && <div className="error-message">{errors.cardName}</div>}
                  </div>
                  
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="cardExpiry">Expiry Date</label>
                      <input 
                        type="text" 
                        id="cardExpiry" 
                        name="cardExpiry" 
                        value={formData.cardExpiry} 
                        onChange={handleChange}
                        placeholder="MM/YY"
                        className={errors.cardExpiry ? 'form-control error' : 'form-control'}
                      />
                      {errors.cardExpiry && <div className="error-message">{errors.cardExpiry}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="cardCvv">CVV</label>
                      <input 
                        type="text" 
                        id="cardCvv" 
                        name="cardCvv" 
                        value={formData.cardCvv} 
                        onChange={handleChange}
                        placeholder="123"
                        className={errors.cardCvv ? 'form-control error' : 'form-control'}
                      />
                      {errors.cardCvv && <div className="error-message">{errors.cardCvv}</div>}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {errors.submit && (
              <div className="submit-error">
                {errors.submit}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn btn-primary place-order-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
          
          <div className="order-summary">
            <h2 className="summary-title">Order Summary</h2>
            
            <div className="summary-items">
              {cart.map(item => {
                const itemPrice = item.discount > 0 
                  ? item.price * (1 - item.discount / 100) 
                  : item.price;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item._id} className="summary-item">
                    <div className="item-image">
                      <img src={item.images[0] || "/placeholder.svg"} alt={item.name} />
                      <span className="item-quantity">{item.quantity}</span>
                    </div>
                    <div className="item-details">
                      <div className="item-name">{item.name}</div>
                      <div className="item-price">${itemPrice.toFixed(2)}</div>
                    </div>
                    <div className="item-total">${itemTotal.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (10%)</span>
                <span>${(total * 0.1).toFixed(2)}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>{total > 100 ? 'Free' : '$10.00'}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>${(total + (total * 0.1) + (total > 100 ? 0 : 10)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
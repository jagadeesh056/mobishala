import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3 className="footer-title">Uolo Shop</h3>
            <p className="footer-description">
              Your one-stop shop for quality products at affordable prices. We offer a wide range of products to meet your needs.
            </p>
            <div className="social-links">
              <a href="#" className="social-link"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="social-link"><i className="fab fa-twitter"></i></a>
              <a href="#" className="social-link"><i className="fab fa-instagram"></i></a>
              <a href="#" className="social-link"><i className="fab fa-pinterest"></i></a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Shop</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Customer Service</h3>
            <ul className="footer-links">
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping & Returns</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-title">Newsletter</h3>
            <p className="footer-description">
              Subscribe to our newsletter to get updates on our latest offers!
            </p>
            <form className="newsletter-form">
              <input type="email" placeholder="Enter your email" className="newsletter-input" />
              <button type="submit" className="newsletter-button">Subscribe</button>
            </form>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} Uolo Shop. All rights reserved.
          </p>
          <div className="payment-methods">
            <span className="payment-method">Visa</span>
            <span className="payment-method">Mastercard</span>
            <span className="payment-method">PayPal</span>
            <span className="payment-method">Apple Pay</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
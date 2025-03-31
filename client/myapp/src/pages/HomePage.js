import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import './HomePage.css';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        const featuredRes = await axios.get('/api/products?featured=true&limit=4');
        setFeaturedProducts(featuredRes.data);
        
        const newArrivalsRes = await axios.get('/api/products?sort=createdAt&limit=8');
        setNewArrivals(newArrivalsRes.data);
        
        const bestSellersRes = await axios.get('/api/products?sort=sales&limit=4');
        setBestSellers(bestSellersRes.data);
        
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <div className="hero-text">
            <h1 className="hero-title">Set up your shopping for success!</h1>
            <p className="hero-subtitle">
              Discover quality products at affordable prices with our curated collection
            </p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
          <div className="hero-image">
            <img src="/placeholder.svg?height=400&width=500" alt="Hero" />
          </div>
        </div>
      </section>

      <section className="section featured-section">
        <div className="container">
          <h2 className="section-title">Featured Products</h2>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="grid">
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/products?featured=true" className="btn btn-secondary">View All Featured</Link>
          </div>
        </div>
      </section>

      <section className="section categories-section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          
          <div className="categories-grid">
            <Link to="/products?category=electronics" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=200&width=200" alt="Electronics" />
              </div>
              <h3 className="category-title">Electronics</h3>
            </Link>
            
            <Link to="/products?category=clothing" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=200&width=200" alt="Clothing" />
              </div>
              <h3 className="category-title">Clothing</h3>
            </Link>
            
            <Link to="/products?category=home" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=200&width=200" alt="Home & Kitchen" />
              </div>
              <h3 className="category-title">Home & Kitchen</h3>
            </Link>
            
            <Link to="/products?category=books" className="category-card">
              <div className="category-image">
                <img src="/placeholder.svg?height=200&width=200" alt="Books" />
              </div>
              <h3 className="category-title">Books</h3>
            </Link>
          </div>
        </div>
      </section>

      <section className="section new-arrivals-section">
        <div className="container">
          <h2 className="section-title">New Arrivals</h2>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="grid">
              {newArrivals.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/products?sort=createdAt" className="btn btn-secondary">View All New Arrivals</Link>
          </div>
        </div>
      </section>

      <section className="section best-sellers-section">
        <div className="container">
          <h2 className="section-title">Best Sellers</h2>
          
          {loading ? (
            <div className="loading">Loading...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="grid">
              {bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="view-all">
            <Link to="/products?sort=sales" className="btn btn-secondary">View All Best Sellers</Link>
          </div>
        </div>
      </section>

      <section className="section newsletter-section">
        <div className="container">
          <div className="newsletter-container">
            <div className="newsletter-content">
              <h2 className="newsletter-title">Subscribe to our Newsletter</h2>
              <p className="newsletter-text">
                Get the latest updates on new products and upcoming sales
              </p>
              <form className="newsletter-form-large">
                <input type="email" placeholder="Your email address" className="newsletter-input-large" />
                <button type="submit" className="btn btn-primary">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
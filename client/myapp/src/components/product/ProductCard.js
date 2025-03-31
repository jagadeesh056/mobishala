import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-image" />
          {product.discount > 0 && (
            <span className="product-discount">-{product.discount}%</span>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price-container">
            {product.discount > 0 ? (
              <>
                <span className="product-price">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                <span className="product-original-price">${product.price.toFixed(2)}</span>
              </>
            ) : (
              <span className="product-price">${product.price.toFixed(2)}</span>
            )}
          </div>
          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
            ))}
            <span className="rating-count">({product.reviews.length})</span>
          </div>
        </div>
      </Link>
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;
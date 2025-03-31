import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/products/${id}`);
        setProduct(res.data);
        setSelectedImage(0);
        setLoading(false);
        
        // Fetch related products
        const relatedRes = await axios.get(`/api/products?category=${res.data.category}&limit=4&exclude=${id}`);
        setRelatedProducts(relatedRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch product');
        setLoading(false);
      }
    };
    
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    setQuantity(value);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setReviewError('You must be logged in to submit a review');
      return;
    }
    
    try {
      setReviewSubmitting(true);
      setReviewError(null);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      await axios.post(`/api/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewText
      }, config);
      
      const res = await axios.get(`/api/products/${id}`);
      setProduct(res.data);
      
      // Reset form
      setReviewText('');
      setReviewRating(5);
      setReviewSubmitting(false);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail-page">
      <div className="container">
        <div className="breadcrumbs">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <Link to={`/products?category=${product.category.toLowerCase()}`}>{product.category}</Link> / 
          <span>{product.name}</span>
        </div>
        
        <div className="product-detail-container">
          <div className="product-images">
            <div className="main-image-container">
              <img 
                src={product.images[selectedImage] || "/placeholder.svg"} 
                alt={product.name} 
                className="main-image" 
              />
              {product.discount > 0 && (
                <span className="product-discount">-{product.discount}%</span>
              )}
            </div>
            
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={image || "/placeholder.svg"} alt={`${product.name} - ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
          
          <div className="product-info">
            <h1 className="product-name">{product.name}</h1>
            
            <div className="product-rating">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(product.rating) ? 'filled' : ''}`}>★</span>
              ))}
              <span className="rating-count">({product.reviews.length} reviews)</span>
            </div>
            
            <div className="product-price-container">
              {product.discount > 0 ? (
                <>
                  <span className="product-price">${(product.price * (1 - product.discount / 100)).toFixed(2)}</span>
                  <span className="product-original-price">${product.price.toFixed(2)}</span>
                  <span className="product-discount-label">Save {product.discount}%</span>
                </>
              ) : (
                <span className="product-price">${product.price.toFixed(2)}</span>
              )}
            </div>
            
            <div className="product-description">
              <p>{product.description}</p>
            </div>
            
            <div className="product-meta">
              <div className="meta-item">
                <span className="meta-label">Category:</span>
                <span className="meta-value">{product.category}</span>
              </div>
              
              <div className="meta-item">
                <span className="meta-label">Availability:</span>
                <span className={`meta-value ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              {product.brand && (
                <div className="meta-item">
                  <span className="meta-label">Brand:</span>
                  <span className="meta-value">{product.brand}</span>
                </div>
              )}
            </div>
            
            <div className="product-actions">
              <div className="quantity-selector">
                <label htmlFor="quantity">Quantity:</label>
                <select 
                  id="quantity" 
                  value={quantity} 
                  onChange={handleQuantityChange}
                  disabled={product.countInStock === 0}
                >
                  {[...Array(Math.min(10, product.countInStock)).keys()].map(x => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
              
              <button 
                className="btn btn-primary add-to-cart-btn"
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
              >
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              
              <button className="btn btn-secondary wishlist-btn">
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
        
        <div className="product-tabs">
          <div className="tabs-header">
            <button className="tab-btn active">Description</button>
            <button className="tab-btn">Specifications</button>
            <button className="tab-btn">Reviews ({product.reviews.length})</button>
          </div>
          
          <div className="tab-content">
            <div className="tab-pane active">
              <h3>Product Description</h3>
              <div className="description-content">
                <p>{product.description}</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.</p>
                <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="product-reviews">
          <h3>Customer Reviews</h3>
          
          {product.reviews.length === 0 ? (
            <p className="no-reviews">There are no reviews yet.</p>
          ) : (
            <div className="reviews-list">
              {product.reviews.map(review => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="review-user">{review.name}</div>
                    <div className="review-rating">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`star ${i < review.rating ? 'filled' : ''}`}>★</span>
                      ))}
                    </div>
                    <div className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
            </div>
          )}
          
          <div className="write-review">
            <h4>Write a Review</h4>
            
            {!user && (
              <p className="login-prompt">
                Please <Link to="/login">login</Link> to write a review.
              </p>
            )}
            
            {user && (
              <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="form-group">
                  <label htmlFor="rating">Rating</label>
                  <select 
                    id="rating" 
                    value={reviewRating} 
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    required
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="comment">Review</label>
                  <textarea 
                    id="comment" 
                    value={reviewText} 
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    rows="4"
                  ></textarea>
                </div>
                
                {reviewError && <div className="review-error">{reviewError}</div>}
                
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </form>
            )}
          </div>
        </div>
        
        {relatedProducts.length > 0 && (
          <div className="related-products">
            <h3>Related Products</h3>
            
            <div className="related-products-grid">
              {relatedProducts.map(product => (
                <div key={product._id} className="related-product-card">
                  <Link to={`/products/${product._id}`} className="related-product-link">
                    <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="related-product-image" />
                    <div className="related-product-info">
                      <h4 className="related-product-name">{product.name}</h4>
                      <div className="related-product-price">${product.price.toFixed(2)}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/product/ProductCard';
import './ProductsPage.css';

const ProductsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    sort: queryParams.get('sort') || 'newest'
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get('/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        
        let query = `?page=${currentPage}`;
        
        if (filters.category) query += `&category=${filters.category}`;
        if (filters.minPrice) query += `&minPrice=${filters.minPrice}`;
        if (filters.maxPrice) query += `&maxPrice=${filters.maxPrice}`;
        if (filters.rating) query += `&rating=${filters.rating}`;
        
        switch (filters.sort) {
          case 'newest':
            query += '&sort=-createdAt';
            break;
          case 'price-low-high':
            query += '&sort=price';
            break;
          case 'price-high-low':
            query += '&sort=-price';
            break;
          case 'popular':
            query += '&sort=-sales';
            break;
          case 'rating':
            query += '&sort=-rating';
            break;
          default:
            query += '&sort=-createdAt';
        }
        
        if (queryParams.get('featured') === 'true') {
          query += '&featured=true';
        }
        
        const res = await axios.get(`/api/products${query}`);
        
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [currentPage, filters, queryParams]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      sort: 'newest'
    });
    setCurrentPage(1);
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="page-title">
          {filters.category 
            ? `${filters.category.charAt(0).toUpperCase() + filters.category.slice(1)} Products` 
            : queryParams.get('featured') === 'true' 
              ? 'Featured Products' 
              : 'All Products'}
        </h1>
        
        <div className="products-container">
          <div className="filters-sidebar">
            <div className="filters-header">
              <h3>Filters</h3>
              <button className="clear-filters" onClick={clearFilters}>Clear All</button>
            </div>
            
            <div className="filter-group">
              <h4>Categories</h4>
              <select 
                name="category" 
                value={filters.category} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category._id} value={category.name.toLowerCase()}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="filter-group">
              <h4>Price Range</h4>
              <div className="price-inputs">
                <input 
                  type="number" 
                  name="minPrice" 
                  placeholder="Min" 
                  value={filters.minPrice} 
                  onChange={handleFilterChange}
                  className="price-input"
                />
                <span>to</span>
                <input 
                  type="number" 
                  name="maxPrice" 
                  placeholder="Max" 
                  value={filters.maxPrice} 
                  onChange={handleFilterChange}
                  className="price-input"
                />
              </div>
            </div>
            
            <div className="filter-group">
              <h4>Rating</h4>
              <select 
                name="rating" 
                value={filters.rating} 
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="">All Ratings</option>
                <option value="4">4★ & Above</option>
                <option value="3">3★ & Above</option>
                <option value="2">2★ & Above</option>
                <option value="1">1★ & Above</option>
              </select>
            </div>
          </div>
          
          <div className="products-content">
            <div className="products-header">
              <div className="products-count">
                {loading ? 'Loading...' : `${products.length} products found`}
              </div>
              
              <div className="sort-container">
                <label htmlFor="sort">Sort by:</label>
                <select 
                  id="sort" 
                  name="sort" 
                  value={filters.sort} 
                  onChange={handleFilterChange}
                  className="sort-select"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>
            
            {loading ? (
              <div className="loading">Loading products...</div>
            ) : error ? (
              <div className="error">{error}</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <p>No products found matching your criteria.</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                
                <div className="pagination-numbers">
                  {[...Array(totalPages).keys()].map(page => (
                    <button
                      key={page + 1}
                      className={`pagination-number ${currentPage === page + 1 ? 'active' : ''}`}
                      onClick={() => handlePageChange(page + 1)}
                    >
                      {page + 1}
                    </button>
                  ))}
                </div>
                
                <button 
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
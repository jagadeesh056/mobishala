import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import './Header.css';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <h1>Uolo</h1>
        </Link>

        <div className={`nav-container ${isMenuOpen ? 'active' : ''}`}>
          <nav className="nav">
            <ul className="nav-list">
              <li className="nav-item">
                <div className="dropdown">
                  <button className="dropdown-toggle" onClick={toggleDropdown}>
                    Categories
                    <span className={`arrow ${isDropdownOpen ? 'up' : 'down'}`}></span>
                  </button>
                  {isDropdownOpen && (
                    <div className="dropdown-menu">
                      <Link to="/products?category=electronics" className="dropdown-item">Electronics</Link>
                      <Link to="/products?category=clothing" className="dropdown-item">Clothing</Link>
                      <Link to="/products?category=home" className="dropdown-item">Home & Kitchen</Link>
                      <Link to="/products?category=books" className="dropdown-item">Books</Link>
                    </div>
                  )}
                </div>
              </li>
              <li className="nav-item">
                <Link to="/products" className="nav-link">All Products</Link>
              </li>
            </ul>
          </nav>

          <div className="header-actions">
            <Link to="/cart" className="cart-icon">
              <i className="fas fa-shopping-cart"></i>
              {cartItemsCount > 0 && <span className="cart-count">{cartItemsCount}</span>}
            </Link>
            
            {user ? (
              <div className="user-menu">
                <button className="user-menu-toggle">
                  <span>Hi, {user.name.split(' ')[0]}</span>
                </button>
                <div className="user-dropdown">
                  <Link to="/profile" className="user-dropdown-item">My Profile</Link>
                  <Link to="/orders" className="user-dropdown-item">My Orders</Link>
                  <button onClick={handleLogout} className="user-dropdown-item logout">Logout</button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </div>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <span className={`menu-icon ${isMenuOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;
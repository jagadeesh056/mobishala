import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  
  const { register, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      setError(null);
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us today! Create your account to start shopping.</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                value={formData.name} 
                onChange={handleChange} 
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email"
                value={formData.email} 
                onChange={handleChange} 
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password"
                value={formData.password} 
                onChange={handleChange} 
                required
                minLength="6"
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required
                className="form-control"
              />
            </div>
            
            <div className="terms-agreement">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
              </label>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login">
            <button className="btn btn-secondary social-btn">
              <i className="fab fa-google"></i> Register with Google
            </button>
            <button className="btn btn-secondary social-btn">
              <i className="fab fa-facebook-f"></i> Register with Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>Login</Link>
          </div>
        </div>
        
        <div className="auth-image">
          <img src="/placeholder.svg?height=600&width=600" alt="Register" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
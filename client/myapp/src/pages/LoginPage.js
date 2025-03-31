import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const { login, user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  const redirect = location.search ? location.search.split('=')[1] : '/';
  
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    }
  };
  
  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-form-container">
          <h1 className="auth-title">Login</h1>
          <p className="auth-subtitle">Welcome back! Please login to your account.</p>
          
          {error && <div className="auth-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required
                className="form-control"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                className="form-control"
              />
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="/forgot-password" className="forgot-password">Forgot password?</Link>
            </div>
            
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="auth-divider">
            <span>OR</span>
          </div>
          
          <div className="social-login">
            <button className="btn btn-secondary social-btn">
              <i className="fab fa-google"></i> Login with Google
            </button>
            <button className="btn btn-secondary social-btn">
              <i className="fab fa-facebook-f"></i> Login with Facebook
            </button>
          </div>
          
          <div className="auth-footer">
            Don't have an account? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>Register</Link>
          </div>
        </div>
        
        <div className="auth-image">
          <img src="/placeholder.svg?height=600&width=600" alt="Login" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
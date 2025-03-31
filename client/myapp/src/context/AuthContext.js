import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        const res = await axios.get('/api/users/profile', config);
        
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        localStorage.removeItem('token');
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };
    
    checkLoggedIn();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/register', userData);
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setError(null);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setLoading(false);
      throw err;
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/users/login', { email, password });
      
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setError(null);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const res = await axios.put('/api/users/profile', userData, config);
      
      setUser(res.data);
      setError(null);
      setLoading(false);
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
      setLoading(false);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
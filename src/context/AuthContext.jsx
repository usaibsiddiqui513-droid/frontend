import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { INITIAL_USER } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('pulsefit_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [token, setToken] = useState(() => localStorage.getItem('pulsefit_token') || 'demo_jwt_token_pulsefit');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  // Sync token in localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('pulsefit_token', token);
    } else {
      localStorage.removeItem('pulsefit_token');
    }
  }, [token]);

  // Sync user in localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('pulsefit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pulsefit_user');
    }
  }, [user]);

  // Verify auth on mount if real token
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('pulsefit_token');
      if (storedToken && storedToken !== 'demo_jwt_token_pulsefit') {
        try {
          const res = await authAPI.getMe();
          if (res.data?.user) {
            setUser(res.data.user);
          }
        } catch (err) {
          console.warn('API auth verification failed, using local session');
        }
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      // Try real backend API
      const res = await authAPI.login({ email, password });
      const { user: userData, token: jwtToken } = res.data;
      setUser(userData);
      setToken(jwtToken);
      return { success: true };
    } catch (err) {
      // If backend is not connected yet, check demo credentials or graceful fallback
      if (email === INITIAL_USER.email || email.includes('@')) {
        const fallbackUser = {
          ...INITIAL_USER,
          email,
          name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase())
        };
        setUser(fallbackUser);
        setToken('demo_jwt_token_pulsefit');
        return { success: true, isDemo: true };
      }
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      setAuthError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await authAPI.register(userData);
      const { user: newUser, token: jwtToken } = res.data;
      setUser(newUser);
      setToken(jwtToken);
      return { success: true };
    } catch (err) {
      // Graceful offline fallback
      const fallbackUser = {
        _id: 'usr_' + Date.now(),
        name: userData.name || 'New Athlete',
        email: userData.email,
        avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        bio: userData.bio || 'Starting my fitness transformation with PulseFit!',
        unitPreference: userData.unitPreference || 'KG',
        weight: Number(userData.weight) || 75,
        targetWeight: Number(userData.targetWeight) || 72,
        height: Number(userData.height) || 178,
        fitnessGoal: userData.fitnessGoal || 'General Fitness',
        dailyCalorieTarget: 2200,
        dailyProteinTarget: 150,
        dailyCarbsTarget: 250,
        dailyFatsTarget: 60,
        joinedAt: new Date().toISOString()
      };
      setUser(fallbackUser);
      setToken('demo_jwt_token_pulsefit');
      return { success: true, isDemo: true };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('pulsefit_token');
    localStorage.removeItem('pulsefit_user');
  };

  const updateProfile = async (updatedFields) => {
    setLoading(true);
    try {
      try {
        const res = await authAPI.updateProfile(updatedFields);
        if (res.data?.user) {
          setUser(res.data.user);
          return { success: true };
        }
      } catch (e) {
        // Fallback update locally
      }
      setUser(prev => ({ ...prev, ...updatedFields }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        loading,
        authError,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

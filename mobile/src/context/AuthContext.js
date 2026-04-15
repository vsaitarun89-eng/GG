import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userToken, setUserToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email, password) => {
    try {
      const safeEmail = email.trim().toLowerCase();
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: safeEmail, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUserToken(data.token);
        setUserInfo(data.user);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (e) {
      console.log('Login error', e);
      alert('Error connecting to server');
    }
  };

  const signup = async (fullName, email, password) => {
    try {
      const safeEmail = email.trim().toLowerCase();
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: fullName.trim(), email: safeEmail, password })
      });
      const data = await response.json();
      if (response.ok) {
        setUserToken(data.token);
        setUserInfo(data.user);
        await AsyncStorage.setItem('userToken', data.token);
        await AsyncStorage.setItem('userInfo', JSON.stringify(data.user));
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (e) {
      console.log('Signup error', e);
      alert('Error connecting to server');
    }
  };

  const logout = async () => {
    try {
      setUserToken(null);
      setUserInfo(null);
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userInfo');
    } catch (e) {
      console.log('Logout error', e);
    }
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      let info = await AsyncStorage.getItem('userInfo');
      if (token) {
        setUserToken(token);
        setUserInfo(JSON.parse(info));
      }
    } catch (e) {
      console.log('isLoggedIn error', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, signup, logout, userToken, userInfo, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

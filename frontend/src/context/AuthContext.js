import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userData, setUserData] = useState(null); // State userData

  const isLogged = async () => {
    try {
      setIsLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const user = await AsyncStorage.getItem('userData');

      if (token) {
        setUserToken(token);
        if (user) setUserData(JSON.parse(user));
      }
    } catch (e) {
      console.log('Error restore token:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    isLogged();
  }, []);

  const register = async (nama, email, password) => {
    try {
      const response = await apiClient.post('/api/auth/register', { nama, email, password });
      return { success: true, data: response.data };
    } catch (error) {
      console.log('Error Register Detail:', error.response?.data || error.message);
      const message = 
        error.response?.data?.pesan || 
        error.response?.data?.message || 
        'Gagal mendaftar akun baru';
      return { success: false, message };
    }
  };

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/api/auth/login', { email, password });
      const { token, user } = response.data;

      // Simpan ke state
      setUserToken(token);
      setUserData(user);

      // Simpan ke penyimpanan lokal HP
      await AsyncStorage.setItem('userToken', token);
      await AsyncStorage.setItem('userData', JSON.stringify(user));

      setIsLoading(false);
      return { success: true };
    } catch (error) {
      setIsLoading(false);
      console.log('Error Login Detail:', error.response?.data || error.message);
      const message = 
        error.response?.data?.pesan || 
        error.response?.data?.message || 
        'Email atau password salah';
      return { success: false, message };
    }
  };

  const logout = async () => {
    setIsLoading(true);
    setUserToken(null);
    setUserData(null);
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        userToken,
        userData,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
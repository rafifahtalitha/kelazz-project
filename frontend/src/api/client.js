import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Ganti 192.168.X.X dengan IP IPv4 hasil ipconfig laptopmu!
const FALLBACK_IP = '20.5.32.229'; 
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${FALLBACK_IP}:3000`;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // Batas waktu tunggu 10 detik agar tidak menggantung lama
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Interceptor Request: Otomatis tempelkan Token JWT
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[API Request] ${config.method.toUpperCase()} => ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 2. Interceptor Response: Tangkap error jaringan & debugging lebih jelas
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.log('[API Error] Request Timeout: Koneksi ke server terlalu lambat');
    } else if (!error.response) {
      console.log('[API Error] Network Error: Pastikan HP & Laptop di 1 WiFi dan IP benar');
    } else {
      console.log(`[API Error] Status ${error.response.status}:`, error.response.data);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
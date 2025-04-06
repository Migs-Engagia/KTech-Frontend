// src/utils/axiosInstance.js
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
const baseURL = apiUrl || "http://localhost:94/api";

const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: adds token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

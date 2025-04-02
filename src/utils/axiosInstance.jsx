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

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    const accessToken = response.headers["access-token"];
    if (accessToken) {
      localStorage.setItem("token", accessToken);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

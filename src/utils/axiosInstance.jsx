import axios from "axios";

const AxiosInstance = () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  const baseURL = apiUrl && apiUrl !== "" ? apiUrl : "http://localhost:94/api";
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      if (response.headers["access-token"]) {
        localStorage.setItem("token", response.headers["access-token"]);
      }
      return response;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

export { AxiosInstance };

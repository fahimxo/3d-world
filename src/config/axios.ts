import axios from "axios";
import { showToast } from "./toastService";

const api = axios.create({
  baseURL: "http://194.5.175.183:4444",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("JWT")}`,
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    if (response?.data?.code !== 0) {
      showToast(response?.data?.message, "failed");
    }

    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "An error occurred";

    showToast(message, "failed");

    if (error.response?.status === 401) {
      // کارهای مربوط به لاگ‌اوت یا ریدایرکت
    }

    return Promise.reject(error);
  }
);

export default api;
import axios from "axios";
// import { showErrorToast } from "../services/toastService";

const api = axios.create({
  baseURL: "http://194.5.175.183:4444",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("JWT")}`,
  },
});

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "error";

    // showErrorToast(message);

    if (error.response?.status === 401) {
    }

    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";
// // import { showErrorToast } from "../services/toastService";

// const api = axios.create({
//   baseURL: "http://194.5.175.183:4444",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers["Authorization"] = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   (error) => {
//     const message = error.response?.data?.message || "error";

//     // showErrorToast(message);

//     if (error.response?.status === 401) {
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from "axios";
import { showToast } from "./toastService";

const api = axios.create({
  baseURL: "http://194.5.175.183:4444",
  headers: {
    "Content-Type": "application/json",
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
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.message || "خطایی رخ داده است";

    showToast(message, "failed");

    if (error.response?.status === 401) {
      // کارهای مربوط به لاگ‌اوت یا ریدایرکت
    }

    return Promise.reject(error);
  }
);

export default api;

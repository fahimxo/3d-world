import axios, { AxiosRequestConfig } from "axios";

const apiClient = axios.create({
  baseURL: "http://194.5.175.183:4444",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => response.data, // اینجا AxiosResponse رو به data تبدیل می‌کنیم
  (error) => {
    const message = error.response?.data?.message || "خطای ناشناخته";
    console.error(message);
    return Promise.reject(error);
  }
);

// --------------------
// متدهای کمکی GET و POST با تایپ جنریک
// --------------------
export const apiGet = async <T>(
  url: string,
  params: Record<string, any> = {},
  config: AxiosRequestConfig = {}
): Promise<T> => {
  return apiClient.get(url, { params, ...config });
};

export const apiPost = async <T>(
  url: string,
  body: Record<string, any> = {},
  config: AxiosRequestConfig = {}
): Promise<T> => {
  return apiClient.post(url, body, config);
};

export default apiClient;

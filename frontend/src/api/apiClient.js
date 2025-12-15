import axios from "axios";
import useAuthStore from "../store/useAuthStore";

// Ensure we always use the proxy path for development
const getBaseURL = () => {
  // In development, use the proxy path which Vite will forward to port 8000
  // In production, you can set VITE_API_BASE environment variable
  if (import.meta.env.DEV) {
    return "/api";
  }
  return import.meta.env.VITE_API_BASE || "/api";
};

// Create a separate axios instance for token refresh to avoid circular dependency
const refreshApi = axios.create({
  baseURL: getBaseURL(),
});

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().access;
  // Only add token if it exists and is not the string "null"
  if (token && token !== "null" && token !== null) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // Debug: log when token is missing (remove in production)
    if (import.meta.env.DEV) {
      console.warn("API Request without token:", config.url);
    }
  }
  return config;
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const { logout, refresh, setAuth } = useAuthStore.getState();

    // Only logout on 401 (Unauthorized) - token expired/invalid
    // Don't logout on 403 (Forbidden) - just permission denied, show error instead
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      // Try to refresh the token
      if (refresh) {
        try {
          const response = await refreshApi.post("/token/refresh/", {
            refresh: refresh
          });

          const { access, refresh: newRefresh } = response.data;
          
          // Update tokens in store
          const { profileComplete, isStaff } = useAuthStore.getState();
          setAuth({
            access,
            refresh: newRefresh || refresh,
            profileComplete,
            isStaff
          });

          // Update the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          
          // Process queued requests
          processQueue(null, access);
          isRefreshing = false;

          // Retry the original request
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed - logout user
          processQueue(refreshError, null);
          isRefreshing = false;
          console.warn("Token refresh failed - logging out");
          logout();
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token available - logout
        isRefreshing = false;
        console.warn("No refresh token - logging out");
        logout();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

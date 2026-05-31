import axios from 'axios';

// Create a centralized Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT to every outgoing request if available
api.interceptors.request.use(
  (config) => {
    const userString = localStorage.getItem('nexus_user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        console.error('Failed to parse user from local storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Gracefully handle global 401 Unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Clear compromised token
      localStorage.removeItem('nexus_user');
      // Dispatch a custom event so the AuthContext can pick it up and update the UI smoothly
      window.dispatchEvent(new Event('nexus_auth_expired'));
    }
    return Promise.reject(error);
  }
);

export default api;

// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export default api;
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    
    // Add token to headers if it exists
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk handle error
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Optional: Redirect to login page
      // window.location.href = '/login';
      console.error('Unauthorized - Please login again');
    }
    
    return Promise.reject(error);
  }
);

export default api;
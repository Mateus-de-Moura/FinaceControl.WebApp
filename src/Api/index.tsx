import axios from "axios";
import authService from "@/Services/authService";
import { AuthUser } from "@/Services/authService";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 0,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {      
      const isLogoutRequest = error.config?.url?.includes('/auth/logout') || 
                             error.config?.url?.includes('/logout');
      
      if (!isLogoutRequest) {
        try {
          const storedData = localStorage.getItem('loginData');
          if (storedData) {
            var data = JSON.parse(storedData) as AuthUser;
            await authService.refreshToken(data.email, data.refreshToken);
          }
        } catch (refreshError) {          
          localStorage.removeItem('loginData');
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;

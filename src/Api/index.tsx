import axios from 'axios'
import { AuthUser } from "@/Services/authService"
import authService from "@/Services/authService"

const apiUrl = import.meta.env.VITE_API_URL;

const Api = axios.create({
  baseURL: apiUrl,
  timeout: 0,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const storedData = localStorage.getItem('loginData');
        if (storedData) {
          const data = JSON.parse(storedData) as AuthUser;
          await authService.refreshToken(data.email, data.refreshToken);
        }
      } catch (refreshError) {
        // Se não conseguir renovar, limpa os dados e redireciona
        localStorage.removeItem('loginData');
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
)

export default Api

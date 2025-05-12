import axios from 'axios'
import { AuthUser } from "@/Services/authService"

const Api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 5000,
})

Api.interceptors.request.use(config => {
  const storedData = localStorage.getItem('loginData');
  var data = JSON.parse(storedData!) as AuthUser;

  if (data.tokenJwt && !config.url?.includes('/auth/login')) {
    config.headers.Authorization = `Bearer ${data.tokenJwt}`
  }

  return config
}, error => {
  return Promise.reject(error)
})

export default Api

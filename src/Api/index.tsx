import axios from 'axios'
import { AuthUser } from "@/Services/authService"
const apiUrl = import.meta.env.VITE_API_URL;

const Api = axios.create({
  baseURL: apiUrl,
})

Api.interceptors.request.use(config => {
  const storedData = localStorage.getItem('loginData');
  var data = JSON.parse(storedData!) as AuthUser;

  if (!config.url?.includes('/auth/login') && data?.tokenJwt) {
    config.headers.Authorization = `Bearer ${data.tokenJwt}`
  }

  return config
}, error => {
  return Promise.reject(error)
})

export default Api

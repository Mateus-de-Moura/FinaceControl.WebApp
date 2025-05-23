import axios from 'axios'
import { AuthUser } from "@/Services/authService"

const Api = axios.create({
  baseURL: "https://localhost:7113/",
  timeout: 5000,
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

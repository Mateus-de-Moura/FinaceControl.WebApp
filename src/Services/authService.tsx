import Api from "@/Api";
import { fetchLocationData } from './LoginLocationDataService'

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tokenJwt: string;
  refreshToken: string;
  username: string;
  photo: string;
  responseInfo: responseInfo | null
}

export interface responseInfo {
  title: string;
  errorDescription: string;
  httpStatus: number
}

interface LoginUserCommand {
  email: string;
  password: string;
  latitude?: string;
  longitude?: string;
}

const authService = {
  login: async (email: string, password: string) => {
    const loginData: LoginUserCommand = {
      email,
      password,
    };
    const response = await Api.post<AuthUser>("/Auth/Login", loginData);
    await fetchLocationData(email, true);
    return response.data;
  },

  logout: async () => {
    const response = await Api.post("/auth/logout");
    return response.data;
  },

  refreshToken: async (email: string, refreshToken: string) => {
    const response = await Api.post("/auth/Refresh-Token", {
      usernameOrEmail: email,
      refreshToken: refreshToken
    });

    localStorage.setItem('loginData', JSON.stringify(response.data));
    return response.data;
  },

  checkUserIsAuth: async () => {
    const response = await Api.get("/auth/user-info");
    return response.data;
  }
};

export const fetchAuthUser = authService.login;
export default authService;




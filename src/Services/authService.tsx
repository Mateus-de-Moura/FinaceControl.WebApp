import Api from "@/Api";
import { fetchLocationData } from './LoginLocationDataService'

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tokenJwt: string;
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

export const fetchAuthUser = async (email: string, password: string) => {
  const loginData: LoginUserCommand = {
    email,
    password,
  };

  try {
    const response = await Api.post<AuthUser>("/Auth/Login", loginData);

    localStorage.setItem('loginData', JSON.stringify(response.data));
    await fetchLocationData(email, true);
    return response.data;

  } catch (error: any) {

    const errorMessage = error.response.data?.responseInfo?.errorDescription || "Erro desconhecido";
    await fetchLocationData(email, false);
    throw new Error(errorMessage);

  }
};




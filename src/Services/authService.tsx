import Api from "@/Api";
import {fetchLocationData} from './LoginLocationDataService'

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

  const response = await Api.post<AuthUser>("/Auth/Login", loginData);

  if (response.data?.responseInfo?.httpStatus! >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }

  localStorage.setItem('loginData', JSON.stringify(response.data));
  await fetchLocationData(email);
 
  return response.data;
};



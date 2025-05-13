import Api from "@/Api";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  tokenJwt: string;
  username: string;
  photo: string;
  responseInfo: responseInfo | null
}

export interface responseInfo{
  title: string;
  errorDescription: string;
  httpStatus: number
}

interface LoginUserCommand {
  email: string;
  password: string;
}

export const fetchAuthUser = async (email: string, password: string) => {

  const loginData: LoginUserCommand = {
    email,
    password,
  };
console.log(loginData)

  const response = await Api.post<AuthUser>("/Auth/Login", loginData);

  console.log(response)
  if (response.data?.responseInfo?.httpStatus! >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }

  console.log(response.data)
  const token = response.data.tokenJwt;
  localStorage.setItem('token', token);
  localStorage.setItem('email', response.data.email);
  localStorage.setItem('username', response.data.username);

  localStorage.setItem('loginData', JSON.stringify(response.data));

  return response.data;
};

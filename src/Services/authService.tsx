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

export interface responseInfo {
  title: string;
  errorDescription: string;
  httpStatus: number
}

interface LoginUserCommand {
  email: string;
  password: string;
  latitude: string;
  longitude: string;
}

export const fetchAuthUser = async (email: string, password: string) => {
  const { latitude, longitude } = await getGeolocation();

  const loginData: LoginUserCommand = {
    email,
    password,
    latitude,
    longitude,
  };

  const response = await Api.post<AuthUser>("/Auth/Login", loginData);

  if (response.data?.responseInfo?.httpStatus! >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }

  localStorage.setItem('loginData', JSON.stringify(response.data));



  return response.data;
};

const getGeolocation = (): Promise<{ latitude: string; longitude: string }> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude.toString(),
          longitude: position.coords.longitude.toString()
        });
      },
      (error) => {
        reject("Erro ao obter localização: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

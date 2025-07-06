import Api from "@/Api";
import { LocationData } from "@/common/Interfaces/LocationData.d";

export const fetchLocationData = async (emailLogin: string, success: boolean) => {
    const { latitude, longitude } = await getGeolocation();
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|iphone|ipad|ipod|windows phone/i.test(userAgent);
    const platform = isMobile ? 'Mobile' : 'Desktop';
    const browser = getBrowserName(userAgent);  
    const os = getOperatingSystemAndVersion();

    const locationData = {
        IsSuccess: success,
        email: emailLogin,
        latitude,
        longitude,        
        platform,
        browser,
        os
    };

    await Api.post('/api/LocationData', locationData);
};

export function getLocation() {
    return Api.get<LocationData[]>('/api/LocationData');
}

const getOperatingSystemAndVersion = () => {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.indexOf("win") !== -1) {
    const windowsVersion = userAgent.match(/windows nt (\d+\.\d+)/);
    if (windowsVersion) {
      const version = windowsVersion[1];

      switch (version) {
        case "10.0":
          return "Windows 10";
        case "6.3":
          return "Windows 8.1";
        case "6.2":
          return "Windows 8";
        case "6.1":
          return "Windows 7";
        case "6.0":
          return "Windows Vista";
        case "5.1":
          return "Windows XP";
        default:
          return `Windows NT ${version}`;
      }
    }
    return "Windows (versão desconhecida)";
  } else if (userAgent.indexOf("mac") !== -1) {
    return "MacOS";
  } else if (userAgent.indexOf("linux") !== -1) {
    return "Linux";
  } else if (userAgent.indexOf("android") !== -1) {
    return "Android";
  } else if (userAgent.indexOf("iphone") !== -1 || userAgent.indexOf("ipad") !== -1) {
    return "iOS";
  } else {
    return "Unknown";
  }
};
const getBrowserName = (userAgent: any) => {
    if (userAgent.indexOf("chrome") > -1) {
        return "Chrome";
    } else if (userAgent.indexOf("firefox") > -1) {
        return "Firefox";
    } else if (userAgent.indexOf("safari") > -1) {
        return "Safari";
    } else if (userAgent.indexOf("msie") > -1 || userAgent.indexOf("trident") > -1) {
        return "Internet Explorer";
    } else {
        return "Unknown Browser";
    }
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
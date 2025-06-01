import Api from '../Api/index';

export const GetRevenues = async (search: string, page: number) => {
  const response = await Api.get(`/api/Revenues?PageNumber=${page}&PageSize=10&Description=${encodeURIComponent(search)}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export function CreateRevenues(revenues: any) {

   return Api.post('/api/Revenues',revenues);
}



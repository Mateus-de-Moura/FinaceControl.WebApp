import Api from '../Api/index';

export const GetRevenues = async (search: string, page: number, startDate?: Date | null, endDate?: Date | null) => {
  const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

  if (search) params.append("Description", search);

  if (startDate)
    params.append("StartDate", startDate.toISOString().split("T")[0]);

  if (endDate)
    params.append("EndDate", endDate.toISOString().split("T")[0]);

  const response = await Api.get(`/api/Revenues?${params.toString()}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export function CreateRevenues(revenues: any) {
  return Api.post('/api/Revenues', revenues);
}
export function UpdateRevenues(revenues: any) {
  return Api.put('/api/Revenues', revenues);
}

export function GetById(id: string) {
  return Api.get(`/api/Revenues/update/${id}`)
}



import Api from '../Api/index';

export const GetAllCategories = async () => {
  const response = await Api.get('/api/Category/GetAllCategory');
  return response.data;
};

export const GetCategories = async (search: string, page: number) => {
  const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

  if (search) params.append("Description", search);

  const response = await Api.get(`/api/Category?${params.toString()}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const CreateCategory = async (category: any) => {
  return await Api.post('api/Category', category);
}

export async function UpdateCategory(id: string) {
  const response = await Api.get(`/api/Category/Update/${id}`);
  return response.data;
}

export async function Update(data: any) {
  return await Api.put(`/api/Category`, data);
}
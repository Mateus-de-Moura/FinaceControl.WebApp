import Api from '../Api/index';

export const GetCategories = async () =>{
  const response = await Api.get('/api/Category/GetAllCategory')
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
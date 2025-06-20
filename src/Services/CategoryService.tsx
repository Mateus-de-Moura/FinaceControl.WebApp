import Api from '../Api/index';

export const GetCategories = async () =>{
  const response = await Api.get('/api/Category/GetAllCategory')
  return response.data;
}

export function CreateCategory(category: any) {
  return Api.post('/api/Category', category);
}
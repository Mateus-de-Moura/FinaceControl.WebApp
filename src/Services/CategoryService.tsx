import Api from '../Api/index';

export const GetCategories = async () =>{
  const response = await Api.get('/api/Category/GetAllCategory')
  return response.data;
}

export const GetPagedCategory = async(search: string, type: string, page: number) => {

 const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

if (search) params.append("Name", search);
if (type) params.append("Type", type)

   const response = await Api.get(`/api/Category?${params.toString()}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;

}

export function CreateCategory(category: any) {
  return Api.post('/api/Category', category);
}

export function UpdateCategory(category: any) {
  return Api.put('/api/Category', category);
}

export function GetByIdCategory(id: string){
  return Api.get(`/api/Category/update/${id}`)
}
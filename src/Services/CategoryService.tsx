import Api from '../Api/index';

export const GetCategories = async () =>{
  return Api.get('/api/Category/GetAllCategory')
}
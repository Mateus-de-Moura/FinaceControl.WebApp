import Api from '../Api/index';

export const GetUsers = async (search: string, page: number) => {
  const response = await Api.get(`/api/User?PageNumber=${page}&PageSize=10&Description=${encodeURIComponent(search)}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export function Create(users: any) {
  console.log(users)
  return Api.post('/api/User', users)
}

export function GetAllRoles() {
  return Api.get('/api/User/Roles');
}

export function updatePhoto(photo: File, email: string) {
  const formData = new FormData();
  formData.append('Photo', photo);
  formData.append('EmailUser', email); 

  return Api.put('/api/User/update-photo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

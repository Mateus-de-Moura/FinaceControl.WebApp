import Api from '../Api/index';

export const GetUsers = async (search: string, page: number) => {
  const response = await Api.get(`/api/User?PageNumber=${page}&PageSize=10&Description=${encodeURIComponent(search)}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export function Create(user: any) {

  const formData = new FormData();

  formData.append('Active', String(user.Active));
  formData.append('Name', user.Name || '');
  formData.append('Surname', user.Surname || '');
  formData.append('Username', user.userName || '');
  formData.append('Email', user.Email || '');
  formData.append('Password', user.PassWord || '');
  formData.append('Username', user.Username || '');
  formData.append('RoleId', user.RoleId);

  if (user.Photo) {
    formData.append('Photo', user.Photo);
  }

  return Api.post('/api/User', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function UpdateUser(user: any) {
  
  const formData = new FormData();

  formData.append('Id', user.Id);
  formData.append('Active', String(user.Active));
  formData.append('Name', user.Name || '');
  formData.append('Surname', user.Surname || '');
  formData.append('Username', user.userName || '');
  formData.append('Email', user.Email || '');
  formData.append('Password', user.PassWord || '');
  formData.append('Username', user.Username || '');
  formData.append('RoleId', user.RoleId);

  if (user.Photo) {
    formData.append('Photo', user.Photo);
  }

  return Api.put('/api/User/update', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

export function GetAllRoles() {
  return Api.get('/api/User/Roles');
}

export function GetUserById(Id: string) {
  return Api.get(`/api/User/update/${Id}`);
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

export function RecoveryPasswordService(password: string, NewPassword: string) {
  return Api.put(`/api/User/RecoveryPassword?passWord=${password}&newPassword=${NewPassword}`);
}

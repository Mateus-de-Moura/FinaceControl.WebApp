import Api from '../Api/index';

export const GetExpense = async (search: string, 
  page: number,
  status: string) => {

    const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

  if (search) params.append("Description", search);
  if (status) params.append("Status", status);

   const response = await Api.get(`/api/Expense/paged?${params.toString()}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export function CreateExpense(expense: any) {
  return Api.post('/api/Expense', expense);
}
export function UpdateExpense(expense: any) {
  return Api.put('/api/Expense', expense);
}

export function GetById(id: string) {
  return Api.get(`/api/Expense/update/${id}`)
}
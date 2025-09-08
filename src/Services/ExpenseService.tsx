import Api from '../Api/index';

export const GetExpense = async (search: string,
  page: number,
  status: string,
  startDate?: Date | null,
  endDate?: Date | null) => {

  const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

  if (search) params.append("Description", search);
  if (status) params.append("Status", status);
  if (startDate)
    params.append("StartDate", startDate.toISOString().split("T")[0]);

  if (endDate)
    params.append("EndDate", endDate.toISOString().split("T")[0]);

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
  console.log(expense);
  return Api.put('/api/Expense', expense);
}

export function GetById(id: string) {
  return Api.get(`/api/Expense/update/${id}`)
}
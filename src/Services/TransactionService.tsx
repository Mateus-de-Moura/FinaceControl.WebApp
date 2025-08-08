import Api from '../Api/index';

export const GetTransactions = async (search: string, page: number, startDate?: Date | null, endDate?: Date | null) => {
  const params = new URLSearchParams();
  params.append("PageNumber", String(page));
  params.append("PageSize", "10");

  if (search) params.append("Description", search);

  if (startDate)
    params.append("StartDate", startDate.toISOString().split("T")[0]);

  if (endDate)
    params.append("EndDate", endDate.toISOString().split("T")[0]);

  const response = await Api.get(`/api/Transactions?${params.toString()}`);

  if (response.data?.responseInfo?.httpStatus >= 400) {
    const errorMessage = response.data.responseInfo?.errorDescription || "Erro desconhecido";
    throw new Error(errorMessage);
  }
  return response.data;
}

export const UpdateTransactions = async (transaction: any) => {
  return await Api.put('api/Transactions', transaction);
}

export const CreateTransaction = async (transaction: any) => {
  return await Api.post('api/Transactions', transaction);
}

export async function GetTransactionById(id: string) {
  const response = await Api.get(`api/transactions/update/${id}`);
  return response.data;
}

export async function GetRecentTransactions(){
  const response = await Api.get(`api/transactions/RecentTransactions`);
  return response.data;
}

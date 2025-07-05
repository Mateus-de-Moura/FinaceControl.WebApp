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
  const formData = new FormData();

  formData.append('Description', expense.Description || '');
  formData.append('Active', String(expense.Active) || '');
  formData.append('Recurrent', String(expense.Recurrent) || '');
  formData.append('CategoryId', expense.CategoryId || '');
  formData.append('DueDate', expense.DueDate || '');
  formData.append('Value', expense.Value || '');
  formData.append('Status', String(expense.Status) || '');
  if (expense.ProofFile) {
    formData.append('ProofFile', expense.ProofFile); 
  }

  return Api.post('/api/Expense', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function UpdateExpense(expense: any) {
 const formData = new FormData();

  formData.append('Description', expense.Description || '');
  formData.append('Active', String(expense.Active) || '');
  formData.append('Recurrent', String(expense.Recurrent) || '');
  formData.append('CategoryId', expense.CategoryId || '');
  formData.append('DueDate', expense.DueDate || '');
  formData.append('Value', expense.Value || '');
  formData.append('Status', String(expense.Status) || '');
  if (expense.ProofFile) {
    formData.append('ProofFile', expense.ProofFile); 
  }

  return Api.put('/api/Expense', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export function GetById(id: string) {
  return Api.get(`/api/Expense/update/${id}`)
}
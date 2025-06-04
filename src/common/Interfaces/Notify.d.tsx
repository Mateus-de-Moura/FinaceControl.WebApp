export type PriorityLevel = "low" | "medium" | "high";

export interface Expense {
    id: string;
    description: string;
    dueDate: string;
    value: number;
    categoryId: string | null;
    userId: string;
    active: boolean;
    isDeleted: boolean;
    proofPath: string | null;
    status: number;
    user: any | null; 
}
export interface Notifications {
    id: string;
    message: string;
    priority: PriorityLevel;
    wasRead: boolean;
    readDate: string | null; 
    active: boolean;
    userId: string;   
    expensesId: string;
    expenses: Expense | null;
}

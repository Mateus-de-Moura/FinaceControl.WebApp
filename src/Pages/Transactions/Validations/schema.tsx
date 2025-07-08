import { z } from 'zod';

export const validationSchema = z.object({
    Active: z.boolean({
        required_error: "Active is required",
        invalid_type_error: "Ativo must be a boolean",
    }),
    TransactionDate: z.string({
        required_error: "Date is required",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
    }),
    Type: z.string({
        required_error: "Type is required",
        invalid_type_error: "CategoryId must be a string",
    }),
    CategoryId: z.string({
        required_error: "CategoryId is required",
        invalid_type_error: "CategoryId must be a string",
    }),
    Description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }),
    Value: z.string({
        required_error: "Valor é obrigatório"
    }),
    PaymentMethod: z.string({
        required_error: "PaymentMethod is required",
        invalid_type_error: "PaymentMethod must be a string",
    }),
    Status: z.string({
        required_error: "Status is required",
        invalid_type_error: "Status must be a string",
    }),
    Observation: z.string({
        required_error: "Observations is required",
        invalid_type_error: "Observations must be a string",
    }),
    
});

export type ValidationSchema = z.infer<typeof validationSchema>;


import { z } from 'zod';

export const validationSchema = z.object({
    Active: z.boolean({
        required_error: "Active is required",
        invalid_type_error: "Ativo must be a boolean",
    }),
    Recurrent: z.boolean({
        required_error: "Recurrent is required",
        invalid_type_error: "Recurrent must be a boolean",
    }),
    Description: z.string({
        required_error: "Description is required",
        invalid_type_error: "Description must be a string",
    }),
    Value: z
        .string({
            required_error: "Valor é obrigatório"
        }),
      
    DueDate: z.string({
        required_error: "Date is required",
    }).refine((val) => !isNaN(Date.parse(val)), {
        message: "Data inválida",
    }),
    CategoryId: z.string({
        required_error: "CategoryId is required",
        invalid_type_error: "CategoryId must be a string",
    }),
    Status: z.number({
        required_error: "Status is required",
        invalid_type_error: "Status must be a number",
    })
});

export type ValidationSchema = z.infer<typeof validationSchema>;
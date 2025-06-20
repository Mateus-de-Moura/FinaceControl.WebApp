import { z } from 'zod';

export const validationSchema = z.object({
    Active: z.boolean({
        required_error: "Active is required",
        invalid_type_error: "Ativo must be a boolean",
    }),
    Name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Name must be a stringf",
    }),
    Type: z.string({
        required_error: "Type is required",
        invalid_type_error: "Type must be a string",
    })
});

export type ValidationSchema = z.infer<typeof validationSchema>;
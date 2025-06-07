import { z } from 'zod';

export const validationSchema = z.object({
    
    Email: z.string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a string",
    }),
    Password: z.string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
    }),      
});

export type ValidationSchema = z.infer<typeof validationSchema>;

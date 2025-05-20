import { z } from 'zod';

export const validationSchemaUpdate = z.object({
    Id: z.string({
        required_error: "Id is required",
        invalid_type_error: "Id must be a string",
    }),
    Active: z.boolean({
        required_error: "Active is required",
        invalid_type_error: "Ativo must be a boolean",
    }),
    Name: z.string({
        required_error: "Nome is required",
        invalid_type_error: "Nome must be a string",
    }),
    Surname: z.string({
        required_error: "Surname is required",
        invalid_type_error: "Surname must be a string",
    }),   
    userName: z.string({
        required_error: "userName is required",
        invalid_type_error: "userName must be a string",
    }),    
    Email: z.string({
        required_error: "E-mail is required",
        invalid_type_error: "E-mail must be a string",
    }),    
    RoleId: z.string({
        required_error: "Role is required",
        invalid_type_error: "Empresa must be a string",
    }), 
   
   
});

export type ValidationSchemaUpdate = z.infer<typeof validationSchemaUpdate>;

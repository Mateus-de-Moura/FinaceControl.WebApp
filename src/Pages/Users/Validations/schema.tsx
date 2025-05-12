import { z } from 'zod';

export const validationSchema = z.object({
    
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
    PassWord: z.string({
        required_error: "PassWord is required",
        invalid_type_error: "PassWord must be a string",
    }),   
    ConfirmPassWord: z.string({
        required_error: "PassWord is required",
        invalid_type_error: "PassWord must be a string",
    }),    
   
}).superRefine((data, ctx) => {
    if (data.PassWord !== data.ConfirmPassWord) {
      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
        path: ["PassWord"],
      });

      ctx.addIssue({
        code: "custom",
        message: "As senhas não coincidem",
        path: ["ConfirmPassWord"],
      });
    }
  });

export type ValidationSchema = z.infer<typeof validationSchema>;

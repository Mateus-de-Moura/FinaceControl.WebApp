import { z } from 'zod';

export const validationSchema = z.object({
    Password: z.string()
        .min(1, { message: "Campo obrigatório." })
        .refine(val => val != null, { message: "Password cannot be null" }),
    NewPassword: z.string()
        .min(1, { message: "Campo obrigatório" })
        .refine(val => val != null, { message: "NewPassword cannot be null" }),
    ConfirmPassword: z.string()
        .min(1, { message: "Campo obrigatório" })
        .refine(val => val != null, { message: "ConfirmPassword cannot be null" }),
}).superRefine((data, ctx) => {
    if (data.NewPassword !== data.ConfirmPassword) {
        ctx.addIssue({
            code: "custom",
            message: "As senhas não coincidem",
            path: ["NewPassword"],
        });

        ctx.addIssue({
            code: "custom",
            message: "As senhas não coincidem",
            path: ["ConfirmPassword"],
        });
    }
});

export type ValidationSchema = z.infer<typeof validationSchema>;

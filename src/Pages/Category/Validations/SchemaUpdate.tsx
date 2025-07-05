import { z } from 'zod';

export const validationSchemaCategoryUpdate = z.object({
    Id: z.string({
       required_error: "Id é obrigatório",
       invalid_type_error: "Id inválido",
  }),
    Active: z.boolean({
        required_error: "Active is required",
        invalid_type_error: "Ativo must be a boolean",
    }),
    Recurrent: z.boolean({
        required_error: "Recurrent is required",
        invalid_type_error: "Recurrent must be a boolean",
    }),
    Name: z.string({
        required_error: "Name is required",
        invalid_type_error: "Nome é obrigatório",
    }),
    Type: z.string({
        required_error: "Type is required",
        invalid_type_error: "Tipo deve ser selecionado",
    })
});

export type ValidationSchemaCategory = z.infer<typeof validationSchemaCategoryUpdate>;
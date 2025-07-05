import { CreateCategory } from "@/Services/CategoryService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { validationSchema, ValidationSchema } from "./Validations/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function Create() { 
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const mutation = useMutation({
        mutationFn: CreateCategory,
        onSuccess: () => {
            toast('Dados salvos com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });

            queryClient.invalidateQueries({ queryKey: ['category'] })

            navigate('/Categorias');
        },
        onError: () => {
            toast('Ocorreu um erro interno!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    })

    const { register, handleSubmit, formState: { errors } } = useForm<ValidationSchema>({
            resolver: zodResolver(validationSchema),
            defaultValues: {
                Active: true,
                Recurrent: false,
            }
        });
    
        const onSubmit = async (data: any) => {    
            mutation.mutate({
                ...data,
                Type: Number(data.Type),
            });
        };
    
        const onError = (errors: any) => {
            console.log("form errors", errors);
        };

return (


        <div className='p-5' >
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de Categorias</h6>
                <Link to="/Categorias" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
            </div>
            <Card className='p-5'>
                <CardContent >

                    <form className="flex h-full flex-col gap-5 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <div className="flex gap-4">
                            <div className="w-[50%]">
                                <div className='card '>
                                    <div className="w-[5%] flex items-center gap-2">
                                        <input {...register('Active')} type='checkbox' />
                                        <p>{errors.Active?.message}</p>
                                        <label className='font-semibold'>Ativo</label>
                                    </div>
                                </div>

                                <div className='card '>
                                    <div className="w-[35%] flex items-center gap-2">
                                        <input {...register('Recurrent')} type='checkbox' />
                                        <p>{errors.Active?.message}</p>
                                        <label className='font-semibold'>Categoria Recorrente ? </label>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="flex gap-10">
                                <div className="w-[50%]">
                                    <label className='font-semibold'>Descrição *</label>
                                    <Input {...register('Name')} type='text' />
                                    <p className='text-red-500'>{errors.Name?.message}</p>
                                </div>

                                <div className='w-[50%] flex flex-col items-left gap-2 mt-[-5px]'>
                                        <label className='font-semibold'>Tipo *</label>
                                   
                                   <div className="flex items-right gap-6">
                                        <label className="flex items-center gap-1 cursor-pointer">
                                            <Input 
                                            type="radio"
                                            value="1"
                                            {...register('Type')}
                                            />
                                            Despesa
                                        </label>

                                        <label className="flex items-center gap-1 cursor-pointer">
                                            <input
                                            type="radio"
                                            value="2"
                                            {...register("Type")}
                                            />
                                            Receita
                                        </label>
                                    </div>
                                    <p className='text-red-500'>{errors.Type?.message}</p>  
                                </div>
                        </div>

                        <div className="w-[100%] mt-3 flex justify-between">
                            <Button type="submit" variant="secondary">Salvar</Button>
                        </div>


                    </form>

                 </CardContent>
            </Card>
        </div>

    )
}

export default Create
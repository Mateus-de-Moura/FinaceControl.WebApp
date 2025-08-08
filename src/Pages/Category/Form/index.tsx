import { CreateCategory, UpdateCategory, Update } from "@/Services/CategoryService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { validationSchema, ValidationSchema } from "../Validations/Schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type Props = {
    Id?: string;
};

function index({ Id }: Props) {

    const { data: categoryData } = useQuery({
        queryKey: ['category', Id],
        queryFn: () => UpdateCategory(Id!),
        enabled: !!Id,
    });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const createMutation = useMutation({
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

    const updateMutation = useMutation({
        mutationFn: Update,
        onSuccess: () => {
            toast('Atualizado com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['category'] });
            navigate('/Categorias');
        },
        onError: () => {
            toast('Erro ao atualizar!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    });

    const { register, handleSubmit,setValue, formState: { errors } } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            Active: true,
        }
    });

    const onSubmit = async (data: any) => {
        if (Id) {
            const payload = {
                ...data,
                id: Id,
            };
            updateMutation.mutate(payload);
        } else {
            console.log(data);
            createMutation.mutate(data);
        }
    };

    const onError = (errors: any) => {
        console.log("form errors", errors);
    };

    useEffect(() => {
        if (categoryData ) {    
            console.log(categoryData)       
            setValue("Active", categoryData.active);
            setValue("Name", categoryData.name);
            setValue("Type", String(categoryData.type));
        }
    }, [categoryData, setValue]);


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
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-[50%]">
                                <label className='font-semibold'>Descrição *</label>
                                <Input {...register('Name')} type='text' />
                                <p className='text-red-500'>{errors.Name?.message}</p>
                            </div>

                            <div className='w-[50%]'>
                                <label className='font-semibold'>Tipo *</label>
                                   <Select value={categoryData ? String(categoryData.type) : "3"} {...register('Type')} onValueChange={(value) => setValue('Type', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="0" value="3" disabled   >Selecione</SelectItem >
                                        <SelectItem key="1" value="0">Despesa</SelectItem >
                                        <SelectItem key="2" value="1">Receita</SelectItem >
                                    </SelectContent>
                                </Select>                             
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

export default index
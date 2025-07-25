import { Link } from 'react-router';
import { buttonVariants } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { GetCategories } from '@/Services/CategoryService';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import 'jquery-mask-plugin';
import { ValidationSchema, validationSchema } from './Validations/Schema';
import { CreateExpense } from '@/Services/ExpenseService';

interface Category {
    id: string;
    name: string
}

function Create() {
    const rolesQuery = useQuery({ queryKey: ['category'], queryFn: GetCategories });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const mutation = useMutation({
        mutationFn: CreateExpense,
        onSuccess: () => {
            toast('Dados salvos com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });

            queryClient.invalidateQueries({ queryKey: ['category'] })

            navigate('/Despesas');
        },
        onError: () => {
            toast('Ocorreu um erro interno!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    })

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            Active: true,
            Recurrent: false,
        }
    });

    const onSubmit = async (data: any) => {
        const { ...rest } = data;


        mutation.mutate({
            ...rest,
        });
    };

    const onError = (errors: any) => {
        console.log("form errors", errors);
    };

    return (


        <div className='p-5' >
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de despesas</h6>
                <Link to="/Despesas" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
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
                                        <label className='font-semibold'>Despesa Recorrente ? </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-[50%]">
                                <label className='font-semibold'>Descrição *</label>
                                <Input {...register('Description')} type='text' />
                                <p className='text-red-500'>{errors.Description?.message}</p>
                            </div>

                            <div className='w-[50%]'>
                                <label className='font-semibold'>Categoria *</label>
                                <Select defaultValue="0" {...register('CategoryId')} onValueChange={(value) => setValue('CategoryId', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="0" value="0" disabled   >Selecione</SelectItem >
                                        {rolesQuery &&
                                            rolesQuery.data?.map((role: Category) => {
                                                return (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                )
                                            })
                                        }

                                    </SelectContent>
                                </Select>
                                {errors.CategoryId && <p className='text-red-500'>{errors.CategoryId.message}</p>}
                            </div>
                        </div>

                        <div className='flex gap-4'>

                            <div className="w-[24%]">
                                <label className='font-semibold'>Data de Vencimento *</label>
                                <Input {...register('DueDate')} type='Date' placeholder='Nickname do usuário' />
                                <p className='text-red-500'>{errors.DueDate?.message}</p>
                            </div>

                            <div className="w-[24%] gap-1">
                                <label className='mb-1 font-semibold'>Valor *</label>
                                <Input
                                    {...register('Value', { required: 'Valor é obrigatório' })}
                                    type="text"
                                    className="money-mask"
                                />
                                <p className='text-red-500'>{errors.Value?.message}</p>
                            </div>

                            <div className="w-48">
                                <label className="font-semibold">Status </label>
                                <Select                                   
                                    onValueChange={(value) => setValue("Status", parseInt(value))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Selecione um status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="0" value="0">
                                            Pendente
                                        </SelectItem>
                                        <SelectItem key="1" value="1">
                                            Pago
                                        </SelectItem>
                                        <SelectItem key="2" value="2">
                                            Vencido
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
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
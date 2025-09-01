import { Link } from 'react-router';
import { buttonVariants } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { ValidationSchemaUpdate, validationSchemaUpdate } from './Validations/schemaUpdate'
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
import { GetById } from '@/Services/RevenuesService';
import { GetAllCategories } from '@/Services/CategoryService';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import 'jquery-mask-plugin';
import { useParams } from "react-router-dom";
import { useEffect } from 'react';
import { UpdateRevenues } from '@/Services/RevenuesService';
import { NumericFormat } from 'react-number-format';

interface Category {
    id: string;
    name: string
}

function Update() {
    const { id } = useParams<{ id: string }>();

    const rolesQuery = useQuery({ queryKey: ['category'], queryFn: GetAllCategories });
    const response = useQuery({ queryKey: ['revenues'], queryFn: () => GetById(id as string) });
    const revenue = response.data?.data;

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const mutation = useMutation({
        mutationFn: UpdateRevenues,
        onSuccess: () => {
            toast('Dados salvos com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });

            queryClient.invalidateQueries({ queryKey: ['category'] })
            queryClient.invalidateQueries({ queryKey: ['revenues'] })

            navigate('/Receitas');
        },
        onError: () => {
            toast('Ocorreu um erro interno!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    })

    const { register, watch, handleSubmit, setValue, getValues, formState: { errors } } = useForm<ValidationSchemaUpdate>({
        resolver: zodResolver(validationSchemaUpdate),
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

    useEffect(() => {
        if (revenue && rolesQuery.isSuccess && !rolesQuery.isFetching) {
            setValue('Id', revenue.id);
            setValue('Active', revenue.active);
            setValue('Recurrent', revenue.isRecurrent);
            setValue('Description', revenue.description);
            setValue('CategoryId', revenue.categoryId);

            const date = new Date(revenue.date);
            const formattedDate = date.toISOString().split('T')[0];
            setValue('Date', formattedDate);

            setValue('Value', revenue.value);
        }
    }, [revenue, rolesQuery.isSuccess, rolesQuery.isFetching, setValue]);


    return (


        <div className='p-5' >
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de Receitas</h6>
                <Link to="/Receitas" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
            </div>
            <Card className='p-5'>
                <CardContent >
                    <form className="flex h-full flex-col gap-5 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <div className="flex gap-4">
                            <div className="w-[50%]">
                                <div className='card '>
                                    <div className="w-[5%] flex items-center gap-2">
                                        <input {...register('Active')} type='checkbox' checked={watch('Active')} />
                                        <p>{errors.Active?.message}</p>
                                        <label className='font-semibold'>Ativo</label>
                                    </div>
                                </div>

                                <div className='card '>
                                    <div className="w-[35%] flex items-center gap-2">
                                        <input {...register('Recurrent')} type='checkbox' checked={watch('Recurrent')} />
                                        <p>{errors.Active?.message}</p>
                                        <label className='font-semibold'>Receita Recorrente ? </label>
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
                                <Select value={watch('CategoryId')} {...register('CategoryId')} onValueChange={(value) => setValue('CategoryId', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione" />
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
                                <label className='font-semibold'>Vencimento *</label>
                                <Input {...register('Date')} type='Date' placeholder='Nickname do usuário' />
                                <p className='text-red-500'>{errors.Date?.message}</p>
                            </div>

                            <div className="w-[24%] gap-1">
                                <label className='mb-1 font-semibold'>Valor *</label>
                                <NumericFormat
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    decimalScale={2}
                                    fixedDecimalScale
                                    customInput={Input}
                                    value={getValues('Value')}
                                    allowNegative={false}
                                    onValueChange={(values) => {
                                        setValue('Value', String(values.value));
                                    }}
                                />
                                <p className='text-red-500'>{errors.Value?.message}</p>
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

export default Update
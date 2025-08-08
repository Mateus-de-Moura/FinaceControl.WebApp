import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { buttonVariants } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ValidationSchema, validationSchema } from "../Validations/schema";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllCategories } from "@/Services/CategoryService";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { CreateTransaction, UpdateTransactions, GetTransactionById } from "@/Services/TransactionService";
import { NumericFormat } from 'react-number-format';

type Props = {
    Id?: string;
};
interface Category {
    id: string;
    name: string
}

function index({ Id }: Props) {
    let title = Id ? "Edição de Receita" : "Cadastro de Receita";

    const { data: transactionData } = useQuery({
        queryKey: ['transaction', Id],
        queryFn: () => GetTransactionById(Id!),
        enabled: !!Id,        
    });
  
    const rolesQuery = useQuery({ queryKey: ['category'], queryFn: GetAllCategories });

    const { register,watch, handleSubmit, setValue, getValues, formState: { errors } } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
    });

    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const createMutation = useMutation({
        mutationFn: CreateTransaction,
        onSuccess: () => {
            toast('Criado com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['category'] });
            navigate('/transacoes');
        },
        onError: () => {
            toast('Erro ao criar!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    });

    const updateMutation = useMutation({
        mutationFn: UpdateTransactions,
        onSuccess: () => {
            toast('Atualizado com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });
            queryClient.invalidateQueries({ queryKey: ['category'] });
            navigate('/transacoes');
        },
        onError: () => {
            toast('Erro ao atualizar!', {
                toastId: errorToastId,
                type: 'error',
            });
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
            createMutation.mutate(data);
        }
    };

    useEffect(() => {
        if (transactionData && rolesQuery.isSuccess && !rolesQuery.isFetching) {    
           
            const date = new Date(transactionData.transactionDate);
            const formattedDate = date.toISOString().split('T')[0];

            setValue("TransactionDate", formattedDate);
            setValue("Type", String(transactionData.type));
            setValue("CategoryId", transactionData.categoryId);
            setValue("Description", transactionData.description);
            setValue("Value", transactionData.value);
            setValue("PaymentMethod", String(transactionData.paymentMethod));
            setValue("Status", String(transactionData.status));
            setValue("Observation", transactionData.observation);
            setValue("Active", transactionData.active);
        }
    }, [transactionData,rolesQuery.isSuccess, rolesQuery.isFetching, setValue]);


    return (
        <div className='p-5' >
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">{title}</h6>
                <Link to="/transacoes" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
            </div>
            <Card className='p-5'>
                <CardContent >
                    <form className="flex h-full flex-col gap-5 " onSubmit={handleSubmit(onSubmit)}>

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
                            <div className="w-[30%]">
                                <label className='font-semibold'>Data da transação *</label>
                                <Input {...register('TransactionDate')} type='Date' placeholder='Nickname do usuário' />
                                <p className='text-red-500'>{errors.TransactionDate?.message}</p>
                            </div>

                            <div className='w-[30%]'>
                                <label className='font-semibold'>Tipo *</label>
                                <Select defaultValue={transactionData ? String(transactionData.type) : "3"} {...register('Type')} onValueChange={(value) => setValue('Type', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="0" value="3" disabled   >Selecione</SelectItem >
                                        <SelectItem key="1" value="0">Receitas</SelectItem >
                                        <SelectItem key="2" value="1">Despesas</SelectItem >
                                    </SelectContent>
                                </Select>
                                {errors.Type && <p className='text-red-500'>{errors.Type.message}</p>}
                            </div>
                            <div className='w-[30%]'>
                                <label className='font-semibold'>Categoria *</label>
                                <Select defaultValue="0" value={watch('CategoryId')} {...register('CategoryId')} onValueChange={(value) => setValue('CategoryId', value)} >
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
                            <div className="w-[30%] gap-1">
                                <label className='mb-1 font-semibold'>Descrição *</label>
                                <Input
                                    {...register('Description')}
                                    type="text"
                                    className="money-mask"
                                />
                                <p className='text-red-500'>{errors.Description?.message}</p>
                            </div>

                            <div className="w-[30%] gap-1">
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
                            <div className='w-[30%]'>
                                <label className='font-semibold'>Tipo de pagamento *</label>
                                <Select value={transactionData ? String(transactionData.paymentMethod) : "3"} {...register('PaymentMethod')} onValueChange={(value) => setValue('PaymentMethod', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="3" value="3" disabled >Selecione</SelectItem >
                                        <SelectItem key="0" value="0">Dinheiro</SelectItem >
                                        <SelectItem key="1" value="1">Cartao</SelectItem >
                                        <SelectItem key="2" value="2">Pix</SelectItem >

                                    </SelectContent>
                                </Select>
                                {errors.PaymentMethod && <p className='text-red-500'>{errors.PaymentMethod.message}</p>}
                            </div>
                        </div>
                        <div className='flex gap-4'>

                            <div className='w-[30%]'>
                                <label className='font-semibold'>Status  *</label>
                                <Select defaultValue={transactionData ? String(transactionData.status) : "3"} {...register('Status')} onValueChange={(value) => setValue('Status', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="3" value="3" disabled >Selecione</SelectItem >
                                        <SelectItem key="0" value="0">Pendente</SelectItem >
                                        <SelectItem key="1" value="1">Confirmado</SelectItem >
                                        <SelectItem key="2" value="2">Cancelado</SelectItem >
                                    </SelectContent>
                                </Select>
                                {errors.Status && <p className='text-red-500'>{errors.Status.message}</p>}
                            </div>

                            <div className="w-[61%] gap-1">
                                <label className='mb-1 font-semibold'>Obeservação *</label>
                                <Input
                                    {...register('Observation')}
                                    type="text"
                                />
                                <p className='text-red-500'>{errors.Observation?.message}</p>
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
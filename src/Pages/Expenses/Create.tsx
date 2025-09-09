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
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { GetAllCategories } from '@/Services/CategoryService';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';
import 'jquery-mask-plugin';
import { ValidationSchema, validationSchema } from './Validations/Schema';
import { CreateExpense } from '@/Services/ExpenseService';
import { Upload, FileText } from "lucide-react";

interface Category {
    id: string;
    name: string
}

function Create() {
    const rolesQuery = useQuery({ queryKey: ['category'], queryFn: GetAllCategories });

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);
    const [preview, setPreview] = useState<File | null>(null);

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

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            Active: true,
            Recurrent: false,
        }
    });

    const statusValue = watch("Status");

    const onSubmit = async (data: any) => {
        const formData = new FormData();

        formData.append("Description", data.Description);
        formData.append("Recurrent", String(data.Recurrent));
        formData.append("Active", String(data.Active));
        formData.append("IdExpense", data.IdExpense);
        formData.append("Value", data.Value);
        formData.append("DueDate", data.DueDate);
        formData.append("Status", String(data.Status));
        formData.append("CategoryId", data.CategoryId);

        if (data.ProofFile) {
            formData.append("ProofFile", data.ProofFile);
        }

        mutation.mutate(formData);
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
                        {statusValue === 1 && (
                            <div className="flex flex-col gap-2 mt-3">
                                <label className="font-semibold">Comprovante de Pagamento</label>

                                <div className="flex items-center gap-3">
                                    {/* Mostrar botão de upload só se não tiver preview */}
                                    {!preview && (
                                        <>
                                            <label
                                                htmlFor="proof-upload"
                                                className="flex items-center justify-center w-12 h-12 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                                            >
                                                <Upload className="w-6 h-6 text-gray-500" />
                                            </label>
                                            <input
                                                id="proof-upload"
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setPreview(file);
                                                        setValue("ProofFile", file, { shouldValidate: true }); // <-- agora é ProofFile
                                                    }
                                                }}
                                            />

                                        </>
                                    )}

                                    {/* Preview */}
                                    {preview && (
                                        <div className="flex items-center gap-2 border rounded-lg p-2">
                                            {preview.type.includes("pdf") ? (
                                                <FileText className="w-8 h-8 text-red-500" />
                                            ) : (
                                                <img
                                                    src={URL.createObjectURL(preview)}
                                                    alt="preview"
                                                    className="w-12 h-12 object-cover rounded-lg border"
                                                />
                                            )}
                                            <span className="text-sm text-gray-600 truncate max-w-[150px]">
                                                {preview.name}
                                            </span>

                                            {/* Botão para remover */}
                                            <button
                                                type="button"
                                                className="ml-2 text-red-500 hover:text-red-700 font-bold"
                                                onClick={() => setPreview(null)}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    )}
                                </div>                              
                            </div>
                        )}

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
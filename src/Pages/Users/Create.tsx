import { Link } from 'react-router';
import { buttonVariants } from "@/components/ui/button"
import { useForm } from "react-hook-form";
import { ValidationSchema, validationSchema } from './Validations/schema'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { Create as CreateUser, GetAllRoles } from '@/Services/UsersService';
import { toast } from 'react-toastify';
import { useQuery } from '@tanstack/react-query';


interface UsersProps {
    Id: string;
    Active: boolean;
    Name: string;
    Surname: string;
    UserName: string;
    Email: string;
    PassWord: string;
    ConfirmPassWord: string;    
    RoleId: string;
}

interface role {
    id: string;
    name: string
}


function Create() {
    const rolesQuery = useQuery({ queryKey: ['roles'], queryFn: GetAllRoles });

    const [isActive, setIsActive] = useState<boolean>(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const mutation = useMutation({
        mutationFn: CreateUser,
        onSuccess: () => {
            toast('Dados salvos com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });

            queryClient.invalidateQueries({ queryKey: ['user'] })

            navigate('/Users');
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
    });

    const onSubmit = async (data: UsersProps) => {           
        const { ...rest } = data;
        mutation.mutate({
            ...rest
        })
    }

    const onError = (errors: any) => {
        console.log("form errors", errors);
    };


    return (


        <div className='p-5' >
            <div className="flex items-center justify-between gap-12 mb-3">
                <h6 className="font-semibold">Gerenciamento de Usuários</h6>
                <Link to="/Users" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
            </div>
            <Card className='p-5'>
                <CardContent >
                    <form className="flex h-full flex-col gap-5 " onSubmit={handleSubmit(onSubmit, onError)}>

                        <div className="flex gap-4">
                            <div className='card '>
                                <div className="w-[5%] flex items-center gap-2">
                                    <input {...register('Active')} type='checkbox' onChange={(e) => setIsActive(e.target.checked)} />
                                    <p>{errors.Active?.message}</p>
                                    <label className='font-semibold'>Ativo</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-[50%]">
                                <label className='font-semibold'>Nome *</label>
                                <Input {...register('Name')} type='text'  />
                                <p className='text-red-500'>{errors.Name?.message}</p>
                            </div>

                            <div className="w-[50%] gap-1">
                                <label className='mb-1 font-semibold'>Sobrenome *</label>

                                <Input {...register('Surname')} type='text'  />
                                <p className='text-red-500'>{errors.Surname?.message}</p>
                            </div>
                        </div>

                        <div className='flex gap-4'>

                            <div className="w-[50%]">
                                <label className='font-semibold'>Nome do usuário *</label>
                                <Input {...register('userName')} type='mail'   placeholder='Nickname do usuário'/>
                                <p className='text-red-500'>{errors.Email?.message}</p>
                            </div>
                        </div>

                        <div className='flex gap-4'>

                            <div className="w-[50%]">
                                <label className='font-semibold'>Email *</label>
                                <Input {...register('Email')} type='mail'  />
                                <p className='text-red-500'>{errors.Email?.message}</p>
                            </div>

                            <div className='w-[50%]'>
                                <label className='font-semibold'>Cargo *</label>
                                <Select defaultValue="0" {...register('RoleId')} onValueChange={(value) => setValue('RoleId', value)} >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem key="0" value="0" disabled   >Selecione</SelectItem >
                                        {rolesQuery &&
                                            rolesQuery.data?.data?.map((role: role) => {                                              
                                                return (
                                                    <SelectItem key={role.id} value={role.id}>
                                                        {role.name}
                                                    </SelectItem>
                                                )
                                            })
                                        }

                                    </SelectContent>
                                </Select>
                                {errors.RoleId && <p className='text-red-500'>{errors.RoleId.message}</p>}
                            </div>
                        </div>

                        <div className='flex gap-4'>

                            <div className="w-[50%]">
                                <label className='font-semibold'>Senha *</label>
                                <Input {...register('PassWord')} type='passWord'  />
                                <p className='text-red-500' >{errors.PassWord?.message}</p>
                            </div>

                            <div className="w-[50%]">
                                <label className='font-semibold'>Confirme a Senha *</label>
                                <Input {...register('ConfirmPassWord')} type='passWord'  />
                                <p className='text-red-500'>{errors.ConfirmPassWord?.message}</p>
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
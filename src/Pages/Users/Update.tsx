import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
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
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { GetAllRoles, GetUserById } from '@/Services/UsersService';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo } from "react";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import { UpdateUser } from "@/Services/UsersService";

// interface UsersProps {
//     Id: string;
//     Active: boolean;
//     Name: string;
//     Surname: string;
//     UserName: string;
//     Email: string;
//     PassWord: string;
//     ConfirmPassWord: string;    
//     RoleId: string;
// }

interface role {
  id: string;
  name: string
}

const Update = () => {
  const { id } = useParams<{ id: string }>();

  const rolesQuery = useQuery({ queryKey: ['roles'], queryFn: GetAllRoles });
  const response = useQuery({ queryKey: ['user'], queryFn: () => GetUserById(id as string) });

  const user = response.data?.data;
  console.log(user)

  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const successToastId = useMemo(() => 'successToastId', []);
  const errorToastId = useMemo(() => 'errorToastId', []);

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ValidationSchemaUpdate>({
    resolver: zodResolver(validationSchemaUpdate),
  });

  useEffect(() => {
    if (user) {
      setValue('Id', user.id);
      setValue('Name', user.name);
      setValue('Surname', user.surname);
      setValue('userName', user.userName);
      setValue('Email', user.email);
      setValue('RoleId', user.appRoleId);
      setValue('Active', user.active);
    }
  }, [user, setValue]);

  const mutation = useMutation({
    mutationFn: UpdateUser,
    onSuccess: () => {
      toast('Dados salvos com sucesso!', {
        toastId: successToastId,
        type: 'success',
      });

      queryClient.invalidateQueries({ queryKey: ['user'] })

      navigate('/Users');
    },
    onError: (error) => {
          console.log(error)

      toast('Ocorreu um erro interno!', {
        toastId: errorToastId,
        type: 'error',
      });
    }
  })


  const onSubmit = async (data: any) => {
    const { ...rest } = data;
    mutation.mutate({
      ...rest,
      Id: data.Id,
    })
  }

  const onError = (errors: any) => {
    console.log("form errors", errors);
  };

  return (
    <div className="p-5">
      <div className="flex items-center justify-between gap-12 mb-3">
        <h6 className="font-semibold">Editar Usuário</h6>
        <Link to="/Users" className={buttonVariants({ variant: "default", size: "sm" })}>Voltar</Link>
      </div>
      <Card className='p-5'>
        <CardContent>
          <form className="flex h-full flex-col gap-5" onSubmit={handleSubmit(onSubmit, onError)}>

            <div className="flex gap-4">
              <div className='card'>
                <div className="w-[5%] flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register('Active')}
                    checked={watch('Active')}
                    onChange={(e) => setValue('Active', e.target.checked)}
                  />
                  <p>{errors.Active?.message}</p>
                  <label className='font-semibold'>Ativo</label>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-[50%]">
                <label className='font-semibold'>Nome *</label>
                <Input  {...register('Name')} type='text' />
                <p className='text-red-500'>{errors.Name?.message}</p>
              </div>

              <div className="w-[50%] gap-1">
                <label className='mb-1 font-semibold'>Sobrenome *</label>
                <Input  {...register('Surname')} type='text' />
                <p className='text-red-500'>{errors.Surname?.message}</p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className="w-[50%]">
                <label className='font-semibold'>Nome do usuário *</label>
                <Input {...register('userName')} type='mail' placeholder='Nickname do usuário' />
                <p className='text-red-500'>{errors.Email?.message}</p>
              </div>
            </div>

            <div className='flex gap-4'>
              <div className="w-[50%]">
                <label className='font-semibold'>Email *</label>
                <Input  {...register('Email')} type='mail' />
                <p className='text-red-500'>{errors.Email?.message}</p>
              </div>

              <div className='w-[50%]'>
                <label className='font-semibold'>Cargo *</label>
                <Select value={watch('RoleId')}  {...register('RoleId')} >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="0" value="0" disabled>Selecione</SelectItem>
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

            <div className="w-[100%] mt-3 flex justify-between">
              <Button type="submit" variant="secondary">Salvar</Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Update;

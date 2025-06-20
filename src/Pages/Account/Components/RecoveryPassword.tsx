import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form";
import { ValidationSchema, validationSchema } from '../Validations/RecoveryPassWordValidation'
import { zodResolver } from "@hookform/resolvers/zod"
import { RecoveryPasswordService } from "@/Services/UsersService";
import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

function RecoveryPassword() {
    const successToastId = useMemo(() => 'successToastId', []);
    const errorToastId = useMemo(() => 'errorToastId', []);

    const { register, handleSubmit, formState: { errors } } = useForm<ValidationSchema>({
        resolver: zodResolver(validationSchema),
    });

    const mutation = useMutation({
        mutationFn: (data: { Password: string, NewPassword: string }) =>
            RecoveryPasswordService(data.Password, data.NewPassword),
        onSuccess: () => {
            toast('Dados salvos com sucesso!', {
                toastId: successToastId,
                type: 'success',
            });
        },
        onError: () => {
            toast('Ocorreu um erro interno!', {
                toastId: errorToastId,
                type: 'error',
            });
        }
    });

    const onSubmit = async (data: any) => {
        const { Password, NewPassword } = data;
        mutation.mutate({ Password, NewPassword });
    };

    return (
        <div className="px-5">
            <div>
                <p className="text-2xl">Alteração de senha</p>
                <p className="mt-2 text-gray-400">Sua senha deve conter no minimo 8 e no máximo 70 caracteres</p>

                <Card className="px-8 mt-5">
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Digite a senha atual</Label>
                                <Input type="text"  {...register('Password')}></Input>
                                <p className="text-red-500">{errors?.Password?.message}</p>
                            </div>
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Nova senha</Label>
                                <Input type="text" {...register('NewPassword')}></Input>
                                <p className="text-red-500">{errors?.NewPassword?.message}</p>
                            </div>
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Confirme a senha</Label>
                                <Input type="text" {...register('ConfirmPassword')}></Input>
                                <p className="text-red-500">{errors?.ConfirmPassword?.message}</p>
                            </div>

                            <div className="mt-5 mb-5 w-[50%]">

                                <Button>Confirmar</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}

export default RecoveryPassword
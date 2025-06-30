import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { ValidationSchema, validationSchema } from '../Validations/RecoveryPassWordValidation';
import { zodResolver } from "@hookform/resolvers/zod";
import { RecoveryPasswordService } from "@/Services/UsersService";
import { useMutation } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';

function RecoveryPassword() {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
                <p className="mt-2 text-gray-400">Sua senha deve conter no mínimo 8 e no máximo 70 caracteres</p>

                <Card className="px-8 mt-5">
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Senha atual */}
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Digite a senha atual</Label>
                                <div className="relative">
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        {...register('Password')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowPassword(prev => !prev)}
                                    >
                                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                                <p className="text-red-500">{errors?.Password?.message}</p>
                            </div>

                            {/* Nova senha */}
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Nova senha</Label>
                                <div className="relative">
                                    <Input
                                        type={showNewPassword ? "text" : "password"}
                                        {...register('NewPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowNewPassword(prev => !prev)}
                                    >
                                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
                                <p className="text-red-500">{errors?.NewPassword?.message}</p>
                            </div>

                            {/* Confirmar senha */}
                            <div className="mt-5 mb-5 w-[50%]">
                                <Label className="mb-2 text-xl">Confirme a senha</Label>
                                <div className="relative">
                                    <Input
                                        type={showConfirmPassword ? "text" : "password"}
                                        {...register('ConfirmPassword')}
                                        className="pr-10"
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                                        onClick={() => setShowConfirmPassword(prev => !prev)}
                                    >
                                        {showConfirmPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                                    </button>
                                </div>
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
    );
}

export default RecoveryPassword;

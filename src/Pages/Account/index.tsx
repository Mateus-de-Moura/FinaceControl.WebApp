import { Separator } from '@/components/ui/separator';
import { useState } from 'react';
import { Link } from 'react-router';


const Account = () => {
    const [image, setImage] = useState<string | null>(null);
        
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className='flex p-5 '>
            <div className='w-[30%] h-[100%] gap-5'>
                <ul className='p-3 mb-8 '>
                    <li className='mb-3 font-semibold'>
                        Visão Geral
                    </li>
                    <li className='mb-3 font-semibold'>
                        Informações de seguranca
                    </li >
                    <li className='mb-3 font-semibold'>
                        Senha
                    </li>
                    <li className='mb-3 font-semibold'>
                        Configuração de privacidade
                    </li>
                </ul>
            </div>

            <div className="w-[30%] gap-2 ">
                <div className="p-5 border hadow-lg">
                    <div className="flex justify-center items-center mb-4">
                        <label htmlFor="upload-photo" className="cursor-pointer">
                            <div
                                className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300"
                                style={{
                                    backgroundImage: image ? `url(${image})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                {!image && (
                                    <span className="text-gray-500 text-center">Clique para adicionar foto</span>
                                )}
                            </div>
                            <input
                                id="upload-photo"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <div className="flex justify-center items-center ">
                        <h2 className="text-xl font-semibold mb-4">Nome do Usuário</h2>
                    </div>

                    <div className="flex justify-center items-center mb-5 ">
                        <h6 className=" mb-4">Email</h6>
                    </div>

                    <Separator />
                    
                    <div className="flex justify-center items-center mt-5 ">
                        <Link className='text-blue-500' to="/"> sair de todos canais </Link>
                    </div>

                </div>
            </div>

             <div className="w-[30%] mx-10 ">
                <div className="p-5 border hadow-lg">                

                    <div className="flex justify-center items-center ">
                        <h1 className="text-xl font-semibold mb-4">Informações de Segurança</h1>
                    </div>

                    <div className="flex justify-center items-center mb-5 ">
                        <h6 className=" mb-4">Email</h6>
                    </div>

                    <Separator />
                    
                    <div className="flex justify-center items-center mt-5 ">
                        <Link className='text-blue-500' to="/"> sair de todos canais </Link>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Account;

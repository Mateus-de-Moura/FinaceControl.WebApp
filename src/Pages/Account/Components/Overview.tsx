import { Link } from 'react-router';
import { LiaUserEditSolid } from "react-icons/lia";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaChalkboardUser } from "react-icons/fa6";
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { updatePhoto } from '@/Services/UsersService';
import { useAuth } from '@/Pages/Auth/AuthContext';

interface OverviewProps {
  onViewChange: (view: string) => void;
}

const Overview: React.FC<OverviewProps> = ({ onViewChange }) => {
  const { user, updatePhoto: updatePhotoContext } = useAuth();
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (user?.photo) {
      const photo = `data:image/png;base64,${user.photo}`;
      setImage(photo);
    }
  }, [user?.photo]);

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile || !user?.email) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    try {
      const response = await updatePhoto(selectedFile, user.email);
      const novaFoto = response.data;   
      updatePhotoContext(novaFoto);
      window.location.reload();
    } catch (error) {
      console.error("Erro ao enviar a foto:", error);
    }
  };

  return (
    <div className='grid grid-cols-2 gap-6'>
      <div className="p-5 border shadow-lg rounded-2xl">
        <div className="flex justify-center items-center mb-4">
          <label htmlFor="upload-photo" className="cursor-pointer">
            <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-gray-300">
              {image ? (
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-500 text-center">Clique para adicionar foto</span>
              )}
            </div>
            <input id="upload-photo" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>
        <div className="flex justify-center items-center">
          <h2 className="text-xl font-semibold mb-4">{user?.name}</h2>
        </div>
        <div className="flex justify-center text-center items-center mb-5">
          <h6 className="mb-4">{user?.email}</h6>
        </div>
        <Separator />
        <div className="flex justify-center items-center mt-5">
          <Link className='text-blue-500' to="/">Sair de todos canais</Link>
        </div>
      </div>

      <div className="p-5 border shadow-lg rounded-2xl">
        <div className="flex justify-center items-center">
          <h1 className="text-xl font-semibold mb-4">Informações de Segurança</h1>
        </div>
        <div className="flex justify-center items-center mb-5">
          <LiaUserEditSolid size='120px' />
        </div>
        <div className="flex justify-center text-center items-center mb-5">
          <h6 className="mb-4">Mantenha seus métodos de verificação e informações de segurança atualizados.</h6>
        </div>
        <div className="flex justify-center items-center mt-5">
          <div onClick={() => onViewChange('security')} className='text-blue-500'>Atualizar Informações</div>
        </div>
      </div>

      <div className="p-5 border shadow-lg rounded-2xl">
        <div className="flex justify-center items-center">
          <h1 className="text-xl font-semibold mb-4">Senha</h1>
        </div>
        <div className="flex justify-center items-center mb-5">
          <RiLockPasswordLine size='120px' />
        </div>
        <div className="flex justify-center text-center items-center mb-5">
          <h6 className="mb-4">Torne sua senha mais forte ou altere-a se alguém mais a souber.</h6>
        </div>
        <div className="flex justify-center items-center mt-5">
          <Link className='text-blue-500' to="/">Alterar Senha</Link>
        </div>
      </div>

      <div className="p-5 border shadow-lg rounded-2xl">
        <div className="flex justify-center items-center">
          <h1 className="text-xl font-semibold mb-4">Minhas Entradas</h1>
        </div>
        <div className="flex justify-center items-center mb-5">
          <FaChalkboardUser size='120px' />
        </div>
        <div className="flex justify-center text-center items-center mb-5">
          <h6 className="mb-4">Veja quando e onde você entrou e verifique se algo parece incomum.</h6>
        </div>
        <div className="flex justify-center items-center mt-5">
          <Link className='text-blue-500' to="/">Examinar atividades recentes</Link>
        </div>
      </div>
    </div>
  );
};

export default Overview;

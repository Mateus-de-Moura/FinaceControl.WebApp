import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { useLoginUser } from "../../hooks/userAuthUser";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import fundo from '../../assets/capa-controle-financeiro-quantosobra.png'
import { useAuth } from "./AuthContext"

function Signin() {

  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailInvalid, setEmailInvalid] = useState(false);
  const { setUser } = useAuth();

  const { mutate: loginUser, isPending } = useLoginUser(email, password);

  const handleLoginSuccess = (data: any) => {
    setUser(data)
    localStorage.setItem('Logado', 'Logado');
    navigate('/home');
  };

  const handleLoginError = (error: any) => {
    console.log(error)
    const responseInfo = error?.response?.data; 
          console.log(responseInfo)
    if (responseInfo?.httpStatus === 404) {
      setEmailInvalid(true);
    }
  };

  const handleLogin = () => {
    loginUser(undefined, {
      onSuccess: handleLoginSuccess,
      onError: handleLoginError,
    });
  };


  return (
    <main className="h-screen flex w-full ">
      <div
        className="w-full h-full hidden p-4 bg-cover bg-center md:block "
        style={{ backgroundImage: `url(${fundo})` }}
      >
      </div>

      <section className="flex items-center justify-center bg-background h-full max-w-3xl w-full p-4">
        <Card className="w-full max-w-md px-2">
          <CardHeader>
            <CardTitle className="mt-3">
              Entre com sua conta
            </CardTitle>
            <CardDescription>
              Utilize seu e-mail e senha ou Github para se conectar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mt-4">
              <Label htmlFor="email">E-mail</Label>
              <Input placeholder="exemplo@email.com" id="email" type="email" onChange={e => setEmail(e.target.value)} />
              {emailInvalid &&
                <span className=" text-red-500"> E-mail ou Senha incorretos</span>
              }
            </div>
            <div className="mt-4">
              <Label htmlFor="senha">Senha</Label>
              <Input placeholder="sua senha" id="senha" type="password" onChange={e => setPassword(e.target.value)} />
              {emailInvalid &&
                <span className=" text-red-500"> E-mail ou Senha incorretos</span>
              }
            </div>

            <Button className="mt-6 w-full bg-blue-600 " onClick={handleLogin} disabled={isPending}>Entrar</Button>
            <div className="flex items-center gap-6 mt-4">
              <Separator />
              <span className="text-xs text-muted-foreground ">OU </span>

              <Separator />
            </div>

            <Button variant="outline" className="mt-6 mb-4 w-full">Entrar com o Github <GitHubLogoIcon></GitHubLogoIcon></Button>

          </CardContent>
        </Card>
      </section>

    </main>
  )
}

export default Signin
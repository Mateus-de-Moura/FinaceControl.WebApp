import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@radix-ui/react-label"
import { useLoginUser } from "../../hooks/userAuthUser";
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import fundo from '../../assets/capa-controle-financeiro-quantosobra.png'
import { useAuth } from "./AuthContext"
import { Eye, EyeOff } from 'lucide-react';
import Login from "@/components/login-github"


function Signin() {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameInvalid, setUsernameInvalid] = useState(false);
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const { mutate: loginUser, isPending } = useLoginUser(username, password);

  const handleLoginSuccess = (data: any) => {
    setUser(data)    
    navigate('/home');
  };

  const handleLoginError = () => {   
    setUsernameInvalid(true);
  };

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim() || !password) {
      setUsernameInvalid(true);
      return;
    }

    setUsernameInvalid(false);
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
              Utilize seu nome de usuário e senha ou GitHub para se conectar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
            <div className="mt-4">
              <Label htmlFor="username">Nome de usuário</Label>
              <Input placeholder="seu nome de usuário" id="username" type="text" value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" autoFocus />
              {usernameInvalid &&
                <span className="text-red-500">Nome de usuário ou senha incorretos</span>
              }
            </div>
            <div className="mt-4">
              <Label htmlFor="senha">Senha</Label>
              <div className="relative">
                <Input
                  placeholder="sua senha"
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                  onClick={() => setShowPassword(prev => !prev)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                </button>
              </div>
            </div>

            <Button className="mt-6 w-full bg-blue-600 " type="submit" disabled={isPending}>Entrar</Button>
            </form>
            <div className="flex items-center gap-6 mt-4">
              <Separator />
              <span className="text-xs text-muted-foreground ">OU </span>

              <Separator />
            </div>

            <Login/>

          </CardContent>
        </Card>
      </section>

    </main>
  )
}

export default Signin

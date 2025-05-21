import { Card, CardContent } from "@/components/ui/card"

function SecurityInfos() {
    return (
        <div className="px-5">
            <div>
                <p className="text-2xl">Informações de segurança</p>
                <p className="mt-2 text-gray-400">Estes são os métodos que você usa para entrar em sua conta ou redefinir sua senha.</p>

                <Card className="px-8 mt-5">
                    {/* <CardTitle>
                        <Button>
                            Adicionar método de entrada
                        </Button>
                    </CardTitle> */}
                    <CardContent>
                        <div>
                            teste
                        </div>
                    </CardContent>
                </Card>
            </div>

        </div>
    )
}

export default SecurityInfos
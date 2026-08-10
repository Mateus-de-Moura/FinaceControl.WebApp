# Execucao local com Docker

## Primeira execucao

1. Copie `.env.docker.example` para `.env.docker`.
2. Informe em `.env.docker` as credenciais da aplicacao e a senha administrativa do SQL Server.
3. Na pasta do front-end, execute:

```powershell
docker compose --env-file .env.docker up --build -d
```

O sistema ficara disponivel em:

- Aplicacao: http://localhost:8085
- API/Swagger: http://localhost:8080/swagger
- RabbitMQ: http://localhost:15672 (usuario e senha: `guest`)

## Proximas execucoes

```powershell
docker compose --env-file .env.docker up -d
```

Para acompanhar os logs:

```powershell
docker compose logs -f
```

Para parar os containers sem apagar os dados:

```powershell
docker compose down
```

O SQL Server faz parte da mesma rede Docker da API e seus dados ficam persistidos no volume `finance-control-sql`.

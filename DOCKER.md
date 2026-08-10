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
- Hangfire: http://localhost:8081/hangfire
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

Frontend, API, Hangfire, SQL Server e RabbitMQ sobem juntos pelo mesmo Compose. Os dados do SQL ficam persistidos no volume `finance-control-sql`.

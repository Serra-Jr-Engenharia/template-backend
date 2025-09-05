# 🚀 Template Backend - Serra Jr. Engenharia

Este é um projeto backend template para projetos na Serra Jr. Ele vem pré-configurado com uma estrutura composta por Node.js, TypeScript, Prisma, Fastify e Zod, para automatizar o setup inicial. Também vem com autenticação.

## ⚙️ Configuração do Ambiente

1. Instale as dependências

```bash
npm install
```

2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e adicione as variáveis disponíveis no arquivo `src/env.ts` - este arquivo contém o schema de todas as variáveis que o projeto utiliza:

```
DATABASE_URL="mysql://user:password@localhost:3306/db_name"
...
```

3. Sincronize o banco de dados

O projeto utiliza o Prisma como ORM. Para configurar o banco de dados, execute:

```bash
npx prisma migrate dev --name init
```

4. Inicie o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`.

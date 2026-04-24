# 🚀 Conecta+ | Plataforma de Gestão de Eventos e Ingressos

> **⚠️ OBS: Projeto em desenvolvimento.**

O **Conecta+** é uma plataforma moderna e robusta desenvolvida para a gestão completa de eventos, englobando desde a criação e controle de lotes até a emissão de ingressos digitais com QR Code e validação de check-in na portaria.

Esta API foi projetada com foco absoluto em **segurança, escalabilidade e manutenibilidade**, aplicando padrões de projeto de nível corporativo para resolver problemas reais de concorrência (_overbooking_) e fraudes em eventos.

## 🛠 Tecnologias Utilizadas

O ecossistema do projeto foi escolhido para garantir alta performance e tipagem estática de ponta a ponta:

- **[Node.js](https://nodejs.org/) & [TypeScript](https://www.typescriptlang.org/)** - Base da aplicação.
- **[Fastify](https://www.fastify.io/)** - Framework web focado em extrema velocidade e baixo _overhead_.
- **[Prisma ORM](https://www.prisma.io/)** - Modelagem de dados, migrações e consultas seguras (Type-Safe).
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional.
- **[Zod](https://zod.dev/)** - Validação de schemas e dados de entrada (DTOs).
- **[JWT & QRCode]** - Geração de tokens criptografados e bilhetes digitais dinâmicos.
- **[Docker](https://www.docker.com/)** - Containerização do ambiente de banco de dados.
- **[Swagger](https://swagger.io/) & [Scalar](https://scalar.com/)** - Documentação automatizada e interface interativa para testes das rotas de API.
- **[BullMQ](https://bullmq.io/)** - Gerenciamento de filas e processamento de tarefas em background com Redis.
- **[Resend](https://resend.com/)** - Envio de e-mails.

---

## 🏛 Arquitetura do Sistema

O backend do Conecta+ foi estruturado seguindo dois grandes pilares da engenharia de software moderna: **Clean Architecture** e **Monolito Modular (Modular Monolith)**.

### 1. Monolito Modular

Em vez de fragmentar precocemente o sistema em microsserviços (o que adiciona complexidade de rede e infraestrutura), o projeto adota o Monolito Modular. A aplicação roda em um único processo, mas o código é **estritamente isolado por contextos de negócio (Domínios)**.

- Módulos como `User`, `Event` e `Ticket` são independentes.
- Isso garante **alta coesão e baixo acoplamento**, permitindo que, no futuro, um módulo (como o de Ingressos) seja facilmente extraído para um microsserviço independente, caso a demanda exija.

### 2. Clean Architecture & Princípios SOLID

O sistema isola a **Regra de Negócio** (Casos de Uso) dos **Detalhes de Infraestrutura** (Banco de dados, Framework HTTP, Bibliotecas externas).

- **Inversão de Dependência (DIP):** Os _Use Cases_ não dependem do Prisma ou do Fastify, eles dependem de **Interfaces** (Contratos). A implementação real é injetada.
- **Proteção de Fronteiras:** Bibliotecas de geração de QR Code ou disparo de e-mails vivem na camada de `Providers` (Infra), nunca dentro do Caso de Uso.

---

## 📂 Estrutura de Diretórios

A estrutura de pastas reflete diretamente a arquitetura escolhida:

```text
src/
├── infra/                  # 🔌 A Camada Suja (Detalhes Técnicos)
│   ├── database/           # Configuração do Prisma Client
│   ├── http/               # Servidor Fastify, Plugins e Rotas
│   └── providers/          # Implementações reais (Ex: JwtProvider, MailProvider)
│
├── modules/                # 📦 O Coração do Negócio (Monolito Modular)
│   ├── auth/               # Autenticação e Sessão
│   ├── event/              # Gestão de Eventos, Lotes e Privacidade
│   ├── evaluations/        # Avaliações e Feedbacks
│   ├── ticket/             # Checkout, QR Code, Check-in e Carteira
│   └── user/               # Gestão de Perfis e RBAC
│       ├── use-cases/      # As regras de negócio puras (Ex: CheckoutTicketUseCase)
│       └── repositories/   # Interfaces/Contratos de banco de dados
│
└── shared/                 # 🤝 Código Comum (Acesso Global)
    ├── errors/             # Classes de Erro Customizadas (Ex: TicketNotFoundError)
    ├── middlewares/        # Interceptadores HTTP (Ex: verifyJwt, checkRole)
    ├── providers/          # Interfaces dos provedores (Ex: IJwtProvider)
    ├── schemas/            # Validações Zod genéricas
    └── types/              # Tipagens globais do TypeScript
```

---

## ✨ Principais Funcionalidades (Highlights)

- **Controle de Concorrência (Prevenção de Overbooking):** Utilização de transações atômicas (`$transaction`) no banco de dados durante o checkout de ingressos para garantir que os lotes não ultrapassem a capacidade máxima.
- **Segurança Offline-Friendly:** Geração de QR Codes assinados criptograficamente via JWT. A validação real ocorre contra o banco de dados na portaria, permitindo que o visitante leve o bilhete em modo avião.
- **Eventos Públicos e Privados:** Lógica de "Porteiro Virtual" onde eventos privados exigem um `accessCode` antes de expor os lotes e valores aos visitantes.
- **Role-Based Access Control (RBAC):** Proteção de rotas baseada em permissões (Administrador, Organizador, Visitante).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js (v24+)
- Docker e Docker Compose (Para rodar o PostgreSQL e o Redis)
- Chaves de API

### Passo a Passo

1. **Clone o repositório**

   ```bash
   git clone https://github.com/erikmiqueias/conecta_mais_backend.git
   cd conecta_mais_backend
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Copie o arquivo `.env.example` para `.env` e preencha as variáveis (JWT Secret, URL do Banco, etc).

   ```bash
   cp .env.example .env
   ```

4. **Inicie o Banco de Dados e o Redis**

   ```bash
   docker-compose up -d
   ```

5. **Execute as Migrações do Prisma**

   ```bash
   npx prisma migrate dev
   ```

   ou

   ```bash
   npx prisma db push
   ```

6. **Inicie o Servidor**

   ```bash
   npm run dev
   ```

   _A API estará disponível em `http://localhost:3333`._

7. **Visualize e teste as rotas**
   ```bash
   http://localhost:<port>/docs
   ```

---

## 👨‍💻 Autor

**Erik Miqueias** _Desenvolvedor Full-Stack | Foco em Node.js & React_

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/erik-miqueias-330471255/)

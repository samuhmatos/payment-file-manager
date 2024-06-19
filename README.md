# Payment File Manager - Documentação Técnica

## Introdução

O projeto **Payment File Manager** foi desenvolvido para otimizar o processo de recebimento de pagamentos feitos no dia anterior através de um arquivo de texto específico. Esta aplicação permite o upload, visualização paginada, edição, exclusão e confirmação de dados, além de exportação de dados em formato CSV. Tudo isso garantindo eficiência e escalabilidade para atender às necessidades de auditoria.

## Estrutura do Projeto

### Tecnologias Utilizadas

- **Linguagem**: TypeScript
- **Framework Web**: Nest.js
- **Banco de Dados**: PostgreSQL
- **Cache e Fila de Tarefas**: Redis
- **Containerização**: Docker
- **Orquestração de Containers**: Docker Compose

---

### Configuração do Ambiente

Para garantir que o ambiente esteja devidamente configurado, siga os passos abaixo:

1. **Clone o Repositório:**

   ```bash
    git clone https://github.com/samuhmatos/payment-file-manager
    cd payment-file-manager
   ```

2. **Iniciar o projeto:**
   ```bash
   cp .env.example .env
   docker-compose up -d
   npm run build
   npm run start:prod
   ```

### HTTP Client

Para testar as rotas do projeto, import o arquivo `payment-file-manager.postman_collection.json` no seu http client, de preferência Postman para melhor compatibilidade.

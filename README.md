# Plataforma de Gestao de Imoveis

Aplicacao full-stack para gestao imobiliaria com autenticacao JWT, RBAC, busca e filtros, favoritos e painel de gestao para corretores e administradores.

## Stack
- Backend: Spring Boot 3.5, Java 21, Spring Security, JPA/Hibernate
- Frontend: React 18, TypeScript, Vite
- Banco: PostgreSQL 16
- Infra: Docker Compose

## Funcionalidades principais
- Login com JWT e controle de acesso por perfil (ADMIN, AGENT, CLIENT)
- Home publica com filtros:
  - texto (titulo e endereco: cidade/estado)
  - tipo
  - quartos minimos
  - preco minimo e maximo
- Cards com condicao do empreendimento:
  - Lancamento
  - Construcao
  - Pronto
- Detalhes do imovel com galeria, favoritos e bloco de contato ficticio do vendedor
- Favoritos para visitante/cliente
- Gestao de imoveis (AGENT e ADMIN):
  - criar
  - editar
  - ativar/desativar
  - excluir
- Regra de exclusao:
  - ADMIN exclui qualquer imovel
  - AGENT exclui apenas os proprios imoveis

## Subida rapida (Docker)
1. Crie suas variaveis locais a partir do exemplo:
```bash
cp .env.example .env
```

2. Ajuste os valores sensiveis no arquivo `.env`:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `JWT_SECRET`

3. Suba os servicos:
```bash
docker-compose up -d --build frontend backend
```

Acessos:
- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Variaveis de ambiente
O projeto usa variaveis em `.env` (raiz), lidas pelo Docker Compose.

Principais variaveis sensiveis:
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_DB`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `JWT_SECRET`

Arquivo de referencia:
- `.env.example`

Observacao:
- O frontend recebe `VITE_API_BASE_URL` no build da imagem Docker.

## Contas de teste
- admin@example.com / password123
- agent@example.com / password123

## Endpoints relevantes
- `GET /api/properties`
- `GET /api/properties/{id}`
- `POST /api/properties`
- `PUT /api/properties/{id}`
- `PATCH /api/properties/{id}/active?active=true|false`
- `DELETE /api/properties/{id}`
- `GET /api/properties/manage`

## Notas de implementacao recente
- Campo de condicao do empreendimento adicionado no modelo e formularios
- Busca textual ampliada para endereco, permitindo pesquisa por cidade/estado
- Coluna de imagens ajustada para suportar data URL grande (TEXT)
- Icones migrados para SVG

## Estrutura resumida
- `backend/`: API, seguranca e regras de negocio
- `frontend/`: interface React e integracao com API
- `docker-compose.yml`: orquestracao local
- `ARCHITECTURE.md`: visao de arquitetura
- `APRESENTACAO-RECRUTADORES.md`: resumo para estudo e pitch

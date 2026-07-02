# Plataforma de gestão de Imoveis

Aplicacao full-stack para gestão imobiliaria com autenticacao JWT, RBAC, busca e filtros, favoritos e painel de gestão para corretores e administradores.

## Stack
- Backend: Spring Boot 3.5, Java 21, Spring Security, JWT, JPA/Hibernate, Jakarta Validation
- Frontend: React 18, TypeScript, Vite
- Banco: PostgreSQL 16
- Infra: Docker Compose
- Teste: (JUnit e Mockito)

## Decisoes tecnicas importantes
- JWT stateless para autenticacao e autorização
- Regras de permissão no backend (não apenas na UI)
- Validação de entrada com Jakarta Validation
- Estrategia de imagens com suporte a data URL e coluna TEXT

## Funcionalidades principais
- Login com JWT e controle de acesso por perfil (ADMIN, Corretores, CLIENT)
- Home publica com filtros:
  - Texto (titulo e endereço: Cidade/Estado)
  - Tipo
  - Quartos mínimos
  - Preço mínimo e maximo
- Cards com condição do empreendimento:
  - Lançamento
  - Construção
  - Pronto
- Detalhes do imóvel com galeria, favoritos e bloco de contato ficticio do vendedor
- Favoritos para visitante/cliente
- Gestão de imóveis (CORRETOR e ADMIN):
  - Criar
  - Editar
  - Ativar/desativar
  - Excluir
- Regra de exclusão:
  - ADMIN exclui qualquer imovel
  - CORRETOR exclui apenas os próprios imoveis

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

## Estrutura resumida
- `backend/`: API, seguranca e regras de negocio
- `frontend/`: Interface React e integracao com API
- `docker-compose.yml`: Orquestração local
- `ARCHITECTURE.md`: Visao de arquitetura

# Resumo da Aplicacao (Estudo e Apresentacao)

## 1. Problema que a aplicacao resolve
A aplicacao centraliza o ciclo de venda de imoveis em uma unica plataforma:
- anuncio e gestao de imoveis por corretores
- governanca administrativa por perfil
- descoberta publica com filtros de negocio
- experiencia de contato e interesse (favoritos)

## 2. Proposta de valor
- Reduz atrito operacional com RBAC claro (ADMIN/AGENT/CLIENT)
- Mantem seguranca de acesso com JWT e regras de ownership
- Aumenta qualidade de busca por localizacao textual (cidade/estado no endereco)
- Oferece demonstracao funcional de fluxo imobiliario ponta a ponta

## 3. Arquitetura (alto nivel)
- Frontend React + TypeScript (SPA)
- Backend Spring Boot com camadas Controller -> Service -> Repository
- Persistencia em PostgreSQL com JPA/Hibernate
- Orquestracao local via Docker Compose

## 4. Decisoes tecnicas importantes
- JWT stateless para autenticacao e autorizacao
- Regras de permissao no backend (nao apenas na UI)
- Validacao de entrada com Jakarta Validation
- Estrategia de imagens com suporte a data URL e coluna TEXT

## 5. Funcionalidades de destaque para demonstracao
- Cadastro/edicao/ativacao/desativacao/exclusao de imoveis
- Exclusao com regra de ownership:
  - ADMIN: qualquer imovel
  - AGENT: apenas imoveis proprios
- Campo de condicao do empreendimento:
  - Lancamento, Construcao, Pronto
- Busca por nome do imovel e endereco (cidade/estado)
- Favoritos e tela de detalhes com galeria e contato ficticio

## 6. Seguranca e qualidade
- Senhas com PasswordEncoder
- Endpoints protegidos por roles
- Validacao de payload e parametros de busca
- Separacao clara de responsabilidades por camada

## 7. Como apresentar em entrevista (roteiro rapido)
1. Contexto: "Montei uma plataforma imobiliaria full-stack com foco em seguranca e regras reais de negocio."
2. Arquitetura: "Usei Spring Boot no backend e React no frontend, com JWT e PostgreSQL."
3. Regra de negocio: "A exclusao respeita ownership: corretor exclui apenas o que e dele."
4. Produto: "Adicionei condicao do empreendimento e busca por cidade/estado no endereco."
5. Engenharia: "Validei entrada com Jakarta Validation e mantive API/DTOs alinhados ao frontend."
6. Operacao: "Projeto sobe com docker-compose para facilitar reproducao."

## 8. Pontos de evolucao (proximos passos)
- Testes automatizados (unitarios e integracao)
- Paginacao e ordenacao avancadas no frontend
- Upload de imagem por storage externo (S3/Azure Blob)
- Observabilidade (logs estruturados e metricas)
- CI/CD com pipeline de build e testes

## 9. Elevator pitch (30s)
Desenvolvi uma plataforma de gestao de imoveis full-stack com Spring Boot e React. Implementei autenticacao JWT, controle de acesso por perfil e regras de ownership para operacoes sensiveis, como exclusao de imoveis. No produto, inclui busca por localizacao no endereco e condicao do empreendimento, melhorando a experiencia de descoberta. O sistema roda via Docker Compose e esta pronto para evoluir com testes e CI/CD.

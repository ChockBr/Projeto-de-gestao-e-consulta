# 🏗️ Arquitetura da Aplicação - Real Estate Management

## 1. Diagrama de Fluxo de Autenticação

```
┌─────────────────┐                                    ┌──────────────────┐
│   CLIENTE       │                                    │     BACKEND      │
│  (React/SPA)    │                                    │  (Spring Boot)   │
└────────┬────────┘                                    └────────┬─────────┘
         │                                                      │
         │ 1. POST /api/auth/login                             │
         │ { email, password }                                 │
         ├─────────────────────────────────────────────────────>│
         │                                                      │
         │                                    2. Validar credenciais
         │                                       (PasswordEncoder)
         │                                                      │
         │                                    3. Gerar JWT Token
         │                                       (JwtTokenProvider)
         │                                       Claims: sub, roles
         │                                                      │
         │ 4. HTTP 200 + { token }                             │
         │<─────────────────────────────────────────────────────┤
         │                                                      │
    localStorage.setItem('token', token)                       │
         │                                                      │
         │ 5. GET /api/properties                              │
         │ Authorization: Bearer {token}                       │
         ├─────────────────────────────────────────────────────>│
         │                                                      │
         │                                    6. JwtAuthenticationFilter
         │                                       Extrair token do header
         │                                       Validar assinatura
         │                                       Extrair email + roles
         │                                                      │
         │                                    7. SecurityContext.setAuthentication()
         │                                                      │
         │                                    8. @PreAuthorize verifica role
         │                                                      │
         │ 9. HTTP 200 + [properties]                          │
         │<─────────────────────────────────────────────────────┤
         │                                                      │
```

---

## 2. Diagrama de Layering - Backend

```
HTTP Requests
    │
    ▼
┌─────────────────────────────────────┐
│       CONTROLLER LAYER              │
│  ├─ AuthController                  │
│  ├─ PropertyController              │
│  ├─ FavoriteController              │
│  └─ AdminController                 │
└────────────┬────────────────────────┘
             │
    ▼ Request → DTO Validation
┌─────────────────────────────────────┐
│       SERVICE LAYER                 │
│  ├─ UserService                     │
│  ├─ PropertyService                 │
│  └─ FavoriteService                 │
│                                     │
│  Business Logic:                    │
│  ├─ Validações                      │
│  ├─ Ownership checks                │
│  ├─ Authorization                   │
│  └─ Orchestration                   │
└────────────┬────────────────────────┘
             │
    ▼ CRUD Operations
┌─────────────────────────────────────┐
│      REPOSITORY LAYER               │
│  ├─ UserRepository (JpaRepository)  │
│  ├─ PropertyRepository              │
│  │  └─ Custom: search()             │
│  │  └─ Custom: findByOwner()        │
│  └─ FavoriteRepository              │
│     └─ Custom: findByUserAndProperty()
└────────────┬────────────────────────┘
             │
    ▼ SQL Queries (JPA/Hibernate)
┌─────────────────────────────────────┐
│       ENTITY LAYER / JPA            │
│  ├─ @Entity User                    │
│  ├─ @Entity Property                │
│  ├─ @Entity Favorite                │
│  └─ @Enum Role                      │
└────────────┬────────────────────────┘
             │
    ▼ ORM Mapping
┌─────────────────────────────────────┐
│      DATABASE LAYER                 │
│  PostgreSQL 16                      │
│  ├─ TABLE: "user"                   │
│  ├─ TABLE: property                 │
│  ├─ TABLE: favorite                 │
│  └─ TABLE: user_roles (join table)  │
└─────────────────────────────────────┘
```

---

## 3. Diagrama de Segurança - Spring Security Filter Chain

```
HTTP Request
    │
    ▼
┌──────────────────────────────────┐
│  CorsFilter                      │  ← Permite requisições cross-origin
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  SecurityContextPersistenceFilter│  ← Recupera contexto anterior
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  JwtAuthenticationFilter ⭐      │  ← NOSSO FILTRO CUSTOMIZADO
│  ├─ Read Authorization header    │
│  ├─ Extract Bearer token         │
│  ├─ Validate signature           │
│  ├─ Extract claims (email, roles)│
│  └─ Set SecurityContext          │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  UsernamePasswordAuthenticationFilter│  ← Para login
│  ├─ Extract email:password       │
│  ├─ Load UserDetails             │
│  ├─ Compare passwords            │
│  └─ Set authenticated principal  │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  AuthorizationFilter             │
│  ├─ Check if route needs auth    │
│  ├─ @PreAuthorize("hasRole(...)")│
│  └─ Allow / Deny / 403           │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  CONTROLLER / HANDLER            │
└──────────────────────────────────┘
```

---

## 4. Diagrama de Componentes - Frontend

```
┌───────────────────────────────────────────────┐
│              React Application                │
│                                               │
│  ┌─────────────────────────────────────────┐  │
│  │        App.tsx (Router Setup)           │  │
│  │  ├─ BrowserRouter wrapper              │   │
│  │  ├─ AuthProvider (Context)             │   │
│  │  └─ Routes (5 páginas)                 │   │
│  └────────────────┬────────────────────────┘  │
│                   │                           │
│     ┌─────────────┼─────────────┬─────────┐   │
│     │             │             │         │   │    
│     ▼             ▼             ▼         ▼   │
│  ┌─────────┐  ┌──────────┐  ┌─────────────┐   │
│  │ Navbar  │  │  Pages   │  │  Context    │   │
│  │ (fixed) │  │          │  │   Store     │   │
│  │         │  ├─ Login   │  │             │   │
│  │ Links   │  ├─ Browse  │  │ AuthProvider│   │
│  │ User    │  ├─ Detail  │  │ ├─ token    │   │
│  │ Email   │  ├─ Manage  │  │ ├─ email    │   │ 
│  │ Logout  │  ├─ Favs    │  │ ├─ login()  │   │ 
│  │         │  └─ PrivateRoute│ └─ logout()│   │ 
│  └─────────┘  │          │  └─────────────┘   │
│               └──────────┘                    │
│                   │                           │
│     ┌─────────────┼─────────────┐             │
│     │             │             │             │
│     ▼             ▼             ▼             │
│  ┌───────────┐ ┌─────────┐ ┌─────────────┐    │
│  │ Utils API │ │ Types   │ │  Styles CSS │    │
│  │           │ │         │ │             │    │
│  │ apiRequest│ │Property │ │ Responsive  │    │
│  │ authReq() │ │Response │ │ Grid layout │    │
│  │           │ │ Enum    │ │ Animations  │    │
│  │ HTTP      │ │         │ │ Badges      │    │
│  │ Bearer    │ │         │ │ Permissions │    │
│  └───────────┘ └─────────┘ └─────────────┘    │
│                                               │
└───────────────────────────────────────────────┘
         │
         │ HTTP (fetch/axios)
         │
         ▼
    BACKEND API
    (Port 8080)
```

---

## 5. Diagrama de Estado - AuthContext

```
App Mounted
    │
    ▼
AuthProvider Initializes
    │
    ├─ localStorage.getItem('token')
    │
    ▼
┌──────────────────────────────┐
│   AuthState                  │
│  ├─ token: null | string     │
│  └─ email: null | string     │
└───────┬──────────────────────┘
        │
        ├─────────────────────────────────────┐
        │                                     │
        ▼ User submits login                  ▼ User clicks logout
    POST /api/auth/login              logout() function
        │                                     │
        ▼                                     ▼
    ┌─────────────────┐         ┌────────────────────┐
    │ LOGIN FLOW      │         │ LOGOUT FLOW        │
    │                 │         │                    │
    │ 1. Call API     │         │ 1. Clear storage   │
    │ 2. Get token    │         │ 2. Set state null  │
    │ 3. Save state   │         │ 3. Redirect /login │
    │ 4. Save storage │         │ 4. Clear context   │
    │ 5. Set Auth     │         │                    │
    │ 6. Redirect /   │         │                    │
    └────────┬────────┘         └────────┬───────────┘
             │                           │
    ┌────────┴───────────┐              │
    │                    │              │
    ▼                    ▼              ▼
┌──────────────┐  ┌─────────────┐  ┌──────────┐
│ Authenticated│  │ Token Valid │  │ Logged   │
│ ✓ Can access│  │ ✓ Send in   │  │ Out      │
│   protected │  │   header    │  │ ✗ No     │
│   routes    │  │ ✓ Use in    │  │   access │
│ ✓ Email     │  │   context   │  │ ✗ Token  │
│   visible   │  │             │  │   cleared │
│ ✓ Favorite/ │  │ ❌ Expired  │  │ ✗ Redirect│
│   Manage    │  │    → Logout │  │   /login │
│   visible   │  │             │  │          │
└──────────────┘  └─────────────┘  └──────────┘
```

---

## 6. Fluxo de Data - Criar Imóvel

```
┌──────────────────────────────┐
│   FRONTEND                   │
│   PropertyManagementPage     │
└──────────┬───────────────────┘
           │
           │ 1. User fills form
           │    { title, desc, type, price, bedrooms }
           │
           ▼
    ┌──────────────────┐
    │ onClick handler  │
    │ handleCreateProp │
    └────────┬─────────┘
             │
             │ 2. authRequest(token, '/api/properties', 
             │    { method: 'POST', body: JSON.stringify(...) })
             │
             ▼
    ┌──────────────────────────────┐
    │   BACKEND                    │
    │   PropertyController         │
    │   @PostMapping               │
    │   @PreAuthorize("hasRole...")│
    └────────┬─────────────────────┘
             │
             │ 3. Validate PropertyRequest DTO
             │    @NotBlank, @NotNull, @Min, etc
             │
             ▼
    ┌──────────────────────────┐
    │   PropertyService        │
    │   create(req, owner)     │
    └────────┬─────────────────┘
             │
             │ 4. Property p = new Property()
             │ 5. p.setTitle(req.getTitle())
             │ 6. p.setOwner(owner) ← from JWT token
             │ 7. p.setActive(true)
             │ 8. p.setCreatedAt(now)
             │
             ▼
    ┌──────────────────────┐
    │ PropertyRepository   │
    │ .save(property)      │
    └────────┬─────────────┘
             │
             │ 9. JPA/Hibernate generates SQL INSERT
             │
             ▼
    ┌──────────────────────┐
    │   PostgreSQL 16      │
    │   INSERT INTO        │
    │   property(...)      │
    │   VALUES(...)        │
    └────────┬─────────────┘
             │
             │ 10. Row inserted, ID generated
             │
             ▼
    ┌──────────────────────────┐
    │ Return PropertyResponse  │
    │ { id, title, ..., ownerId}
    └────────┬─────────────────┘
             │
             │ 11. HTTP 200
             │
             ▼
    ┌──────────────────────────┐
    │   FRONTEND               │
    │   PropertyManagementPage │
    │                          │
    │ 12. Show success message │
    │ 13. Add to list          │
    │ 14. Clear form           │
    └──────────────────────────┘
```

---

## 7. Diagrama de Permissões (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│                   ROLES & PERMISSIONS                    │
└─────────────────────────────────────────────────────────┘

┌────────────┐        ┌──────────────┐        ┌─────────────┐
│   ADMIN    │        │ AGENT/CORRETOR│        │   CLIENT    │
│ (👑 Super) │        │  (🏢 Seller)   │        │ (👤 Buyer)  │
└─────┬──────┘        └───────┬───────┘        └──────┬──────┘
      │                       │                       │
      │ Can:                  │ Can:                  │ Can:
      │                       │                       │
      ├─ Create properties    ├─ Create properties   ├─ View properties
      ├─ Edit ANY property    ├─ Edit OWN properties ├─ Search properties
      ├─ Delete properties    ├─ Delete OWN props    ├─ View favorites
      ├─ View all properties  ├─ View OWN props      ├─ Add favorites
      ├─ Toggle active status ├─ Toggle own status   ├─ Remove favorites
      ├─ Create users         ├─ Not see admin panel ├─ Not see manage
      ├─ View ALL favorites   ├─ See only own favs   └─ Basic features
      │                       │
      │ Pages:                │ Pages:
      ├─ /                    ├─ /
      ├─ /properties/:id      ├─ /properties/:id
      ├─ /manage             ├─ /manage
      ├─ /favorites          ├─ /favorites
      ├─ /admin/users        └─ See: "No access"
      └─ All endpoints             when restricted
         pass @PreAuthorize

      API Responses:
      ├─ GET /api/properties → full access
      ├─ POST /api/properties → allowed
      ├─ PUT /api/properties/{id} → any property
      ├─ DELETE /api/properties/{id} → any property
      └─ POST /api/admin/users → allowed

         @PreAuthorize("hasRole('ADMIN')")
         @PreAuthorize("hasRole('ADMIN', 'AGENT')")
         Ownership check: if (prop.owner != currentUser && !isAdmin) 403
```

---

## 8. Estrutura de Pasta - Docker Volumes & Networks

```
┌─────────────────────────────────────────────────────┐
│         Docker Compose Environment                  │
└─────────────────────────────────────────────────────┘

┌──────────────────┐
│  Host Machine    │
│  Port 3000       │ ◄──── Frontend Container
│  Port 8080       │ ◄──── Backend Container
│  Port 5432       │ ◄──── PostgreSQL Container
└──────────────────┘
         │
         │ docker-compose.yml configures:
         │
         ▼
    ┌──────────────────────────────┐
    │   app-network (bridge)       │
    │                              │
    │  ┌────────────────────────┐  │
    │  │  Frontend:3000         │  │
    │  │  ├─ npm run preview    │  │
    │  │  ├─ Proxy: /api →     │  │
    │  │  │   http://backend   │  │
    │  │  └─ Serves dist/       │  │
    │  └────────────────────────┘  │
    │           ▲                  │
    │           │ (depends_on)     │
    │           │                  │
    │  ┌────────┴──────────────┐   │
    │  │  Backend:8080         │   │
    │  │  ├─ java -jar *.jar   │   │
    │  │  ├─ Spring Boot 3.5   │   │
    │  │  └─ Env vars:         │   │
    │  │     SPRING_DATASOURCE │   │
    │  │     JWT_SECRET        │   │
    │  └────────┬──────────────┘   │
    │           │ (depends_on)     │
    │           │                  │
    │  ┌────────▼──────────────┐   │
    │  │  PostgreSQL:5432      │   │
    │  │  ├─ POSTGRES_DB:      │   │
    │  │  │   realestate       │   │
    │  │  ├─ POSTGRES_USER:    │   │
    │  │  │   appuser          │   │
    │  │  ├─ Volume:           │   │
    │  │  │   postgres-data    │   │
    │  │  └─ Auto-init schema  │   │
    │  └────────────────────────┘   │
    │                              │
    └──────────────────────────────┘
         │
         │ volumes:
         ▼
    ┌──────────────────────────┐
    │  postgres-data           │
    │  (named volume)          │
    │                          │
    │ Persists:               │
    │ ├─ Database files       │
    │ ├─ Schema               │
    │ └─ All data between     │
    │    container restarts   │
    └──────────────────────────┘
```

---

## 9. Request/Response Flow - GET /api/properties

```
CLIENT                          BACKEND
(Browser)                       (Spring Boot)
   │                               │
   │ GET /api/properties           │
   ├──────────────────────────────>│
   │ Header:                       │
   │ Authorization:               │
   │ Bearer eyJhbGc...             │
   │                               │
   │                        ┌──────▼─────────┐
   │                        │ JwtAuthFilter  │
   │                        │ ├─ Extract JWT │
   │                        │ ├─ Validate    │
   │                        │ └─ Extract sub,│
   │                        │    roles       │
   │                        └──────┬─────────┘
   │                               │
   │                        ┌──────▼──────────┐
   │                        │ PropertyCtrl    │
   │                        │ @GetMapping     │
   │                        └──────┬──────────┘
   │                               │
   │                        ┌──────▼──────────┐
   │                        │ PropertyService│
   │                        │ search(...)    │
   │                        └──────┬──────────┘
   │                               │
   │                        ┌──────▼──────────┐
   │                        │ PropertyRepo   │
   │                        │ .search()      │
   │                        │ SQL Query:     │
   │                        │ SELECT * FROM  │
   │                        │ property WHERE │
   │                        │ active = true  │
   │                        └──────┬──────────┘
   │                               │
   │                        ┌──────▼──────────┐
   │                        │ PostgreSQL     │
   │                        │ ├─ Find rows   │
   │                        │ └─ Return data │
   │                        └──────┬──────────┘
   │                               │
   │                        ┌──────▼──────────┐
   │                        │ List<Property> │
   │                        │ → Convert to   │
   │                        │ List<Response> │
   │                        └──────┬──────────┘
   │                               │
   │ HTTP 200                       │
   │ Content-Type: app/json        │
   │ [ { id, title, type, ... } ]  │
   │<──────────────────────────────┤
   │                               │
 Parse JSON
   │
   ▼
Update React state
   │
   ▼
Re-render UI with properties
```

---

## 10. Entity Relationship Diagram (ERD)

```
┌──────────────────────────────────────┐
│            USER                      │
├──────────────────────────────────────┤
│ id (PK)         │ BIGINT             │
│ email (UQ)      │ VARCHAR(255)       │
│ password        │ VARCHAR(255) [ENC] │
│ roles           │ SET (join table)   │
│ created_at      │ TIMESTAMP          │
├──────────────────────────────────────┤
│ Relationships:                       │
│ • 1:N with Property (owner)          │
│ • 1:N with Favorite (user)           │
│ • M:M with Role (roles)              │
└──────────────────────────────────────┘
           │ 1
           │
           ├─N──────────────────┐
           │                    │
           ▼ 1                  ▼ 1
    ┌──────────────┐    ┌──────────────────────┐
    │  PROPERTY    │    │  FAVORITE            │
    ├──────────────┤    ├──────────────────────┤
    │ id (PK)      │    │ id (PK)              │
    │ title        │    │ user_id (FK,UQ)      │
    │ description  │    │ property_id (FK,UQ) │
    │ type         │    │ created_at           │
    │ price        │    ├──────────────────────┤
    │ bedrooms     │    │ Constraints:        │
    │ active       │    │ • UQ(user,property) │
    │ owner_id(FK) │    │ • FK to User        │
    │ created_at   │    │ • FK to Property    │
    └──────────────┘    └─N────────────────────┘
           │ N                 │ N
           └─────────────────┬─┘
                             │
    ┌────────────────────────────────────────────┐
    │  MANY-TO-MANY Relationships:              │
    │                                             │
    │  User -M:N→ Property (Favorites)           │
    │  │     via Favorite table                  │
    │  │                                         │
    │  └─ UQ(user_id, property_id) ensures      │
    │     user can't favorite same property     │
    │     more than once                        │
    └────────────────────────────────────────────┘

┌──────────────────────────────────┐
│  ROLE (Enum)                     │
├──────────────────────────────────┤
│ ROLE_ADMIN                       │
│ ROLE_AGENT                       │
│ ROLE_CLIENT                      │
├──────────────────────────────────┤
│ Stored in:                       │
│ user_roles (join table)          │
│ ├─ user_id (FK)                  │
│ └─ role (VARCHAR)                │
└──────────────────────────────────┘
```

---

**Diagrama criado para melhor compreensão da arquitetura! 🎨**

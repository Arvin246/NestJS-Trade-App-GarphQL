# GraphQL Order API — Phased Implementation Plan

**Status:** Phases 1–3 done. Phase 4 done. Use this file to continue work on later phases.

---

## Target Architecture (Extensible)

Use a structure that can grow without big refactors:

- **App:** `AppModule` imports GraphQL + feature modules.
- **Feature modules:** `UserModule`, `ProductModule`, `OrderModule`, `AuthModule` (later).
- **Shared/common:** `PrismaModule`, `ConfigModule`, `LoadersModule`, `GuardsModule` (later).
- **Future add-ons:** Redis, BullMQ/Kafka, Winston, Prometheus.

**Folder layout:**

- `src/modules/` — user, product, order, auth (one folder per domain)
- `src/common/` — config, prisma, loaders, guards (reusable across modules)

---

## Mini Phases (Step-by-Step)

### Phase 1 — Done

- GraphQL + Apollo configured; Playground works. GraphQL config in `src/common/config/graphql.config.ts`.

### Phase 2 — Done

- User, Product, Order modules with resolvers, services, entities, DTOs. Queries: `users`, `user(id)`, `products`, `product(id)`, `orders`, `order(id)`.

### Phase 3 — Database with Prisma

| Step    | What |
| ------- | ---- |
| **3.1** | Install Prisma; add `PrismaService` in `src/common/prisma/`, `PrismaModule` (global); register in `AppModule`. |
| **3.2** | Define schema: User, Product, Order, OrderItem (many-to-many Order–Product). **Current: MongoDB** (Prisma 6.19). |
| **3.3** | MongoDB: `npx prisma db push` and `npx prisma generate` (no migrations). SQLite/Postgres: `npx prisma migrate dev`. |
| **3.4** | Replace in-memory logic in User, Product, Order services with Prisma. Add `findByUserIds` on OrderService for Phase 5. Do not expose `password` in GraphQL. |
| **3.5** | Seed: `npx prisma db seed`. **MongoDB:** Writes require a [replica set](https://www.prisma.io/docs/orm/overview/databases/mongodb#run-mongodb-as-a-replica-set) (use Atlas or `mongod --replSet rs0`). |

### Phase 4 — GraphQL relations and nested queries — Done

| Step    | What |
| ------- | ---- |
| **4.1** | User resolver: `@ResolveField(() => [Order])` for `orders`; use `orderService.findByUser(user.id)`. |
| **4.2** | Order resolver: `@ResolveField` for `user` and for `products` (via OrderItems). |
| **4.3** | Schema has `User.orders`, `Order.user`, `Order.products` (via ResolveField; no circular entity imports). |

### Phase 5 — N+1 fix with DataLoader

| Step    | What |
| ------- | ---- |
| **5.1** | Install dataloader; create `OrderLoader` (batch by userIds). |
| **5.2** | Register loader; in User resolver `orders` use DataLoader instead of direct service call. |
| **5.3** | (Optional) ProductLoader for orders → products. |

### Phase 6 — Authentication (JWT)

| Step    | What |
| ------- | ---- |
| **6.1** | Install @nestjs/jwt, passport-jwt; AuthModule + AuthService; register + login (bcrypt, JWT); ConfigModule for env. |
| **6.2** | JwtStrategy + GqlAuthGuard; attach user to context. |
| **6.3** | login/register mutations; protect resolvers with @UseGuards(GqlAuthGuard). |

### Phase 7 — Role-based access

| Step    | What |
| ------- | ---- |
| **7.1** | RolesGuard; @Roles('ADMIN','STAFF') metadata. |
| **7.2** | Apply to createProduct, “view all orders”; users see only their data. |

### Phase 8 — Order placement

| Step    | What |
| ------- | ---- |
| **8.1** | createOrder mutation: userId, productIds[]; validate, fetch products, total, create Order + OrderItems in transaction. |
| **8.2** | Return order; resolve user/products via existing resolvers. |

### Phase 9 — Production / enterprise (optional)

| Step    | What |
| ------- | ---- |
| **9.1** | Config: ConfigService for DB URL, JWT secret. |
| **9.2** | Validation: class-validator, ValidationPipe. |
| **9.3** | Caching: Redis. |
| **9.4** | Queue: BullMQ for async (e.g. order confirmation). |
| **9.5** | Logging: Winston / Nest Logger. |
| **9.6** | Health: @nestjs/terminus; Prometheus later. |

---

## Suggested order of work

1. Phase 2 (done) → Phase 3 (Prisma) → Phase 4 (relations) → Phase 5 (DataLoader) → Phase 6 (auth) → Phase 7 (roles) → Phase 8 (create order).
2. Add Phase 9 items incrementally.

# 🏪 Rotana Store

> Warehouse & Store Management Platform — B2C + B2B Commerce

Built by [Alnoor Labs](https://alnorlabs.com) for Rotana.

---

## 🏗️ Architecture

Turborepo monorepo with 3 applications and shared packages:

```
apps/
  web/      → Next.js 16 (App Router) — Admin dashboards + Customer portals
  api/      → NestJS — REST API backend
  mobile/   → React Native (Expo) — Mobile app
packages/
  shared/   → Shared types, Zod schemas, utils, constants
```

## 🛠️ Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Frontend     | Next.js 16, React 19, TypeScript        |
| Backend      | NestJS, TypeScript                      |
| Database     | PostgreSQL via Supabase                 |
| ORM          | Prisma                                  |
| Auth         | Supabase Auth + JWT                     |
| UI           | shadcn/ui, Tailwind CSS 4, Lucide Icons |
| State        | Zustand + TanStack React Query          |
| Payments     | Razorpay                                |
| Mobile       | React Native (Expo)                     |
| CI/CD        | GitHub Actions → Vercel                 |

## 📦 Modules

| Module              | Status     | Description                                    |
| ------------------- | ---------- | ---------------------------------------------- |
| Auth & RBAC         | 🔲 Planned | Login, register, 8-role access control         |
| Product Catalog     | 🔲 Planned | SKU master, categories, search                 |
| B2C Commerce        | 🔲 Planned | Browse, cart, checkout, payment, tracking       |
| B2B Commerce        | 🔲 Planned | Credit lines, invoicing, due-bill management   |
| Warehouse           | 🔲 Planned | PO, GRN, stock transfer, low stock alerts      |
| Store / POS         | 🔲 Planned | Shelf stock, quick sale, order packing          |
| Inventory           | 🔲 Planned | Multi-location, FIFO, batch expiry             |
| Supplier Portal     | 🔲 Planned | PO view, invoice upload, payment tracking      |
| Salesman Dashboard  | 🔲 Planned | Visits, orders, commission, collections        |
| Delivery Management | 🔲 Planned | Fleet management, assignment, tracking         |
| Payroll             | 🔲 Planned | Salary, attendance, commission, payslips       |
| Invoicing / Finance | 🔲 Planned | GST invoices, credit notes, cash flow          |

## 🚀 Quick Start

```bash
# Prerequisites: Node.js ≥ 20, pnpm ≥ 9

# Clone and install
git clone <repo-url>
cd ROTANA-WEB-APP
pnpm install

# Setup environment
cp .env.example .env.local
# Fill in values from Google Chat pinned message

# Start development
pnpm dev
```

See [docs/SETUP.md](docs/SETUP.md) for detailed setup instructions.

## 👥 Team

| Member  | Role                   | Focus Area                    |
| ------- | ---------------------- | ----------------------------- |
| Ayeen   | PM + Backend Lead      | API, Auth, DB, DevOps         |
| Rahmath | Backend Developer      | Inventory, Invoicing, Payroll |
| Faizan  | Frontend Developer     | B2C portal, Checkout UI       |
| Najeeb  | Frontend Developer     | Admin dashboards              |
| Zaka    | React Native Developer | Mobile app                    |

## 📖 Documentation

| Document                                            | Description                          |
| --------------------------------------------------- | ------------------------------------ |
| [CONTRIBUTING.md](CONTRIBUTING.md)                   | Team workflow, PR process, AI rules  |
| [PROJECT_CANON.md](PROJECT_CANON.md)                 | Stack rules, naming, patterns        |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md)             | Code examples and conventions        |
| [docs/SETUP.md](docs/SETUP.md)                       | Local development setup              |
| [docs/SPRINT_PLAN.md](docs/SPRINT_PLAN.md)           | 8-week development roadmap           |
| [docs/TEAM_MATRIX.md](docs/TEAM_MATRIX.md)           | Module ownership & review buddies    |
| [docs/BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md) | GitHub branch protection setup    |
| [docs/adr/](docs/adr/)                               | Architecture Decision Records        |

## 📋 Git Workflow

We use **GitFlow**: `main` → `develop` → `feature/ROT-*` branches.
See [CONTRIBUTING.md](CONTRIBUTING.md) for full details.

---

*© 2026 Alnoor Labs — Confidential & Proprietary*

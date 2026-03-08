# Rotana Store

> Warehouse & Store Management Platform — built by Alnoor Labs for Rotana.

A unified, web-based operations platform for a grocery warehouse / dark store model. Handles everything from inbound purchase orders, inventory management, and B2C/B2B customer ordering, through to delivery, invoicing, salesman commissions, and staff payroll.

---

## Tech Stack

| Layer           | Technology                           |
| --------------- | ------------------------------------ |
| Framework       | Next.js 15 (App Router)              |
| Language        | TypeScript 5 (strict mode)           |
| UI              | shadcn/ui + Tailwind CSS 4           |
| Database        | PostgreSQL via Supabase + Prisma ORM |
| Auth            | Supabase Auth + JWT Bearer token     |
| State           | Zustand + TanStack React Query       |
| Payments        | Razorpay / Stripe                    |
| File Storage    | Cloudflare R2                        |
| Hosting         | Vercel                               |
| Package Manager | pnpm                                 |

> **API Design**: All backend logic runs as Next.js Route Handlers (`app/api/v1/`). These APIs are REST-first and mobile-ready — the Rotana mobile app (separate repository) consumes these same endpoints.

---

## Quick Start

```bash
# 1. Clone & install
git clone https://github.com/<org>/ROTANA-WEB-APP.git
cd ROTANA-WEB-APP
pnpm install

# 2. Environment variables
cp .env.example .env.local
# Fill in values from Google Chat pinned message

# 3. Database
pnpm db:generate
pnpm db:migrate
pnpm db:seed

# 4. Start dev server
pnpm dev
# → http://localhost:3000 (web + API on the same server)
```

See [docs/SETUP.md](docs/SETUP.md) for the complete setup guide.

---

## Documentation

| Document                                                 | Purpose                                      |
| -------------------------------------------------------- | -------------------------------------------- |
| [docs/SETUP.md](docs/SETUP.md)                           | Local development setup                      |
| [CONTRIBUTING.md](CONTRIBUTING.md)                       | Team workflow, branching, commit conventions |
| [docs/CODE_STYLE.md](docs/CODE_STYLE.md)                 | Code patterns with examples                  |
| [docs/API_CONVENTIONS.md](docs/API_CONVENTIONS.md)       | API Route Handler patterns and standards     |
| [.rules/PROJECT_CANON.md](.rules/PROJECT_CANON.md)       | Tech stack, folder structure, naming rules   |
| [docs/BRANCH_PROTECTION.md](docs/BRANCH_PROTECTION.md)   | GitHub branch protection setup               |
| [docs/Rotana_SRD_v1.docx.md](docs/Rotana_SRD_v1.docx.md) | Software Requirements Document               |

---

## User Roles

| Role              | Access                                           |
| ----------------- | ------------------------------------------------ |
| Super Admin       | Full system — all dashboards, approvals, reports |
| Warehouse Manager | Inbound stock, GRN, bin assignment, dispatch     |
| Store Manager     | POS, shelf stock, order fulfillment              |
| Supplier          | View POs, upload invoices, track payments        |
| Salesman          | B2B order creation, commission tracking          |
| B2C Customer      | Browse, order, pay online, track delivery        |
| B2B Buyer         | Order on credit, view invoices, pay dues         |
| Delivery Staff    | View delivery assignments, mark delivered        |

---

## Team

| Member  | Role                            | Repo          |
| ------- | ------------------------------- | ------------- |
| Ayeen   | PM + Backend                    | This repo     |
| Rahmath | Backend Developer               | This repo     |
| Faizan  | Frontend Developer              | This repo     |
| Najeeb  | Frontend Developer              | This repo     |
| Zaka    | Mobile Developer (React Native) | Separate repo |

---

_Built by Alnoor Labs — Confidential & Proprietary_

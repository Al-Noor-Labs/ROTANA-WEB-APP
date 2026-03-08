# 60-Day Sprint Plan — Rotana Store

> **Methodology**: Kanban with weekly sprints (8 sprints × ~7 days)
> **Start Date**: TBD (after team onboarding)
> **Team**: 4 members (2 FE, 2 BE) — mobile app deferred to v2.0 (separate repo)

---

## Sprint Overview

| Sprint | Dates  | Theme                            | Milestone                    |
| ------ | ------ | -------------------------------- | ---------------------------- |
| **S1** | Week 1 | Foundation & Auth                | ✅ Repo ready, Auth working  |
| **S2** | Week 2 | Product Catalog & Browse         | ✅ Products visible to users |
| **S3** | Week 3 | Cart, Checkout & Payment         | ✅ B2C can purchase          |
| **S4** | Week 4 | Warehouse & Inventory            | ✅ Stock management live     |
| **S5** | Week 5 | Store, POS & B2B Registration    | ✅ Store operations ready    |
| **S6** | Week 6 | B2B Credit, Invoicing & Supplier | ✅ B2B flow complete         |
| **S7** | Week 7 | Delivery, Salesman & Payroll     | ✅ All modules functional    |
| **S8** | Week 8 | Testing, Polish & Deploy         | 🚀 Production launch         |

---

## Sprint S1 — Foundation & Auth (Week 1)

> **Goal**: Next.js project structure verified. Auth flow working end-to-end. DB schema for core entities.

### Backend (Ayeen + Rahmath)

| Task                                                                | Assignee        | Priority | Est  |
| ------------------------------------------------------------------- | --------------- | -------- | ---- |
| Verify Next.js project structure per PROJECT_CANON.md               | Ayeen           | P0       | 0.5d |
| Setup API Route Handlers scaffold (`app/api/v1/`)                   | Ayeen           | P0       | 0.5d |
| Configure Prisma + Supabase connection                              | Ayeen           | P0       | 0.5d |
| Design & create core DB schema (users, roles, products, categories) | Ayeen + Rahmath | P0       | 1d   |
| Implement Supabase Auth integration                                 | Ayeen           | P0       | 1d   |
| Implement RBAC guards (withAuth, withRole middleware)               | Rahmath         | P0       | 1d   |
| Setup Zod schemas in `lib/schemas/`                                 | Rahmath         | P1       | 0.5d |
| Configure CI/CD pipeline                                            | Ayeen           | P1       | 0.5d |

### Frontend (Faizan + Najeeb)

| Task                                        | Assignee | Priority | Est  |
| ------------------------------------------- | -------- | -------- | ---- |
| Setup shadcn/ui component library           | Najeeb   | P0       | 0.5d |
| Build login / register pages                | Faizan   | P0       | 1d   |
| Build admin layout (sidebar, header, nav)   | Najeeb   | P0       | 1d   |
| Build customer layout (header, footer, nav) | Faizan   | P1       | 1d   |
| Setup Zustand stores (auth, UI state)       | Najeeb   | P1       | 0.5d |
| Setup React Query provider + API client     | Faizan   | P1       | 0.5d |

### Sprint S1 Deliverable

- [ ] Single Next.js app running with `pnpm dev`
- [ ] Users can register and login
- [ ] Admin and customer layouts rendered
- [ ] RBAC working (admin vs customer access)
- [ ] CI pipeline running on PRs

---

## Sprint S2 — Product Catalog & Browse (Week 2)

> **Goal**: Product CRUD for admin. Product browse/search for customers.

### Backend (Ayeen + Rahmath)

| Task                                              | Assignee | Priority | Est  |
| ------------------------------------------------- | -------- | -------- | ---- |
| Products CRUD API (create, read, update, delete)  | Rahmath  | P0       | 1.5d |
| Categories CRUD API                               | Rahmath  | P0       | 0.5d |
| Product search + filter API (pagination, sorting) | Ayeen    | P0       | 1d   |
| Image upload to Supabase Storage                  | Ayeen    | P1       | 0.5d |
| SKU master + HSN code support                     | Rahmath  | P1       | 0.5d |
| Seed script for sample products                   | Rahmath  | P2       | 0.5d |

### Frontend (Faizan + Najeeb)

| Task                                         | Assignee | Priority | Est |
| -------------------------------------------- | -------- | -------- | --- |
| Product catalog page (grid, search, filters) | Faizan   | P0       | 2d  |
| Product detail page                          | Faizan   | P0       | 1d  |
| Admin: Product management table (CRUD UI)    | Najeeb   | P0       | 2d  |
| Admin: Category management                   | Najeeb   | P1       | 1d  |

---

## Sprint S3 — Cart, Checkout & Payment (Week 3)

> **Goal**: Complete B2C purchase flow from cart to payment confirmation.

### Backend

| Task                                        | Assignee | Priority | Est  |
| ------------------------------------------- | -------- | -------- | ---- |
| Cart API (add, remove, update quantity)     | Ayeen    | P0       | 1d   |
| Order creation API + ID generation          | Ayeen    | P0       | 1d   |
| Razorpay integration + payment verification | Ayeen    | P0       | 1.5d |
| Order status management API                 | Rahmath  | P0       | 1d   |
| Email notifications (order confirmation)    | Rahmath  | P2       | 0.5d |

### Frontend

| Task                                    | Assignee | Priority | Est  |
| --------------------------------------- | -------- | -------- | ---- |
| Cart page (items, quantities, totals)   | Faizan   | P0       | 1.5d |
| Checkout flow (address, payment method) | Faizan   | P0       | 2d   |
| Order confirmation page                 | Faizan   | P0       | 0.5d |
| Order history page                      | Faizan   | P1       | 1d   |
| Admin: Orders dashboard                 | Najeeb   | P0       | 2d   |

---

## Sprint S4 — Warehouse & Inventory (Week 4)

> **Goal**: Warehouse operations digitized. Real-time inventory tracking.

### Backend

| Task                                       | Assignee | Priority | Est  |
| ------------------------------------------ | -------- | -------- | ---- |
| Inventory module (multi-location tracking) | Rahmath  | P0       | 2d   |
| Purchase Order (PO) API                    | Rahmath  | P0       | 1d   |
| Goods Received Note (GRN) API              | Ayeen    | P0       | 1d   |
| Stock transfer API (warehouse → store)     | Ayeen    | P0       | 1d   |
| Low stock alerts                           | Rahmath  | P1       | 0.5d |

### Frontend

| Task                                       | Assignee | Priority | Est  |
| ------------------------------------------ | -------- | -------- | ---- |
| Warehouse dashboard (stats, stock levels)  | Najeeb   | P0       | 2d   |
| PO management UI                           | Najeeb   | P0       | 1.5d |
| GRN recording UI                           | Najeeb   | P0       | 1d   |
| Inventory overview (admin, cross-location) | Najeeb   | P1       | 1d   |
| Order tracking page (customer)             | Faizan   | P1       | 1d   |

---

## Sprint S5 — Store, POS & B2B Registration (Week 5)

> **Goal**: Store dashboard live. B2B registration and approval flow.

### Backend

| Task                                      | Assignee | Priority | Est  |
| ----------------------------------------- | -------- | -------- | ---- |
| Store inventory sync API                  | Rahmath  | P0       | 1d   |
| POS (Point of Sale) API — quick sale flow | Rahmath  | P0       | 1d   |
| B2B registration API + document upload    | Ayeen    | P0       | 1d   |
| B2B approval workflow API                 | Ayeen    | P0       | 1d   |
| Cash reconciliation API                   | Rahmath  | P1       | 0.5d |

### Frontend

| Task                                       | Assignee | Priority | Est  |
| ------------------------------------------ | -------- | -------- | ---- |
| Store dashboard (shelf stock, order queue) | Najeeb   | P0       | 2d   |
| POS interface (quick sale)                 | Najeeb   | P0       | 1.5d |
| B2B registration form (with doc upload)    | Faizan   | P0       | 1.5d |
| Admin: B2B approval/rejection UI           | Najeeb   | P1       | 1d   |

---

## Sprint S6 — B2B Credit, Invoicing & Supplier (Week 6)

> **Goal**: Full B2B workflow (credit, invoicing, payments). Supplier portal.

### Backend

| Task                                         | Assignee | Priority | Est  |
| -------------------------------------------- | -------- | -------- | ---- |
| Credit line management API                   | Ayeen    | P0       | 1.5d |
| GST-compliant invoice generation             | Ayeen    | P0       | 2d   |
| Due bill tracking API                        | Rahmath  | P0       | 1d   |
| Supplier module API (PO, invoices, payments) | Rahmath  | P0       | 1.5d |
| Payment recording API                        | Rahmath  | P1       | 0.5d |

### Frontend

| Task                                        | Assignee | Priority | Est  |
| ------------------------------------------- | -------- | -------- | ---- |
| B2B buyer portal (orders, credit, invoices) | Faizan   | P0       | 2.5d |
| Admin: Credit management dashboard          | Najeeb   | P0       | 1.5d |
| Admin: Invoice & due bills dashboard        | Najeeb   | P0       | 1.5d |
| Supplier portal UI                          | Faizan   | P1       | 1.5d |

---

## Sprint S7 — Delivery, Salesman & Payroll (Week 7)

> **Goal**: All remaining modules functional. Feature-complete.

### Backend

| Task                                     | Assignee | Priority | Est  |
| ---------------------------------------- | -------- | -------- | ---- |
| Delivery management API (assign, status) | Ayeen    | P0       | 1.5d |
| Salesman module API (visits, commission) | Rahmath  | P0       | 1.5d |
| Payroll module API (salary, attendance)  | Rahmath  | P0       | 2d   |
| Payslip PDF generation                   | Ayeen    | P1       | 1d   |

### Frontend

| Task                                  | Assignee | Priority | Est  |
| ------------------------------------- | -------- | -------- | ---- |
| Delivery management dashboard         | Najeeb   | P0       | 2d   |
| Delivery staff view (mobile-friendly) | Faizan   | P0       | 1d   |
| Salesman dashboard                    | Najeeb   | P0       | 2d   |
| Payroll dashboard                     | Najeeb   | P1       | 1.5d |
| Return/refund flow UI                 | Faizan   | P1       | 1d   |

---

## Sprint S8 — Testing, Polish & Deploy (Week 8)

> **Goal**: Production-ready. All bugs fixed. Performance optimized.

### All Team

| Task                                       | Assignee | Priority | Est  |
| ------------------------------------------ | -------- | -------- | ---- |
| End-to-end testing of all user flows       | All      | P0       | 2d   |
| Fix all P0 and P1 bugs                     | All      | P0       | 2d   |
| Performance optimization (Lighthouse ≥ 90) | Faizan   | P1       | 1d   |
| Security audit (OWASP checklist)           | Ayeen    | P0       | 1d   |
| API documentation (Swagger/OpenAPI)        | Rahmath  | P1       | 1d   |
| Production environment setup               | Ayeen    | P0       | 0.5d |
| Production deployment                      | Ayeen    | P0       | 0.5d |
| User acceptance testing with client        | All      | P0       | 1d   |
| Documentation cleanup                      | Rahmath  | P2       | 0.5d |

---

## Key Milestones

| Date   | Milestone                                 | Gate Criteria                    |
| ------ | ----------------------------------------- | -------------------------------- |
| End W1 | **Auth & Foundation**                     | Login works, CI running          |
| End W3 | **B2C MVP** (browse, cart, checkout, pay) | Customer can place real order    |
| End W5 | **Warehouse + Store Operational**         | Stock tracked, POS works         |
| End W6 | **B2B Complete**                          | Credit, invoicing, supplier done |
| End W7 | **Feature Complete**                      | All 11 modules built             |
| End W8 | **🚀 Production Launch**                  | Client signoff, zero P0 bugs     |

---

## Risk Register

| Risk                                                          | Impact | Mitigation                                             |
| ------------------------------------------------------------- | ------ | ------------------------------------------------------ |
| Client delays on open items (GST slabs, commission structure) | High   | Send reminder at S1, block specific features if needed |
| Razorpay integration complexity                               | Medium | Spike in S2, implement in S3                           |
| GST invoice compliance rules unclear                          | Medium | Research in S1, consult with CA                        |
| Scope creep from client                                       | High   | Refer to SRD, use change request process               |

---

_Maintained by Ayeen (PM). Updated at every sprint review._

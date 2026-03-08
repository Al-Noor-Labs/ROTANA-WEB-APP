**ROTANA STORE**

Warehouse & Store Management Platform

*Software Requirements Document  (SRD)*

| Field | Details |
| :---- | :---- |
| **Client** | Rotana (Grocery Warehouse / Dark Store) |
| **Prepared by** | Alnoor Labs |
| **Document Type** | Software Requirements Document (SRD) |
| **Version** | 1.1 — Updated |
| **Date** | March 2026 |
| **Status** | For Client Review |

# **1\. Executive Summary**

Rotana operates a grocery warehouse / dark store model serving two distinct customer segments: direct end consumers (B2C) and registered business buyers (B2B). Alnoor Labs has been engaged to design and deliver a unified, web-based platform that digitises every operational layer — from warehouse receiving and inventory tracking through to customer delivery, invoicing, credit management, and staff payroll.

*This document defines the functional scope, module breakdown, user roles, and technical approach agreed upon in the discovery session. It serves as the baseline for project estimation, timeline planning, and future change requests.*

# **2\. Project Scope**

## **2.1  In Scope**

* Web application — Admin & operational dashboards (desktop-first)

* B2C customer ordering with online payment (Razorpay / Stripe)

* B2B ordering with manual credit line approval and invoice-based billing

* Warehouse, store, supplier, and salesman dashboards

* Full inventory and stock management

* Own delivery fleet management

* Payroll module for staff & salesman commission tracking

* Invoice, due-bill, and receipt generation

* Unique ID generation for customers, businesses, and orders

* Role-based access control (RBAC) for all dashboards

* REST APIs designed for consumption by both the web application and the future Rotana mobile app

## **2.2  Out of Scope (v1.0)**

* Mobile application (iOS / Android) — Deferred to v2.0; being developed in a **separate repository** by the mobile team. All APIs in this platform are designed mobile-ready from day one.

* WhatsApp / chatbot ordering

* Third-party delivery integration (Dunzo, Porter, etc.)

* Automated credit scoring or AI-based demand forecasting

# **3\. Stakeholders & User Roles**

| Role | Dashboard | Primary Responsibilities |
| :---- | :---- | :---- |
| Super Admin (Rotana Owner) | All dashboards | Full system access, approvals, reports |
| Warehouse Manager | Warehouse Dashboard | Inbound stock, storage, dispatch to store |
| Store Manager | Store Dashboard | Retail shelf stock, order fulfillment, POS |
| Supplier | Supplier Dashboard | Raise purchase orders, submit invoices, track payments |
| Salesman | Salesman Dashboard | Customer visits, order creation, commission tracking |
| B2C Customer | Customer Portal | Browse, order, pay online, track delivery |
| B2B Business Buyer | B2B Portal | Order on credit, view credit limit, pay dues |
| Delivery Staff | Delivery View | View assigned deliveries, mark delivered |

# **4\. Module Breakdown**

## **4.1  Warehouse Dashboard**

The warehouse is the operational backbone of Rotana. This dashboard manages all inbound goods from suppliers, internal stock movement, and outbound dispatch to the store.

* Inbound Purchase Order (PO) management — raise PO to suppliers

* Goods Received Note (GRN) — mark receipt, quantity check, quality flag

* Bin / rack location assignment for each SKU

* Inter-location stock transfer (warehouse → store)

* Low stock alerts and reorder threshold configuration

* Wastage / damage logging

* Full audit log of every stock movement

## **4.2  Store Dashboard**

The store-facing dashboard handles retail-level operations including walk-in POS, stock visibility, and order dispatch for both B2C and B2B orders.

* Real-time shelf stock view (synced with warehouse)

* Walk-in POS — quick sale with receipt generation

* Order queue — incoming B2C / B2B orders assigned for packing

* Packing confirmation and handover to delivery staff

* Daily sales summary and cash reconciliation

## **4.3  Supplier Dashboard**

Suppliers get a dedicated portal to interact with Rotana without requiring manual communication.

* View open Purchase Orders raised by Rotana

* Upload invoices against POs

* Track payment status (due, paid, partial)

* Delivery challan submission

* Product / price catalogue management

## **4.4  Salesman Dashboard**

Salesmen operate in the field, acquiring and servicing B2B accounts. Their dashboard tracks visits, orders, and earnings.

* Assigned customer / business account list

* Create orders on behalf of B2B buyers during visits

* Track order status and delivery updates for their accounts

* Commission ledger — per-order commission, monthly summary

* Collection tracking — record cash/cheque collected from B2B buyers

* Performance report (orders placed, GMV, collection vs outstanding)

## **4.5  Inventory & Stock Management**

A unified inventory layer that spans warehouse and store, providing real-time visibility across all locations.

* Centralised SKU master — product name, category, unit, HSN code, MRP

* Multi-location stock tracking (warehouse, store, in-transit)

* FIFO / batch expiry tracking for perishables

* Automatic stock deduction on confirmed orders

* Stock adjustment module — shrinkage, damage, corrections

* Inventory valuation report (COGS, current value)

* Supplier-wise purchase history and pricing trends

## **4.6  B2C — Direct Customer Commerce**

Direct consumers access Rotana via a customer-facing web portal. All orders are prepaid and fulfilled through Rotana's own delivery fleet.

* Customer registration with unique customer ID generation

* Product catalogue with categories, search, and filters

* Cart and checkout flow

* Online payment via Razorpay / Stripe (UPI, card, net banking)

* Order confirmation with estimated delivery window

* Real-time order tracking (confirmed → packed → out for delivery → delivered)

* Order history and downloadable receipts

* Return / refund request flow

## **4.7  B2B — Business Buyer Commerce**

Registered business buyers (restaurants, retailers, caterers, etc.) can order on credit. Credit lines are manually approved and managed by the Rotana admin.

* Business registration with unique B2B ID, GST number, and business documents

* Admin reviews and approves/rejects B2B registration

* Credit line configuration per business — limit amount, payment terms (e.g., 30/45/60 days)

* Order placement against available credit balance

* Invoice generation per order (GST-compliant)

* Due bill tracker — outstanding invoices, due dates, aging

* Payment recording — partial / full payments against invoices

* Automated overdue alerts to buyer and admin

* Statement of account for each B2B buyer

## **4.8  ID Generation System**

All entities in the system receive a unique, traceable identifier for easy reference and audit.

| Entity | Format Example | Generated At |
| :---- | :---- | :---- |
| B2C Customer | CUS-2026-00001 | On registration |
| B2B Business | BIZ-2026-00001 | On admin approval |
| Order (B2C) | ORD-B2C-0000001 | On checkout |
| Order (B2B) | ORD-B2B-0000001 | On order placement |
| Invoice | INV-2026-00001 | On order confirmation |
| Purchase Order | PO-2026-00001 | On warehouse PO raise |
| Salesman | SAL-2026-001 | On staff onboarding |
| Delivery | DEL-2026-00001 | On dispatch |

## **4.9  Delivery Management (Own Fleet)**

Rotana operates its own delivery fleet. The platform manages delivery staff, assigns orders, and tracks deliveries end-to-end.

* Delivery staff profiles with assigned zone / area

* Order-to-delivery staff assignment (manual or by zone)

* Delivery manifest — list of all orders for a delivery run

* Delivery status updates — out for delivery, delivered, failed attempt

* Proof of delivery — signature / photo capture (future phase)

* Delivery performance report per staff member

## **4.10  Payroll Module**

The payroll module handles monthly salary processing for all staff categories including warehouse, store, delivery, and admin staff.

* Employee master — profile, designation, salary structure, bank details

* Attendance integration — mark daily attendance, calculate working days

* Salary computation — basic \+ allowances \+ deductions

* Salesman commission calculation — linked to orders closed in the period

* Payslip generation and download (PDF)

* Payroll run history and approval workflow

## **4.11  Invoice, Due Bills & Finance**

A finance layer that gives Rotana full visibility into receivables, payables, and cash flow.

* GST-compliant invoice generation for every B2B and B2C order

* Credit note generation for returns / refunds

* Due bills dashboard — all outstanding amounts, sorted by aging (0–30, 30–60, 60+ days)

* Supplier payment tracking — amounts owed to each supplier

* Daily cash flow summary — collections vs payouts

* Export all reports to Excel / PDF

# **5\. Cross-Cutting Features**

* Role-Based Access Control (RBAC) — each role sees only what they need

* Audit logs — every create / update / delete action is logged with user and timestamp

* Notifications — in-app and email alerts for critical events (low stock, overdue payments, new registrations)

* Search and advanced filters across all modules

* Excel / PDF export for all reports and tables

* Multi-device responsive web design (desktop-first, tablet-compatible)

* API-first design — all functionality exposed via REST API endpoints usable by the Rotana mobile app (separate repository)

# **6\. Proposed Technical Stack**

| Module | Technology |
| :---- | :---- |
| **Frontend** | Next.js 15 (App Router), React, TypeScript, Tailwind CSS 4, shadcn/ui |
| **Backend API** | Next.js 15 App Router — Route Handlers (`app/api/v1/**`), TypeScript, Zod validation |
| **Database** | PostgreSQL via Supabase (relational, row-level security for RBAC), Prisma ORM |
| **Auth** | Supabase Auth (session cookies for web) + JWT Bearer token (for API / mobile consumers) |
| **Payments** | Razorpay or Stripe — B2C checkout, webhook-based payment confirmation |
| **File Storage** | Cloudflare R2 — invoices, payslips, supplier documents, delivery proofs |
| **State Mgmt** | Zustand (client state) + TanStack React Query (server state / data fetching) |
| **Hosting** | Vercel — hosts both the Next.js web app and API Route Handlers |
| **CI/CD** | GitHub Actions — lint → type-check → build → test → deploy |
| **Security** | Next.js middleware (auth, CORS), Zod input validation, Supabase RLS, rate limiting |
| **Package Manager** | pnpm |
| **Logging** | Pino (structured JSON logs) |

> **API-First Architecture Note**: All backend logic is implemented as versioned REST API Route Handlers (`/api/v1/...`). These routes are stateless and accept both session cookies (web browser) and Bearer token authentication (for future mobile app consumption). The Rotana mobile app (React Native, separate repository) will consume these same API endpoints in v2.0 without requiring any API refactoring.

# **7\. Assumptions & Dependencies**

* Client will provide product catalogue data (names, SKUs, prices) in Excel format for initial import.

* GST configuration (tax slabs per product category) will be provided by the client before billing module development begins.

* Razorpay / Stripe account will be registered by the client; Alnoor Labs will handle integration.

* Delivery zones and staff assignment logic will be defined by the client before delivery module build.

* Salesman commission structure (flat rate vs percentage vs tiered) to be confirmed by client.

* B2B credit terms (payment window, overdue penalty rules) to be provided in writing before B2B module build.

# **8\. Open Items for Client Confirmation**

| \# | Open Item | Impact |
| :---- | :---- | :---- |
| 1 | GST tax slab mapping per product category | Invoice & billing module |
| 2 | Salesman commission structure (flat / % / tiered) | Payroll & salesman dashboard |
| 3 | Credit line default terms for B2B (payment days, penalty) | B2B module |
| 4 | Delivery zone map and max radius | Delivery management |
| 5 | Number of salesman / delivery staff at launch | Payroll sizing |
| 6 | Required payment gateway — Razorpay or Stripe | Payment integration |
| 7 | Do B2B buyers need a self-service portal or admin-only order entry? | B2B UX scope |
| 8 | Multi-branch expansion planned (future)? | Architecture decisions |

# **9\. Next Steps**

| Step | Action | Owner |
| :---- | :---- | :---- |
| 1 | Client reviews and signs off on this SRD | Rotana |
| 2 | Resolve all Open Items (Section 8\) | Rotana \+ Alnoor Labs |
| 3 | Alnoor Labs prepares detailed project estimate and timeline | Alnoor Labs |
| 4 | UI/UX wireframes — dashboard layouts and key user flows | Alnoor Labs |
| 5 | Project kickoff and sprint planning | Both |

*Document prepared by Alnoor Labs — Confidential & Proprietary*
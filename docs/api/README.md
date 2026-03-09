# Rotana Store — API Reference (v1)

> **Base URL:** `http://localhost:3000/api/v1`
>
> **Postman Collection:** Import [rotana-api.postman_collection.json](./rotana-api.postman_collection.json) into Postman.

---

## Table of Contents

- [Authentication](#authentication)
- [Response Format](#response-format)
- [Role-Based Access Control](#role-based-access-control)
- [Endpoints](#endpoints)
  - [Auth](#1-auth)
  - [Users](#2-users)
  - [Products](#3-products)
  - [Categories](#4-categories)
  - [Orders](#5-orders)
  - [Deliveries](#6-deliveries)
  - [Inventory](#7-inventory)
  - [Locations](#8-locations)
  - [Suppliers](#9-suppliers)
  - [GRN](#10-grn-goods-received-notes)
  - [Transfers](#11-stock-transfers)
  - [Finance](#12-finance)
  - [Payroll](#13-payroll)
  - [Dashboard](#14-dashboard)
  - [Analytics](#15-analytics)

---

## Authentication

All protected endpoints require a **Bearer Token** in the `Authorization` header:

```
Authorization: Bearer <accessToken>
```

Tokens are obtained via `POST /auth/login` or `POST /auth/register`. Access tokens are short-lived; use `POST /auth/refresh` to rotate.

---

## Response Format

### Success (single resource)

```json
{
  "success": true,
  "data": { ... }
}
```

### Success (paginated list)

```json
{
  "success": true,
  "data": [ ... ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found.",
    "details": null
  }
}
```

**Error Codes:** `VALIDATION_ERROR` (422), `UNAUTHENTICATED` (401), `FORBIDDEN` (403), `NOT_FOUND` (404), `CONFLICT` (409), `INSUFFICIENT_STOCK` (422), `INTERNAL_ERROR` (500)

---

## Role-Based Access Control

| Group              | Roles                                                                        | Used By                                               |
| ------------------ | ---------------------------------------------------------------------------- | ----------------------------------------------------- |
| **ADMIN_ROLES**    | `SUPER_ADMIN`                                                                | User management, ledger account creation              |
| **MANAGER_ROLES**  | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`                          | Products, GRN, transfers, suppliers, inventory events |
| **STAFF_ROLES**    | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `STORE_MANAGER`, `CASHIER`, `ACCOUNTANT` | Orders, dashboard, finance ledger, inventory queries  |
| **DELIVERY_ROLES** | `SUPER_ADMIN`, `WAREHOUSE_MANAGER`, `DELIVERY_DRIVER`                        | Delivery management                                   |

**All Roles:** `SUPER_ADMIN` · `WAREHOUSE_MANAGER` · `STORE_MANAGER` · `CASHIER` · `SALESMAN` · `DELIVERY_DRIVER` · `ACCOUNTANT` · `CUSTOMER`

---

## Endpoints

### 1. Auth

| Method | Endpoint         | Auth   | Description                    |
| ------ | ---------------- | ------ | ------------------------------ |
| `POST` | `/auth/register` | Public | Register a new user            |
| `POST` | `/auth/login`    | Public | Login with email/password      |
| `POST` | `/auth/refresh`  | Public | Rotate access + refresh tokens |
| `GET`  | `/auth/me`       | Bearer | Get current user profile       |
| `POST` | `/auth/me`       | Bearer | Logout (delete refresh tokens) |

<details>
<summary><strong>POST /auth/register</strong></summary>

```json
{
  "name": "John Doe", // required, min 2 chars
  "email": "john@example.com", // required, unique
  "password": "SecureP@ss123", // required, min 8 chars
  "phone": "9876543210", // optional, min 10 chars
  "role": "CUSTOMER" // optional, default: CUSTOMER
}
```

**Allowed roles for self-registration:** `CUSTOMER`, `CASHIER`, `SALESMAN`, `DELIVERY_DRIVER`

**Response (201):** `{ success, data: { user, accessToken, refreshToken } }`

</details>

<details>
<summary><strong>POST /auth/login</strong></summary>

```json
{
  "email": "admin@rotana.com", // required
  "password": "SecureP@ss123" // required
}
```

**Response (200):** `{ success, data: { user, accessToken, refreshToken } }`

</details>

<details>
<summary><strong>POST /auth/refresh</strong></summary>

```json
{
  "refreshToken": "eyJhbG..." // required
}
```

**Response (200):** `{ success, data: { accessToken, refreshToken } }`

</details>

---

### 2. Users

| Method   | Endpoint     | Auth        | Description                |
| -------- | ------------ | ----------- | -------------------------- |
| `GET`    | `/users`     | ADMIN_ROLES | List all users             |
| `PATCH`  | `/users/:id` | ADMIN_ROLES | Update user                |
| `DELETE` | `/users/:id` | ADMIN_ROLES | Soft-delete (disable) user |

**Query params (GET):** `role` — filter by role enum

<details>
<summary><strong>PATCH /users/:id</strong></summary>

```json
{
  "name": "Updated Name", // optional
  "phone": "9876543210", // optional
  "role": "CASHIER", // optional, full role enum
  "isActive": true, // optional
  "password": "NewP@ss123" // optional, min 8 chars (hashed)
}
```

</details>

---

### 3. Products

| Method   | Endpoint         | Auth          | Description                  |
| -------- | ---------------- | ------------- | ---------------------------- |
| `GET`    | `/products`      | **Public**    | List products (paginated)    |
| `GET`    | `/products/:id`  | **Public**    | Get single product           |
| `POST`   | `/products`      | MANAGER_ROLES | Create product with variants |
| `PATCH`  | `/products/:id`  | MANAGER_ROLES | Update product               |
| `DELETE` | `/products/:id`  | MANAGER_ROLES | Soft-delete (DISCONTINUED)   |
| `POST`   | `/products/bulk` | MANAGER_ROLES | Bulk create products         |

**Query params (GET list):** `categoryId`, `search`, `page`, `limit`

<details>
<summary><strong>POST /products</strong></summary>

```json
{
  "categoryId": "uuid",
  "name": "Basmati Rice",
  "description": "Premium aged basmati",
  "brand": "Daawat",
  "imageUrl": "https://...",
  "images": [],
  "barcode": "8901234567890",
  "isPerishable": false,
  "tags": ["rice", "staples"],
  "variants": [
    {
      "sku": "RICE-BAS-1KG",
      "name": "1 Kg Pack",
      "unitValue": 1,
      "unitLabel": "kg",
      "costPrice": 80,
      "sellingPrice": 120,
      "mrp": 130,
      "taxRate": 5,
      "reorderLevel": 10
    }
  ]
}
```

**Required:** `categoryId`, `name`, `variants` (min 1)

</details>

---

### 4. Categories

| Method | Endpoint      | Auth          | Description                          |
| ------ | ------------- | ------------- | ------------------------------------ |
| `GET`  | `/categories` | **Public**    | List active categories with children |
| `POST` | `/categories` | MANAGER_ROLES | Create category                      |

<details>
<summary><strong>POST /categories</strong></summary>

```json
{
  "name": "Beverages", // required
  "description": "All drinks", // optional
  "imageUrl": "https://...", // optional
  "parentId": "parent-category-uuid" // optional (subcategory)
}
```

</details>

---

### 5. Orders

| Method  | Endpoint      | Auth        | Description                          |
| ------- | ------------- | ----------- | ------------------------------------ |
| `GET`   | `/orders`     | STAFF_ROLES | List orders (paginated, role-scoped) |
| `GET`   | `/orders/:id` | STAFF_ROLES | Get order details                    |
| `POST`  | `/orders`     | STAFF_ROLES | Create order (reserves inventory)    |
| `PATCH` | `/orders/:id` | STAFF_ROLES | Update status/payment                |

**Query params (GET list):** `status`, `orderType`, `customerId`, `page`, `limit`

> **Role scoping:** `SALESMAN` sees only assigned orders; `CUSTOMER` sees only their own.

<details>
<summary><strong>POST /orders</strong></summary>

```json
{
  "customerId": "uuid",
  "orderType": "B2C_DELIVERY", // required: B2C_DELIVERY | B2C_PICKUP | B2B_WHOLESALE | INTERNAL_TRANSFER
  "paymentMethod": "CASH", // CASH | CARD | UPI | BANK_TRANSFER | CREDIT
  "sourceLocationId": "warehouse-uuid",
  "deliveryAddressId": "address-uuid",
  "items": [
    // required, min 1
    { "variantId": "uuid", "quantity": 2 }
  ],
  "notes": "Deliver before 5 PM",
  "discountAmount": 0,
  "deliveryCharge": 50
}
```

</details>

<details>
<summary><strong>PATCH /orders/:id</strong></summary>

```json
{
  "status": "DELIVERED",
  "paymentStatus": "PAID",
  "paidAmount": 500,
  "gatewayRef": "txn_123",
  "notes": "Payment collected",
  "assignedToId": "salesman-uuid"
}
```

> On `DELIVERED`: inventory fulfilled, ledger entries posted, invoice auto-generated.
> On `CANCELLED`: reserved inventory released.

</details>

---

### 6. Deliveries

| Method  | Endpoint          | Auth           | Description              |
| ------- | ----------------- | -------------- | ------------------------ |
| `GET`   | `/deliveries`     | DELIVERY_ROLES | List deliveries          |
| `POST`  | `/deliveries`     | MANAGER_ROLES  | Assign delivery to order |
| `PATCH` | `/deliveries/:id` | DELIVERY_ROLES | Update delivery status   |

**Query params (GET):** `status`, `driverId`

> Drivers automatically see only their own deliveries.

<details>
<summary><strong>POST /deliveries</strong></summary>

```json
{
  "orderId": "order-uuid", // required
  "driverId": "driver-uuid", // optional
  "estimatedAt": "2026-03-10T15:00:00Z",
  "routeOrder": 1
}
```

</details>

<details>
<summary><strong>PATCH /deliveries/:id</strong></summary>

```json
{
  "status": "DELIVERED", // required: ASSIGNED | PICKED_UP | IN_TRANSIT | DELIVERED | FAILED | RETURNED
  "latitude": 12.9716,
  "longitude": 77.5946,
  "deliveryProof": "https://...",
  "failureReason": "",
  "notes": "Left with security"
}
```

> On `DELIVERED`: triggers full fulfillment (order → inventory → ledger → invoice).

</details>

---

### 7. Inventory

| Method | Endpoint     | Auth          | Description                  |
| ------ | ------------ | ------------- | ---------------------------- |
| `GET`  | `/inventory` | STAFF_ROLES   | Query stock levels           |
| `POST` | `/inventory` | MANAGER_ROLES | Apply manual inventory event |

**Query params (GET):** `locationId`, `variantId`, `lowStock` (true/false)

<details>
<summary><strong>POST /inventory</strong></summary>

```json
{
  "variantId": "uuid",
  "locationId": "uuid",
  "eventType": "STOCK_IN",
  "quantity": 100,
  "referenceId": "optional",
  "referenceType": "MANUAL",
  "notes": "Manual adjustment"
}
```

**Event types:** `STOCK_IN` · `STOCK_OUT` · `ADJUSTMENT` · `ORDER_RESERVED` · `ORDER_RELEASED` · `ORDER_FULFILLED` · `TRANSFER_IN` · `TRANSFER_OUT` · `DAMAGE_WRITE_OFF` · `RETURN_IN`

</details>

---

### 8. Locations

| Method | Endpoint     | Auth          | Description                     |
| ------ | ------------ | ------------- | ------------------------------- |
| `GET`  | `/locations` | **Public**    | List active locations with bins |
| `POST` | `/locations` | MANAGER_ROLES | Create location                 |

**Query params (GET):** `type` — `WAREHOUSE` · `STORE` · `DELIVERY_HUB`

<details>
<summary><strong>POST /locations</strong></summary>

```json
{
  "name": "Main Warehouse", // required
  "type": "WAREHOUSE", // required
  "code": "WH-001", // required
  "address": "123 Street", // optional
  "city": "Riyadh" // optional
}
```

</details>

---

### 9. Suppliers

| Method | Endpoint     | Auth          | Description           |
| ------ | ------------ | ------------- | --------------------- |
| `GET`  | `/suppliers` | STAFF_ROLES   | List active suppliers |
| `POST` | `/suppliers` | MANAGER_ROLES | Create supplier       |

**Query params (GET):** `search` — name or contact name

<details>
<summary><strong>POST /suppliers</strong></summary>

```json
{
  "name": "Al Marai Foods", // required
  "contactName": "Ahmed Khan",
  "phone": "+966501234567",
  "email": "ahmed@almarai.com",
  "address": "123 Supply St",
  "city": "Jeddah",
  "gstNumber": "GST12345",
  "panNumber": "PAN12345",
  "paymentTerms": 30, // default: 30 days
  "creditLimit": 50000
}
```

</details>

---

### 10. GRN (Goods Received Notes)

| Method | Endpoint | Auth          | Description                |
| ------ | -------- | ------------- | -------------------------- |
| `GET`  | `/grn`   | STAFF_ROLES   | List GRNs (paginated)      |
| `POST` | `/grn`   | MANAGER_ROLES | Create GRN + auto stock-in |

**Query params (GET):** `status`, `supplierId`, `page`, `limit`

<details>
<summary><strong>POST /grn</strong></summary>

```json
{
  "supplierId": "uuid",
  "locationId": "uuid",
  "invoiceRef": "INV-2026-001",
  "notes": "Weekly shipment",
  "items": [
    {
      "variantId": "uuid",
      "orderedQty": 100,
      "receivedQty": 95,
      "damagedQty": 3,
      "costPrice": 50.0,
      "expiryDate": "2026-12-31T00:00:00Z",
      "batchNumber": "BATCH-001"
    }
  ]
}
```

> Usable qty (`receivedQty - damagedQty`) is stocked in. Damaged items are written off. GRN transitions `RECEIVED → STOCKED` atomically.

</details>

---

### 11. Stock Transfers

| Method | Endpoint                  | Auth          | Description                      |
| ------ | ------------------------- | ------------- | -------------------------------- |
| `GET`  | `/transfers`              | STAFF_ROLES   | List all transfers               |
| `POST` | `/transfers`              | MANAGER_ROLES | Initiate inter-location transfer |
| `POST` | `/transfers/:id/complete` | STAFF_ROLES   | Receive transfer at destination  |

<details>
<summary><strong>POST /transfers</strong></summary>

```json
{
  "fromLocationId": "source-uuid",
  "toLocationId": "dest-uuid",
  "notes": "Restocking branch",
  "items": [{ "variantId": "uuid", "requestedQty": 50 }]
}
```

> Validates stock availability. Deducts from source via `TRANSFER_OUT`.

</details>

<details>
<summary><strong>POST /transfers/:id/complete</strong></summary>

```json
{
  "items": [{ "variantId": "uuid", "receivedQty": 48 }]
}
```

> Adds to destination via `TRANSFER_IN`. Marks transfer `COMPLETED`.

</details>

---

### 12. Finance

| Method | Endpoint            | Auth        | Description                     |
| ------ | ------------------- | ----------- | ------------------------------- |
| `GET`  | `/finance/accounts` | STAFF_ROLES | List ledger accounts            |
| `POST` | `/finance/accounts` | ADMIN_ROLES | Create ledger account           |
| `GET`  | `/finance/ledger`   | STAFF_ROLES | View ledger entries (paginated) |

**Ledger query params:** `page`, `limit`, `from` (ISO date), `to` (ISO date), `referenceType`

<details>
<summary><strong>POST /finance/accounts</strong></summary>

```json
{
  "code": "2001", // required, unique
  "name": "Accounts Payable", // required
  "type": "LIABILITY", // ASSET | LIABILITY | EQUITY | REVENUE | EXPENSE
  "description": "Money owed" // optional
}
```

</details>

---

### 13. Payroll

| Method   | Endpoint                | Auth          | Description                   |
| -------- | ----------------------- | ------------- | ----------------------------- |
| `GET`    | `/payroll/commissions`  | MANAGER_ROLES | List sales commissions        |
| `GET`    | `/payroll/payslips`     | MANAGER_ROLES | List payslips                 |
| `POST`   | `/payroll/payslips`     | MANAGER_ROLES | Create/bulk payslips (upsert) |
| `GET`    | `/payroll/payslips/:id` | MANAGER_ROLES | Get payslip detail            |
| `PUT`    | `/payroll/payslips/:id` | MANAGER_ROLES | Update payslip                |
| `DELETE` | `/payroll/payslips/:id` | MANAGER_ROLES | Delete payslip                |

**Commission query params:** `userId`, `isPaid`
**Payslip query params:** `userId`, `month`, `year`

<details>
<summary><strong>POST /payroll/payslips</strong> (single or array)</summary>

```json
{
  "userId": "employee-uuid",
  "month": 3,
  "year": 2026,
  "basicSalary": 5000,
  "allowances": 1000,
  "deductions": 500,
  "commissions": 800,
  "paidAt": null
}
```

> **Net pay** auto-calculated: `basicSalary + allowances + commissions - deductions`
> Upserts on `(userId, month, year)`. Send an array for bulk creation.

</details>

---

### 14. Dashboard

| Method | Endpoint            | Auth        | Description             |
| ------ | ------------------- | ----------- | ----------------------- |
| `GET`  | `/dashboard`        | STAFF_ROLES | Business summary (KPIs) |
| `GET`  | `/dashboard/charts` | STAFF_ROLES | Full BI chart data      |

**Dashboard summary returns:** orders (today/month/pending), revenue (total/monthly/growth%), inventory alerts, delivery stats, top 5 products.

**Charts data returns:** P&L (revenue, COGS, salaries, margins), 30-day sales trends, category distribution, stock per location, payroll history, stock value.

---

### 15. Analytics

| Method | Endpoint               | Auth          | Description                  |
| ------ | ---------------------- | ------------- | ---------------------------- |
| `GET`  | `/analytics/employees` | MANAGER_ROLES | Employee performance metrics |
| `GET`  | `/analytics/suppliers` | MANAGER_ROLES | Supplier performance metrics |

**Query params:** `startDate`, `endDate` (ISO dates, defaults to current month)

**Employee metrics:** orders handled, revenue generated, deliveries completed, commissions earned.

**Supplier metrics:** total GRNs, invoices, spend, discrepancy rate, reliability score.

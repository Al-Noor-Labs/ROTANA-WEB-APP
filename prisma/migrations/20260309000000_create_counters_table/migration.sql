-- Migration: 20260309_create_counters_table
-- Purpose: Atomic sequential counter table for human-readable ID generation
-- Used by: lib/utils/id-generator.ts
--
-- This table uses INSERT ... ON CONFLICT DO UPDATE (atomic upsert)
-- to guarantee no collisions even under concurrent requests.
-- Each counter has a unique name and an incrementing integer value.
--
-- Examples of counter names used:
--   order_b2c       → ORD-B2C-0000001
--   order_b2b       → ORD-B2B-0000001
--   customer_2026   → CUS-2026-00001
--   invoice_2026    → INV-2026-00001
--   grn_2026        → GRN-2026-00001
--   transfer_2026   → TRF-2026-00001

CREATE TABLE IF NOT EXISTS counters (
  name       TEXT        PRIMARY KEY,
  value      BIGINT      NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed the starting counters so they exist (value starts at 0, first call will be 1)
INSERT INTO counters (name, value) VALUES
  ('order_b2c',      0),
  ('order_b2b',      0),
  ('customer_2026',  0),
  ('invoice_2026',   0),
  ('grn_2026',       0),
  ('transfer_2026',  0)
ON CONFLICT (name) DO NOTHING;

-- Index not needed — PRIMARY KEY already creates a btree index on `name`
-- No RLS needed — this table is only accessed server-side via service role

/**
 * Rotana Platform - Database Seed Script
 * Run with: npx prisma db seed
 *
 * Seeds:
 * - Default Ledger Accounts (Chart of Accounts)
 * - Super Admin User
 * - Sample Locations (1 Warehouse + 1 Store)
 * - Sample Categories & Products
 */

import {
  PrismaClient,
  Role,
  LocationType,
  ProductStatus,
  AccountType,
} from '@/lib/generated/prisma';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── 1. Ledger Accounts (Chart of Accounts) ─────────────────────────────
  console.log('  📒 Creating ledger accounts...');
  const accounts = [
    // ASSETS
    { code: '1001', name: 'Cash & Cash Equivalents', type: 'ASSET', isSystem: true },
    { code: '1002', name: 'Payment Gateway Receivable', type: 'ASSET', isSystem: true },
    { code: '1100', name: 'Accounts Receivable (B2B)', type: 'ASSET', isSystem: true },
    { code: '1200', name: 'Inventory Asset', type: 'ASSET', isSystem: true },
    // LIABILITIES
    { code: '2001', name: 'Accounts Payable (Suppliers)', type: 'LIABILITY', isSystem: true },
    { code: '2100', name: 'Tax Payable (GST)', type: 'LIABILITY', isSystem: true },
    // REVENUE
    { code: '4001', name: 'Sales Revenue', type: 'REVENUE', isSystem: true },
    { code: '4002', name: 'B2B Sales Revenue', type: 'REVENUE', isSystem: true },
    { code: '4003', name: 'Delivery Charge Revenue', type: 'REVENUE', isSystem: true },
    // EXPENSES
    { code: '5001', name: 'Cost of Goods Sold (COGS)', type: 'EXPENSE', isSystem: true },
    { code: '5002', name: 'Payroll Expense', type: 'EXPENSE', isSystem: true },
    { code: '5003', name: 'Delivery Expense', type: 'EXPENSE', isSystem: true },
    { code: '5004', name: 'Damage & Write-Off Expense', type: 'EXPENSE', isSystem: true },
  ];

  for (const account of accounts) {
    await prisma.ledgerAccount.upsert({
      where: { code: account.code },
      update: {},
      create: { ...account, type: account.type as AccountType },
    });
  }
  console.log(`  ✅ Created ${accounts.length} ledger accounts`);

  // ─── 2. Super Admin User ─────────────────────────────────────────────────
  console.log('  👤 Creating super admin...');
  const passwordHash = await bcrypt.hash('Rotana@Admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@rotana.com' },
    update: {},
    create: {
      name: 'Rotana Super Admin',
      email: 'admin@rotana.com',
      phone: '+919999999999',
      passwordHash,
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`  ✅ Super Admin: admin@rotana.com / Rotana@Admin123`);

  // ─── 3. Sample Warehouse & Store ─────────────────────────────────────────
  console.log('  🏭 Creating locations...');
  const warehouse = await prisma.location.upsert({
    where: { code: 'WH-MAIN' },
    update: {},
    create: {
      name: 'Main Warehouse',
      type: LocationType.WAREHOUSE,
      code: 'WH-MAIN',
      address: 'Industrial Area, Sector 5',
      city: 'Hyderabad',
    },
  });

  const store = await prisma.location.upsert({
    where: { code: 'ST-001' },
    update: {},
    create: {
      name: 'Rotana Dark Store - Banjara Hills',
      type: LocationType.STORE,
      code: 'ST-001',
      address: 'Road No. 12, Banjara Hills',
      city: 'Hyderabad',
    },
  });

  // Add bins to warehouse
  const bins = [
    { code: 'A-01-01', aisle: 'A', rack: '01', shelf: '01' },
    { code: 'A-01-02', aisle: 'A', rack: '01', shelf: '02' },
    { code: 'B-01-01', aisle: 'B', rack: '01', shelf: '01' },
    { code: 'B-02-01', aisle: 'B', rack: '02', shelf: '01' },
  ];
  for (const bin of bins) {
    await prisma.bin.upsert({
      where: { locationId_code: { locationId: warehouse.id, code: bin.code } },
      update: {},
      create: { ...bin, locationId: warehouse.id },
    });
  }
  console.log(`  ✅ Created Warehouse (${warehouse.code}) and Store (${store.code})`);

  // ─── 4. Sample Categories ────────────────────────────────────────────────
  console.log('  📦 Creating categories...');
  const categories = [
    { name: 'Staples & Grains', slug: 'staples-grains' },
    { name: 'Dairy & Eggs', slug: 'dairy-eggs' },
    { name: 'Beverages', slug: 'beverages' },
    { name: 'Snacks & Namkeen', slug: 'snacks' },
    { name: 'Cleaning & Household', slug: 'cleaning-household' },
    { name: 'Fresh Fruits & Vegetables', slug: 'fresh-produce' },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categoryMap.set(cat.slug, created.id);
  }
  console.log(`  ✅ Created ${categories.length} categories`);

  // ─── 5. Sample Products with Variants ────────────────────────────────────
  console.log('  🛒 Creating sample products...');
  const sampleProducts = [
    {
      name: 'Basmati Rice - Premium',
      categorySlug: 'staples-grains',
      brand: 'India Gate',
      isPerishable: false,
      tags: ['rice', 'basmati', 'staple'],
      variants: [
        {
          sku: 'RICE-BAS-1KG',
          name: '1 kg',
          unitValue: 1,
          unitLabel: 'kg',
          costPrice: 90,
          sellingPrice: 115,
          mrp: 130,
          taxRate: 0,
          reorderLevel: 50,
        },
        {
          sku: 'RICE-BAS-5KG',
          name: '5 kg',
          unitValue: 5,
          unitLabel: 'kg',
          costPrice: 430,
          sellingPrice: 550,
          mrp: 600,
          taxRate: 0,
          reorderLevel: 20,
        },
        {
          sku: 'RICE-BAS-25KG',
          name: '25 kg',
          unitValue: 25,
          unitLabel: 'kg',
          costPrice: 2000,
          sellingPrice: 2600,
          mrp: 2900,
          taxRate: 0,
          reorderLevel: 5,
        },
      ],
    },
    {
      name: 'Full Cream Milk',
      categorySlug: 'dairy-eggs',
      brand: 'Amul',
      isPerishable: true,
      tags: ['milk', 'dairy', 'fresh'],
      variants: [
        {
          sku: 'MILK-FC-500ML',
          name: '500 ml',
          unitValue: 0.5,
          unitLabel: 'litre',
          costPrice: 25,
          sellingPrice: 32,
          mrp: 35,
          taxRate: 0,
          reorderLevel: 100,
        },
        {
          sku: 'MILK-FC-1L',
          name: '1 litre',
          unitValue: 1,
          unitLabel: 'litre',
          costPrice: 48,
          sellingPrice: 62,
          mrp: 68,
          taxRate: 0,
          reorderLevel: 100,
        },
      ],
    },
    {
      name: 'Toor Dal (Split Pigeon Peas)',
      categorySlug: 'staples-grains',
      brand: 'Local',
      isPerishable: false,
      tags: ['dal', 'lentils', 'protein'],
      variants: [
        {
          sku: 'DAL-TOR-1KG',
          name: '1 kg',
          unitValue: 1,
          unitLabel: 'kg',
          costPrice: 110,
          sellingPrice: 145,
          mrp: 165,
          taxRate: 0,
          reorderLevel: 30,
        },
        {
          sku: 'DAL-TOR-5KG',
          name: '5 kg',
          unitValue: 5,
          unitLabel: 'kg',
          costPrice: 520,
          sellingPrice: 680,
          mrp: 780,
          taxRate: 0,
          reorderLevel: 10,
        },
      ],
    },
    {
      name: 'Sunflower Oil',
      categorySlug: 'staples-grains',
      brand: 'Fortune',
      isPerishable: false,
      tags: ['oil', 'cooking-oil'],
      variants: [
        {
          sku: 'OIL-SF-1L',
          name: '1 litre',
          unitValue: 1,
          unitLabel: 'litre',
          costPrice: 130,
          sellingPrice: 162,
          mrp: 180,
          taxRate: 5,
          reorderLevel: 40,
        },
        {
          sku: 'OIL-SF-5L',
          name: '5 litre',
          unitValue: 5,
          unitLabel: 'litre',
          costPrice: 620,
          sellingPrice: 780,
          mrp: 860,
          taxRate: 5,
          reorderLevel: 15,
        },
      ],
    },
  ];

  for (const p of sampleProducts) {
    const categoryId = categoryMap.get(p.categorySlug)!;
    const existing = await prisma.product.findFirst({
      where: { name: p.name },
    });
    if (!existing) {
      await prisma.product.create({
        data: {
          name: p.name,
          categoryId,
          brand: p.brand,
          isPerishable: p.isPerishable,
          tags: p.tags,
          status: ProductStatus.ACTIVE,
          variants: { create: p.variants },
        },
      });
    }
  }
  console.log(`  ✅ Created ${sampleProducts.length} sample products`);

  console.log('\n✅ Database seeded successfully!');
  console.log('─────────────────────────────────────────');
  console.log('  Admin Email   : admin@rotana.com');
  console.log('  Admin Password: Rotana@Admin123');
  console.log('─────────────────────────────────────────');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

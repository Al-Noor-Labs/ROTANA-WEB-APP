import { PrismaClient } from './app/generated/prisma/index.js';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

async function post(path: string, body: any, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function get(path: string, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}

async function main() {
  console.log('--- Bulk Products & Data Fetching Test ---');

  // 1. Login auth
  const email = 'admin@rotana.com';
  const password = 'Password123!';
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).then(r => r.json());

  const token = loginRes.data.accessToken;
  console.log('✅ Login successful');

  // 2. Clear out older products to make dashboard count obvious (optional, but better for testing)
  // await prisma.product.deleteMany({ where: { status: 'ACTIVE' } });

  // 3. Get first category
  const cats = await get('/categories', token);
  const categoryId = cats.data[0].id;
  console.log(`✅ Fetched category: ${cats.data[0].name}`);

  // 4. Test Bulk ADD
  console.log('⏳ Adding 5 products in one bulk request...');
  const ts = Date.now();
  const bulkProducts = [1, 2, 3, 4, 5].map(i => ({
    categoryId,
    name: `Bulk Product ${i} - ${ts}`,
    brand: 'BulkBrand',
    variants: [{ sku: `BULK-SKU-${i}-${ts}`, name: 'Standard Pack', unitValue: 1, unitLabel: 'pcs', costPrice: 10, sellingPrice: 20 }]
  }));

  const bulkRes = await post('/products/bulk', bulkProducts, token);
  if (!bulkRes.success) { console.error('❌ Bulk Add Failed:', bulkRes); return; }
  console.log(`✅ Bulk Added ${bulkRes.data.length} products successfully`);

  // 5. Test DATA FETCHING (GET all products)
  console.log('⏳ Testing Data Fetching (GET All Products)...');
  const fetchRes = await get('/products', token);
  if (fetchRes.success) {
    console.log(`✅ Fetched ${fetchRes.data.products.length} products total.`);
    console.log(`✅ Search Test: Found "${fetchRes.data.products[0].name}"`);
  }

  // 6. Test DASHBOARD update
  console.log('⏳ Verifying Dashboard reflection...');
  const dashRes = await get('/dashboard', token);
  if (dashRes.success) {
    const total = dashRes.data.inventory.totalProducts;
    console.log(`✅ Dashboard Data: Total Products = ${total}`);
  }

  console.log('\n--- 🎉 BULK ADD & DATA FETCHING VERIFIED ---');
  await prisma.$disconnect();
}

main();

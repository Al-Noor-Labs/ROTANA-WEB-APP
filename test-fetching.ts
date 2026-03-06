import { PrismaClient } from './app/generated/prisma/index.js';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

async function testFetching() {
  console.log('--- Testing Data Fetching APIs ---');

  // 1. Fetching Lists
  const listEndpoints = ['/products', '/categories', '/locations', '/suppliers', '/orders'];
  for (const path of listEndpoints) {
    const res = await fetch(`${BASE_URL}${path}`);
    const data = await res.json();
    if (data.success) {
      const count = data.data.products ? data.data.products.length : (Array.isArray(data.data) ? data.data.length : 'N/A');
      console.log(`✅ GET ${path}: Success (Found ${count} items)`);
    } else {
      console.log(`❌ GET ${path}: Failed`, data);
    }
  }

  // 2. Fetching Single Item (Testing Dynamic Route + Auth)
  const product = await prisma.product.findFirst();
  if (product) {
    console.log(`\nTesting Single Product Fetch: /api/products/${product.id}`);
    const res = await fetch(`${BASE_URL}/products/${product.id}`);
    const data = await res.json();
    if (data.success && data.data.id === product.id) {
        console.log(`✅ GET /products/[id]: Success (Fetched "${data.data.name}")`);
    } else {
        console.log(`❌ GET /products/[id]: Failed`, data);
    }
  }

  // 3. Testing Filtered Search
  console.log('\nTesting Filtered Search: /api/products?search=Coca');
  const searchRes = await fetch(`${BASE_URL}/products?search=Coca`);
  const searchData = await searchRes.json();
  if (searchData.success) {
    console.log(`✅ Search Success: Found ${searchData.data.products.length} products matching "Coca"`);
  }

  await prisma.$disconnect();
}

testFetching();

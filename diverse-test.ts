import { PrismaClient } from './app/generated/prisma/index.js';

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

async function main() {
  console.log('--- 🧪 Adding Diverse Multi-Product Test ---');

  // 1. Auth Setup
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@rotana.com', password: 'Password123!' }),
  }).then(r => r.json());

  const token = loginRes.data.accessToken;
  console.log('✅ Login successful');

  // 2. Setup Category (using existing or create fresh)
  const ts = Date.now();
  const catRes = await post('/categories', { name: `General Goods ${ts}`, description: 'Diverse testing category' }, token);
  const catId = catRes.data.id;

  // 3. Define 5 High-Detail Products
  const sampleProducts = [
    {
      categoryId: catId,
      name: "Organic Basmati Rice",
      brand: "Himalayan Gold",
      description: "Premium long-grain aged basmati rice, rich in aroma.",
      isPerishable: false,
      barcode: "8901234567890",
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800",
      tags: ["staples", "organic", "premium"],
      variants: [
        { sku: `RICE-1KG-${ts}`, name: "1kg Pack", unitValue: 1, unitLabel: "kg", costPrice: 90, sellingPrice: 120, mrp: 150, taxRate: 5, reorderLevel: 50 },
        { sku: `RICE-5KG-${ts}`, name: "5kg Economy Pack", unitValue: 5, unitLabel: "kg", costPrice: 400, sellingPrice: 550, mrp: 700, taxRate: 5, reorderLevel: 20 }
      ]
    },
    {
      categoryId: catId,
      name: "Cold Pressed Coconut Oil",
      brand: "Nature Pure",
      description: "100% pure virgin coconut oil, extracted using traditional methods.",
      isPerishable: false,
      barcode: "8909876543210",
      imageUrl: "https://images.unsplash.com/photo-1590483734724-38fa19dd4438?auto=format&fit=crop&w=800",
      tags: ["health", "cooking", "keto"],
      variants: [
        { sku: `OIL-500ML-${ts}`, name: "500ml Bottle", unitValue: 500, unitLabel: "ml", costPrice: 150, sellingPrice: 220, mrp: 280, taxRate: 12, reorderLevel: 30 }
      ]
    },
    {
      categoryId: catId,
      name: "Wireless ANC Headphones",
      brand: "SonicWave",
      description: "Over-ear headphones with 40dB active noise cancellation and 50hr battery life.",
      isPerishable: false,
      barcode: "7421356890123",
      imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800",
      tags: ["electronics", "tech", "audio"],
      variants: [
        { sku: `ANC-BLK-${ts}`, name: "Midnight Black", unitValue: 1, unitLabel: "unit", costPrice: 4500, sellingPrice: 8999, mrp: 12999, taxRate: 18, reorderLevel: 5 }
      ]
    },
    {
      categoryId: catId,
      name: "Fresh Lavazza Coffee Beans",
      brand: "Lavazza",
      description: "Medium roast espresso beans, notes of chocolate and dried fruit.",
      isPerishable: true,
      barcode: "8008200123456",
      imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800",
      tags: ["beverages", "premium", "morning"],
      variants: [
        { sku: `COF-250G-${ts}`, name: "250g Pouch", unitValue: 250, unitLabel: "g", costPrice: 350, sellingPrice: 499, mrp: 650, taxRate: 5, reorderLevel: 15 }
      ]
    },
    {
      categoryId: catId,
      name: "Microfiber Cleaning Towels",
      brand: "CleanMaster",
      description: "Absorbent, lint-free cloth for detailing and home cleaning.",
      isPerishable: false,
      barcode: "1234567812345",
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800",
      tags: ["homecare", "carcare", "microfiber"],
      variants: [
        { sku: `TOWEL-S3-${ts}`, name: "Set of 3 (Blue)", unitValue: 3, unitLabel: "pcs", costPrice: 120, sellingPrice: 299, mrp: 499, taxRate: 12, reorderLevel: 25 }
      ]
    }
  ];

  console.log('⏳ Adding 5 high-detail products...');
  const bulkRes = await post('/products/bulk', sampleProducts, token);

  if (bulkRes.success) {
    console.log(`✅ Success! Added ${bulkRes.data.length} products with multiple variants.`);
    bulkRes.data.forEach((p: any) => {
      console.log(`   - ${p.name} (${p.variants.length} variant(s))`);
    });
  } else {
    console.error('❌ Bulk Creation Failed:', JSON.stringify(bulkRes, null, 2));
  }

  // 4. Verify Dashboard
  setTimeout(async () => {
    const dash = await fetch(`${BASE_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json());
    if (dash.success) {
      console.log(`\n📊 Dashboard Live Update:`);
      console.log(`   - Total Products: ${dash.data.inventory.totalProducts}`);
      console.log(`   - Low Stock Alerts: ${dash.data.inventory.lowStockAlerts}`);
    }
    await prisma.$disconnect();
  }, 1000);
}

main();

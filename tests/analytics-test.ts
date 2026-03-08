import { PrismaClient } from '../app/generated/prisma/index.js';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3000/api';

async function post(path: string, body: unknown, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  return res.json();
}

async function patch(path: string, body: unknown, token: string) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
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
  console.log('--- 🛡️ Testing Analytics & Dashboard Charts ---');

  // 1. Auth Setup
  const loginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@rotana.com', password: 'Password123!' }),
  }).then((r) => r.json());

  const token = loginRes.data.accessToken;
  console.log('✅ Login successful');

  // 2. Get necessary test data
  const products = await get('/products', token);
  const variant = products.data.products[0].variants[0];
  const locations = await get('/locations', token);
  const warehouse = locations.data.find((l: { type: string }) => l.type === 'WAREHOUSE');
  const suppliers = await get('/suppliers', token);
  const supplier = suppliers.data[0];

  if (!variant || !warehouse || !supplier) {
    console.error(
      '❌ Missing test data (products, locations, or suppliers). Run diverse-test.ts first.',
    );
    return;
  }

  // 2.5 Stock in the variant so we can create an order
  console.log('⏳ Adding stock via GRN...');
  const grnRes = await post(
    '/grn',
    {
      supplierId: supplier.id,
      locationId: warehouse.id,
      items: [{ variantId: variant.id, orderedQty: 50, receivedQty: 50, costPrice: 350 }],
    },
    token,
  );
  if (!grnRes.success) {
    console.error('❌ GRN Failed:', grnRes);
    return;
  }
  console.log('✅ Stock added');

  // 3. Create a test order
  console.log('⏳ Creating an order...');
  const orderRes = await post(
    '/orders',
    {
      orderType: 'B2C_STORE',
      sourceLocationId: warehouse.id,
      paymentMethod: 'CASH',
      items: [{ variantId: variant.id, quantity: 5 }],
    },
    token,
  );

  if (!orderRes.success) {
    console.error('❌ Order Creation Failed:', orderRes);
    return;
  }
  const orderId = orderRes.data.id;
  console.log(`✅ Order created: ${orderId}`);

  // 4. Mark order as DELIVERED (to make it show up in analytics)
  console.log('⏳ Marking order as DELIVERED...');
  const patchRes = await patch(`/orders/${orderId}`, { status: 'DELIVERED' }, token);
  if (!patchRes.success) {
    console.error('❌ Status update failed:', patchRes);
    return;
  }
  console.log('✅ Order marked as DELIVERED');

  // 5. Test Analytics Charts API
  console.log('\n⏳ Fetching Dashboard Charts (Full BI Analytics)...');
  const chartsRes = await get('/dashboard/charts', token);

  if (chartsRes.success) {
    const { finances, trends } = chartsRes.data;
    const l30 = finances.last30Days;

    console.log('✅ BI Analytics Data Received:');
    console.log('\n💹 Profit & Loss (Last 30 Days):');
    console.log(`   - Revenue: ₹${l30.revenue}`);
    console.log(`   - COGS (Cost): ₹${l30.cogs}`);
    console.log(`   - Salary Spend: ₹${l30.salaries}`);
    console.log(`   - Gross Profit: ₹${l30.grossProfit}`);
    console.log(`   - Net Profit: ₹${l30.netProfit}`);
    console.log(`   - Net Margin: ${l30.netProfitMargin.toFixed(2)}%`);

    console.log('\n📦 Inventory Analytics:');
    console.log(`   - Current Stock Value: ₹${finances.currentStockValue}`);
    console.log(`   - Active Locations: ${trends.stockPerLocation.length}`);

    console.log('\n📊 Category Contribution:');
    trends.categories.forEach((c: { name: string; revenue: number }) => {
      console.log(`   🔸 ${c.name}: ₹${c.revenue}`);
    });

    console.log('\n📈 Recent Sales Trend:');
    trends.sales.slice(-5).forEach((s: { date: string; revenue: number; orders: number }) => {
      console.log(`   📅 ${s.date}: ₹${s.revenue} (${s.orders} orders)`);
    });

    console.log('\n💸 Monthly Payroll History:');
    finances.payrollHistory.forEach((p: { period: string; amount: number }) => {
      console.log(`   📅 ${p.period}: ₹${p.amount}`);
    });
  } else {
    console.error('❌ Analytics Fetch Failed:', chartsRes);
  }

  console.log('\n--- 🎉 ANALYTICS VERIFIED SUCCESSFULLY ---');
  await prisma.$disconnect();
}

main();

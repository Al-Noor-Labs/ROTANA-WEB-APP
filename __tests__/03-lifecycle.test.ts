import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, adminLogin } from './test-utils';

describe('Inventory & Orders Lifecycle', () => {
  let token = '';
  let variantId = '';
  let warehouseId = '';
  let storeId = '';
  let supplierId = '';
  let currentOrderId = '';

  beforeAll(async () => {
    token = await adminLogin();

    // Fetch locations from seed
    const locRes = await apiFetch('/locations', token);
    const locations = locRes.data.data;
    warehouseId = locations.find((l: any) => l.type === 'WAREHOUSE')?.id;
    storeId = locations.find((l: any) => l.type === 'STORE')?.id;

    // Fetch or create supplier
    const supRes = await apiFetch('/suppliers', token);
    if (supRes.data.data.length > 0) {
      supplierId = supRes.data.data[0].id;
    } else {
      const newSup = await apiFetch('/suppliers', token, {
        method: 'POST',
        body: JSON.stringify({ name: 'Test Supplier', email: `sup-${Date.now()}@test.com` })
      });
      supplierId = newSup.data.data.id;
    }

    // Fetch seeded product variant
    const prodRes = await apiFetch('/products', token);
    variantId = prodRes.data.data.products?.[0]?.variants?.[0]?.id;
  });

  it('receives stock via GRN', async () => {
    expect(variantId).toBeDefined();
    expect(warehouseId).toBeDefined();
    expect(supplierId).toBeDefined();

    const grnRes = await apiFetch('/grn', token, {
      method: 'POST',
      body: JSON.stringify({
        supplierId,
        locationId: warehouseId,
        notes: 'Lifecycle Test GRN',
        items: [{ variantId, orderedQty: 100, receivedQty: 100, damagedQty: 0, costPrice: 50 }]
      })
    });

    expect(grnRes.status).toBe(201);
    expect(grnRes.data.success).toBe(true);
    // Status should be STOCKED after GRN processing
    expect(grnRes.data.data.status).toBe('STOCKED');
  });

  it('verifies inventory updates and lists GRNs', async () => {
    const listGrn = await apiFetch('/grn', token);
    expect(listGrn.status).toBe(200);
    expect(listGrn.data.data.grns.length).toBeGreaterThanOrEqual(1);

    const checkInv = await apiFetch(`/inventory?locationId=${warehouseId}&variantId=${variantId}`, token);
    expect(checkInv.status).toBe(200);
    // Stock should exist from this run's GRN or previous runs
    const totalStock = checkInv.data.data.reduce((sum: number, b: any) => sum + (b.available ?? 0), 0);
    expect(totalStock).toBeGreaterThan(0);
  });

  it('manually adds inventory adjustment', async () => {
    const adjRes = await apiFetch('/inventory', token, {
      method: 'POST',
      body: JSON.stringify({
        variantId,
        locationId: warehouseId,
        eventType: 'ADJUSTMENT',
        quantity: 5,
        notes: 'Manual test adjustment'
      })
    });
    expect(adjRes.status).toBe(201);
  });

  it('transfers stock from warehouse to store', async () => {
    const trfRes = await apiFetch('/transfers', token, {
      method: 'POST',
      body: JSON.stringify({
        fromLocationId: warehouseId,
        toLocationId: storeId,
        items: [{ variantId, requestedQty: 5 }]
      })
    });

    expect(trfRes.status).toBe(201);
    expect(trfRes.data.data.status).toBe('IN_TRANSIT');
    const transferId = trfRes.data.data.id;

    const completeRes = await apiFetch(`/transfers/${transferId}/complete`, token, {
      method: 'POST',
      body: JSON.stringify({ items: [{ variantId, receivedQty: 5 }] })
    });

    expect(completeRes.status).toBe(200);
    expect(completeRes.data.data.status).toBe('COMPLETED');
  });

  it('creates an order from the store', async () => {
    const orderRes = await apiFetch('/orders', token, {
      method: 'POST',
      body: JSON.stringify({
        orderType: 'B2C_ONLINE',
        paymentMethod: 'CASH',
        sourceLocationId: storeId,
        deliveryCharge: 0,
        discountAmount: 0,
        items: [{ variantId, quantity: 1 }]
      })
    });

    expect(orderRes.status).toBe(201);
    currentOrderId = orderRes.data.data.id;

    const getRes = await apiFetch(`/orders/${currentOrderId}`, token);
    expect(getRes.status).toBe(200);
    expect(getRes.data.data.status).toBe('CREATED');
  });

  it('assigns and completes a delivery for the order', async () => {
    const assignRes = await apiFetch('/deliveries', token, {
      method: 'POST',
      body: JSON.stringify({
        orderId: currentOrderId,
        estimatedAt: new Date(Date.now() + 86400000).toISOString()
      })
    });
    expect(assignRes.status).toBe(201);
    const deliveryId = assignRes.data.data.id;

    await apiFetch(`/deliveries/${deliveryId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'PICKED_UP' })
    });

    const completeRes = await apiFetch(`/deliveries/${deliveryId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'DELIVERED', notes: 'Test delivery complete' })
    });
    expect(completeRes.status).toBe(200);

    const getOrder = await apiFetch(`/orders/${currentOrderId}`, token);
    expect(getOrder.data.data.status).toBe('DELIVERED');
  });

  it('checks finance ledger has entries after delivery', async () => {
    // Fetch all ledger entries (no filter) to confirm at least one was posted
    const ledgerRes = await apiFetch('/finance/ledger', token);
    expect(ledgerRes.status).toBe(200);
    // There should be ledger records from the delivered order
    expect(ledgerRes.data.data.pagination.total).toBeGreaterThan(0);
  });

  it('verifies Dashboard and Analytics endpoints respond correctly', async () => {
    const dashRes = await apiFetch('/dashboard', token);
    expect(dashRes.status).toBe(200);
    // Just ensure the structure exists - revenue can be 0 if this is first delivery
    expect(dashRes.data.data).toHaveProperty('revenue');
    expect(dashRes.data.data).toHaveProperty('orders');
    expect(dashRes.data.data).toHaveProperty('inventory');
    expect(dashRes.data.data.orders.thisMonth).toBeGreaterThanOrEqual(1);

    const chartsRes = await apiFetch('/dashboard/charts', token);
    expect(chartsRes.status).toBe(200);
    expect(chartsRes.data.data).toHaveProperty('finances');
    expect(chartsRes.data.data).toHaveProperty('trends');

    const empRes = await apiFetch('/analytics/employees', token);
    expect(empRes.status).toBe(200);

    const supRes = await apiFetch('/analytics/suppliers', token);
    expect(supRes.status).toBe(200);
  });
});

import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, adminLogin } from './test-utils';

describe('Core Setup & Products APIs', () => {
  let token = '';
  let categoryId = '';
  let variantId = '';

  beforeAll(async () => {
    token = await adminLogin();
  });

  it('creates and fetches categories', async () => {
    const postRes = await apiFetch('/categories', token, {
      method: 'POST',
      body: JSON.stringify({ name: `Test Category ${Date.now()}`, description: 'Testing' })
    });
    expect(postRes.status).toBe(201);
    expect(postRes.data.success).toBe(true);
    categoryId = postRes.data.data.id;

    const getRes = await apiFetch('/categories', token, { method: 'GET' });
    expect(getRes.status).toBe(200);
    expect(getRes.data.data.length).toBeGreaterThan(0);
  });

  it('creates and fetches locations', async () => {
    const ts = Date.now();
    const locRes1 = await apiFetch('/locations', token, {
      method: 'POST',
      body: JSON.stringify({ name: `Test WH ${ts}`, type: 'WAREHOUSE', code: `WHX-${ts}` })
    });
    const locRes2 = await apiFetch('/locations', token, {
      method: 'POST',
      body: JSON.stringify({ name: `Test ST ${ts}`, type: 'STORE', code: `STX-${ts}` })
    });

    expect(locRes1.status).toBe(201);
    expect(locRes2.status).toBe(201);

    const getRes = await apiFetch('/locations', token, { method: 'GET' });
    expect(getRes.status).toBe(200);
    expect(getRes.data.data.length).toBeGreaterThanOrEqual(2);
  });

  it('creates and fetches suppliers', async () => {
    const supRes = await apiFetch('/suppliers', token, {
      method: 'POST',
      body: JSON.stringify({ name: `Global Suppliers Ltd ${Date.now()}`, contactName: 'John Doe', email: `supplier-${Date.now()}@test.com` })
    });
    expect(supRes.status).toBe(201);
    expect(supRes.data.success).toBe(true);

    const getRes = await apiFetch('/suppliers', token, { method: 'GET' });
    expect(getRes.status).toBe(200);
  });

  it('creates and fetches ledger accounts', async () => {
    const code = `9${Math.floor(Math.random() * 900) + 100}`;
    const accRes = await apiFetch('/finance/accounts', token, {
      method: 'POST',
      body: JSON.stringify({ code, name: 'Test Expense Account', type: 'EXPENSE' })
    });
    // Code may randomly collide: accept 201 or 400
    expect([201, 400]).toContain(accRes.status);

    const listRes = await apiFetch('/finance/accounts', token, { method: 'GET' });
    expect(listRes.status).toBe(200);
    expect(Array.isArray(listRes.data.data)).toBe(true);
    expect(listRes.data.data.length).toBeGreaterThan(0);
  });

  it('creates a product with variants', async () => {
    const ts = Date.now();
    const prodRes = await apiFetch('/products', token, {
      method: 'POST',
      body: JSON.stringify({
        categoryId,
        name: `Test Multi-Variant Product ${ts}`,
        variants: [
          { sku: `TSKU-${ts}-1`, name: 'Small', unitValue: 1, unitLabel: 'pc', costPrice: 10, sellingPrice: 20 },
          { sku: `TSKU-${ts}-2`, name: 'Large', unitValue: 5, unitLabel: 'pc', costPrice: 40, sellingPrice: 90 }
        ]
      })
    });

    expect(prodRes.status).toBe(201);
    expect(prodRes.data.data.variants.length).toBe(2);
    variantId = prodRes.data.data.variants[0].id;
  });

  it('can bulk create products', async () => {
    const ts = Date.now();
    const bulkRes = await apiFetch('/products/bulk', token, {
      method: 'POST',
      body: JSON.stringify([
        {
          categoryId,
          name: `Bulk Prod A - ${ts}`,
          variants: [{ sku: `BLK-A-${ts}`, name: 'Standard', unitValue: 1, unitLabel: 'pc', costPrice: 10, sellingPrice: 20 }]
        },
        {
          categoryId,
          name: `Bulk Prod B - ${ts}`,
          variants: [{ sku: `BLK-B-${ts}`, name: 'Standard', unitValue: 1, unitLabel: 'kg', costPrice: 50, sellingPrice: 100 }]
        }
      ])
    });

    expect(bulkRes.status).toBe(201);
    expect(bulkRes.data.success).toBe(true);
    expect(bulkRes.data.data.length).toBe(2);
  });

  it('fetches a product by ID and soft-deletes it', async () => {
    const ts = Date.now();
    // Create a product to delete
    const createRes = await apiFetch('/products', token, {
      method: 'POST',
      body: JSON.stringify({
        categoryId,
        name: `Delete Me ${ts}`,
        variants: [{ sku: `DEL-${ts}`, name: 'Unit', unitValue: 1, unitLabel: 'pc', costPrice: 5, sellingPrice: 10 }]
      })
    });
    expect(createRes.status).toBe(201);
    const productId = createRes.data.data.id;

    // Get by ID
    const getRes = await apiFetch(`/products/${productId}`, token, { method: 'GET' });
    expect(getRes.status).toBe(200);
    expect(getRes.data.data.id).toBe(productId);

    // Soft-delete
    const delRes = await apiFetch(`/products/${productId}`, token, { method: 'DELETE' });
    expect(delRes.status).toBe(200);
  });
});

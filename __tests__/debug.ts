import { apiFetch, adminLogin } from './test-utils';

async function debug() {
  const token = await adminLogin();
  const locs = await apiFetch('/locations', token);
  const wh = locs.data.data.find((l: any) => l.type === 'WAREHOUSE');
  const sup = await apiFetch('/suppliers', token);
  const supplierId = sup.data.data[0]?.id;
  const prod = await apiFetch('/products', token);
  const variantId = prod.data.data.products?.[0]?.variants?.[0]?.id;

  console.log('WH:', wh?.id, 'SUP:', supplierId, 'VARIANT:', variantId);

  const grnRes = await apiFetch('/grn', token, {
    method: 'POST',
    body: JSON.stringify({
      supplierId,
      locationId: wh?.id,
      items: [{ variantId, orderedQty: 10, receivedQty: 10, damagedQty: 0, costPrice: 50 }]
    })
  });
  console.log('GRN status:', grnRes.status, 'success:', grnRes.data.success);
  console.log('GRN data status field:', grnRes.data.data?.status);
  console.log('GRN message:', grnRes.data.message);
}
debug().catch(console.error);

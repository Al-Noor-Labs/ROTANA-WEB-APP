import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, adminLogin } from './test-utils';

describe('Payroll & Commissions', () => {
  let token = '';
  let staffUserId = '';
  let payslipId = '';

  beforeAll(async () => {
    token = await adminLogin();

    // Find or create a SALESMAN for payroll tests
    const usersRes = await apiFetch('/users?role=SALESMAN', token);
    const activeSalesmen = usersRes.data.data?.filter((u: any) => u.isActive);
    if (activeSalesmen?.length > 0) {
      staffUserId = activeSalesmen[0].id;
    } else {
      const regRes = await apiFetch('/auth/register', token, {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test Salesman',
          email: `salesman-${Date.now()}@rotana.com`,
          password: 'RotanaSalesman123!',
          role: 'SALESMAN'
        })
      });
      staffUserId = regRes.data.data.user.id;
    }
  });

  it('verifies commission list endpoint', async () => {
    const res = await apiFetch('/payroll/commissions', token);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
  });

  it('creates and reads a payslip', async () => {
    expect(staffUserId).toBeTruthy();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();

    const payRes = await apiFetch('/payroll/payslips', token, {
      method: 'POST',
      body: JSON.stringify({
        userId: staffUserId,
        month,
        year,
        basicSalary: 45000,
        allowances: 2000,
        deductions: 500,
        commissions: 1000,
      })
    });

    expect(payRes.status).toBe(201);
    expect(payRes.data.success).toBe(true);
    // Net Pay = 45000 + 2000 + 1000 - 500 = 47500 (Prisma Decimal serializes as string)
    expect(parseFloat(payRes.data.data.netPay)).toBe(47500);
    payslipId = payRes.data.data.id;

    // Retrieve it
    const getRes = await apiFetch(`/payroll/payslips/${payslipId}`, token);
    expect(getRes.status).toBe(200);
    expect(getRes.data.data.user.name).toBeDefined();
  });

  it('updates a payslip (PUT)', async () => {
    expect(payslipId).toBeTruthy();
    const updRes = await apiFetch(`/payroll/payslips/${payslipId}`, token, {
      method: 'PUT',
      body: JSON.stringify({
        basicSalary: 50000,
        allowances: 2000,
        deductions: 1000,
        commissions: 0,
      })
    });
    expect(updRes.status).toBe(200);
    expect(parseFloat(updRes.data.data.netPay)).toBe(51000); // 50000 + 2000 - 1000
  });

  it('bulk creates payslips for historical months', async () => {
    const bulkRes = await apiFetch('/payroll/payslips', token, {
      method: 'POST',
      body: JSON.stringify([
        { userId: staffUserId, month: 1, year: 2024, basicSalary: 40000, allowances: 1000, deductions: 0, commissions: 500 },
        { userId: staffUserId, month: 2, year: 2024, basicSalary: 40000, allowances: 1000, deductions: 200, commissions: 800 },
      ])
    });

    expect(bulkRes.status).toBe(201);
    expect(bulkRes.data.data.length).toBe(2);
  });

  it('checks employee analytics endpoint', async () => {
    const empDash = await apiFetch('/analytics/employees', token);
    expect(empDash.status).toBe(200);
    const perfData = empDash.data.data.performance;
    expect(Array.isArray(perfData)).toBe(true);
    expect(perfData.length).toBeGreaterThan(0);
  });

  it('deletes a payslip', async () => {
    expect(payslipId).toBeTruthy();
    const delRes = await apiFetch(`/payroll/payslips/${payslipId}`, token, { method: 'DELETE' });
    expect(delRes.status).toBe(200);
  });
});

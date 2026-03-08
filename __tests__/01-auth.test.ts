import { describe, it, expect, beforeAll } from 'vitest';
import { apiFetch, adminLogin } from './test-utils';

describe('Auth & Users APIs', () => {
  let token = '';
  let userStaffId = '';

  beforeAll(async () => {
    token = await adminLogin();
  });

  it('should get current logged in user (ME)', async () => {
    const res = await apiFetch('/auth/me', token, { method: 'GET' });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.email).toBe('admin@rotana.com');
  });

  it('should register a new staff member', async () => {
    const res = await apiFetch('/auth/register', token, {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Staff',
        email: `staff-${Date.now()}@test.com`,
        password: 'Password123!',
        role: 'CASHIER',
      }),
    });
    expect(res.status).toBe(201);
    expect(res.data.success).toBe(true);
    userStaffId = res.data.data.user.id;
  });

  it('should fetch list of users', async () => {
    const res = await apiFetch('/users', token, { method: 'GET' });
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data.data)).toBe(true);
    expect(res.data.data.length).toBeGreaterThan(0);
  });

  it('should update a specific user', async () => {
    const res = await apiFetch(`/users/${userStaffId}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ name: 'Updated Staff', role: 'STORE_MANAGER' }),
    });
    expect(res.status).toBe(200);
    expect(res.data.success).toBe(true);
    expect(res.data.data.name).toBe('Updated Staff');
    expect(res.data.data.role).toBe('STORE_MANAGER');
  });

  it('should disable a user via DELETE', async () => {
    const res = await apiFetch(`/users/${userStaffId}`, token, { method: 'DELETE' });
    expect(res.status).toBe(200);

    const resUsers = await apiFetch('/users', token, { method: 'GET' });
    const user = resUsers.data.data.find((u: any) => u.id === userStaffId);
    expect(user.isActive).toBe(false);
  });
});

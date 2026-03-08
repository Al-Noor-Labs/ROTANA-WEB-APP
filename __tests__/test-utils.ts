export const BASE_URL = 'http://localhost:3000/api/v1';

export async function apiFetch(path: string, token: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : await res.text();
  return { status: res.status, ok: res.ok, data };
}

export async function adminLogin(retries = 5): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@rotana.com', password: 'Rotana@Admin123' }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(`Login failed: ${JSON.stringify(data)}`);
      return data.data.accessToken as string;
    } catch (err) {
      if (attempt === retries) throw err;
      // Wait 1s before retry (for hot-reload or server startup)
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
  throw new Error('adminLogin: exhausted retries');
}

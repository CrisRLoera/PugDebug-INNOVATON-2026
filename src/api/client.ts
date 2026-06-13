// Set to false when n8n webhooks are ready
export const USE_MOCK = false;

export const BASE_URL = {
  auth: {
    login: "https://cristiandev.app.n8n.cloud/webhook/auth/login",
    deleteAccount: "https://cristiandev.app.n8n.cloud/webhook/auth/delete",
  },
  onboarding: "https://cristiandev.app.n8n.cloud/webhook/onboarding",
  activity: {
    list: "https://PLACEHOLDER.n8n.cloud/webhook/activity/list",
  },
  profile: {
    get: "https://cristiandev.app.n8n.cloud/webhook/profile/get",
    update: "https://cristiandev.app.n8n.cloud/webhook/profile/update",
  },
  admin: {
    metrics: "https://cristiandev.app.n8n.cloud/webhook/admin/metrics",
    users: "https://cristiandev.app.n8n.cloud/webhook/admin/users",
    catalogs: {
      list: "https://cristiandev.app.n8n.cloud/webhook/admin/catalogs",
      create: "https://cristiandev.app.n8n.cloud/webhook/admin/catalogs/create",
      update: "https://cristiandev.app.n8n.cloud/webhook/admin/catalogs/update",
      delete: "https://cristiandev.app.n8n.cloud/webhook/admin/catalogs/delete",
    },
  },
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

export function post<T>(url: string, body: unknown): Promise<T> {
  return request<T>(url, { method: "POST", body: JSON.stringify(body) });
}

export function get<T>(url: string): Promise<T> {
  return request<T>(url);
}

import { USE_MOCK, BASE_URL, post } from './client';
import { MOCK_METRICS, MOCK_ADMIN_USERS } from '../mock/admin';
import { MOCK_BANKS, MOCK_CARRIERS, MOCK_PENSION_INSTITUTIONS } from '../mock/catalogs';
import type { AdminMetrics, AdminUser, CatalogItem, Catalogs } from '../types';

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAdminMetrics(): Promise<AdminMetrics> {
  if (USE_MOCK) {
    await delay();
    return MOCK_METRICS;
  }
  return post<AdminMetrics>(BASE_URL.admin.metrics, {});
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  if (USE_MOCK) {
    await delay();
    return MOCK_ADMIN_USERS;
  }
  return post<AdminUser[]>(BASE_URL.admin.users, {});
}

export async function getCatalogs(): Promise<Catalogs> {
  if (USE_MOCK) {
    await delay();
    return {
      banks: [...MOCK_BANKS],
      carriers: [...MOCK_CARRIERS],
      pensionInstitutions: [...MOCK_PENSION_INSTITUTIONS],
    };
  }
  return post<Catalogs>(BASE_URL.admin.catalogs.list, {});
}

export async function createCatalogItem(
  catalog: keyof Catalogs,
  item: Omit<CatalogItem, 'id'>,
): Promise<CatalogItem> {
  if (USE_MOCK) {
    await delay(400);
    return { id: `mock-${Date.now()}`, ...item };
  }
  return post<CatalogItem>(BASE_URL.admin.catalogs.create, { catalog, item });
}

export async function updateCatalogItem(catalog: keyof Catalogs, item: CatalogItem): Promise<void> {
  if (USE_MOCK) {
    await delay(400);
    return;
  }
  return post<void>(BASE_URL.admin.catalogs.update, { catalog, item });
}

export async function deleteCatalogItem(catalog: keyof Catalogs, id: string): Promise<void> {
  if (USE_MOCK) {
    await delay(400);
    return;
  }
  return post<void>(BASE_URL.admin.catalogs.delete, { catalog, id });
}

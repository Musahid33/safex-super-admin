export const TENANT_BASE_DOMAIN = "safex.cc.us";

export function tenantHostname(slug: string) {
  return `${slug}.${TENANT_BASE_DOMAIN}`;
}

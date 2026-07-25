/**
 * Multi-tenancy is deferred (see docs/architecture.md) — every query scopes to this single
 * seeded tenant until real tenant signup/switching exists. Swapping this for a
 * session-derived tenant id later is the only change multi-tenant support needs here.
 */
export const DEFAULT_TENANT_ID = 'default';
export const DEFAULT_TENANT_SLUG = 'default';
export const DEFAULT_TENANT_NAME = 'LAN Party Crew';

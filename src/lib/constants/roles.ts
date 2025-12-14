/**
 * Role ID constants
 */
export const ADMIN_ROLE_ID = '41fc96df-063b-433b-96f7-b5efc6978825';
export const CUSTOMER_ROLE_ID = 'a5fbd39c-6a51-4f36-8c7f-d171f355cb56';

/**
 * Role type definitions
 */
export type RoleType = 'ADMIN' | 'CUSTOMER';

export function isAdminRole(roleId: string | null | undefined): boolean {
  if (!roleId) return false;
  return roleId === ADMIN_ROLE_ID;
}

export function getRoleType(roleId: string | null | undefined): RoleType {
  return isAdminRole(roleId) ? 'ADMIN' : 'CUSTOMER';
}

export function getRoleDisplayName(role: RoleType): string {
  return role === 'ADMIN' ? 'Administrator' : 'Customer';
}


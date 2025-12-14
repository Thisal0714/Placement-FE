import type { ApiUser, User, ApiCreateUserData, ApiUpdateUserData, CreateUserData, UpdateUserData } from '@/types/user';
import { ADMIN_ROLE_ID, CUSTOMER_ROLE_ID } from '@/lib/constants/roles';

/**
 * Converts API role_name to frontend UserRole
 */
function convertRoleName(roleName: 'ADMIN' | 'CUSTOMER'): 'Administrator' | 'Customer' {
  return roleName === 'ADMIN' ? 'Administrator' : 'Customer';
}

/**
 * Converts role_id to UserRole
 */
function convertRoleIdToRole(roleId: string): 'Administrator' | 'Customer' {
  if (roleId === ADMIN_ROLE_ID) return 'Administrator';
  if (roleId === CUSTOMER_ROLE_ID) return 'Customer';
  return 'Customer'; 
}


export function convertRoleToRoleId(role: 'Administrator' | 'Customer'): string {
  return role === 'Administrator' ? ADMIN_ROLE_ID : CUSTOMER_ROLE_ID;
}


export function transformApiUser(apiUser: ApiUser): User {
  return {
    id: apiUser.id,
    firstName: apiUser.first_name,
    lastName: apiUser.last_name,
    email: apiUser.email,
    role: apiUser.role ? convertRoleName(apiUser.role.role_name) : convertRoleIdToRole(apiUser.role_id),
    createdAt: apiUser.created_at,
    updatedAt: apiUser.updated_at,
  };
}


export function transformApiUsers(apiUsers: ApiUser[]): User[] {
  return apiUsers.map(transformApiUser);
}


export function transformCreateUserData(data: CreateUserData): ApiCreateUserData {
  return {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    password: data.password,
    role_id: convertRoleToRoleId(data.role),
  };
}

export function transformUpdateUserData(data: UpdateUserData): ApiUpdateUserData {
  const apiData: ApiUpdateUserData = {
    first_name: data.firstName,
    last_name: data.lastName,
    email: data.email,
    role_id: convertRoleToRoleId(data.role),
  };
  
  if (data.password) {
    apiData.password = data.password;
  }
  
  return apiData;
}



export type UserRole = 'Administrator' | 'Customer';

export interface ApiRole {
  id: string;
  role_name: 'ADMIN' | 'CUSTOMER';
  created_at: string;
  updated_at: string;
}

export interface ApiUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified_at: string | null;
  role_id: string;
  created_at: string;
  updated_at: string;
  role?: ApiRole;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiCreateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role_id: string;
}

export interface ApiUpdateUserData {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
  role_id: string;
}
export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserData {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: UserRole;
}


export type UserRole = 'Administrator' | 'Customer';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
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


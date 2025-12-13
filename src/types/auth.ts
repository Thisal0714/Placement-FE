export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  user?: {
    id: string;
    email: string;
    role_id: string;
    firstName?: string;
    lastName?: string;
  };
  message?: string;
}


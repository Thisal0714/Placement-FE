export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      role_id: string;
    };
  };
  message?: string;
}


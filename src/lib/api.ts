import type { User, CreateUserData, UpdateUserData } from '@/types/user';
import type { Product, CreateProductData, UpdateProductData } from '@/types/product';
import type { LoginCredentials, LoginResponse } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

async function apiRequestFormData<T>(
  endpoint: string,
  formData: FormData,
  method: string = 'POST'
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    method,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Auth endpoints
  auth: {
    login: (credentials: LoginCredentials) => apiRequest<LoginResponse>('/api/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  },
  
  // User endpoints
  users: {
    list: () => apiRequest<{ users: User[] }>('/api'),
    get: (id: string) => apiRequest<{ user: User }>(`/users/${id}`),
    create: (data: CreateUserData) => apiRequest<{ user: User }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id: string, data: UpdateUserData) => apiRequest<{ user: User }>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id: string) => apiRequest<{ message: string }>(`/users/${id}`, {
      method: 'DELETE',
    }),
  },
  
  // Product endpoints
  products: {
    list: () => apiRequest<{ products: Product[] }>('/api/products'),
    get: (id: string) => apiRequest<{ product: Product }>(`/api/products/${id}`),
    create: (data: CreateProductData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      if (data.image) {
        formData.append('image', data.image);
      }
      return apiRequestFormData<{ product: Product }>('/api/products', formData, 'POST');
    },
    update: (id: string, data: UpdateProductData) => {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description);
      formData.append('price', data.price.toString());
      if (data.image) {
        formData.append('image', data.image);
      }
      return apiRequestFormData<{ product: Product }>(`/api/products/${id}`, formData, 'PUT');
    },
    delete: (id: string) => apiRequest<{ message: string }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },
};


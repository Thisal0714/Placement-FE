import type { CreateUserData, UpdateUserData, ApiUser } from '@/types/user';
import type { Product, CreateProductData, UpdateProductData } from '@/types/product';
import type { LoginCredentials, LoginResponse } from '@/types/auth';
import { transformApiUsers, transformApiUser, transformCreateUserData, transformUpdateUserData } from '@/lib/utils/userTransform';
import { uploadImageToFirebase } from '@/lib/utils/imageUpload';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: LoginCredentials) => apiRequest<LoginResponse>('/api/login', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(credentials),
    }),
  },
  
  users: {
    list: async () => {
      const response = await apiRequest<{ success: boolean; data: { users: ApiUser[] }; message: string | null }>('/api/users');
      return { users: transformApiUsers(response.data.users) };
    },
    get: async (id: string) => {
      const response = await apiRequest<{ success: boolean; data: { user: ApiUser }; message: string | null }>(`/api/users/${id}`);
      return { user: transformApiUser(response.data.user) };
    },
    create: async (data: CreateUserData) => {
      const apiData = transformCreateUserData(data);
      const response = await apiRequest<{ success: boolean; data: { user: ApiUser }; message: string | null }>('/api/register', {
        method: 'POST',
        body: JSON.stringify(apiData),
      });
      return { user: transformApiUser(response.data.user) };
    },
    update: async (id: string, data: UpdateUserData) => {
      const apiData = transformUpdateUserData(data);
      const response = await apiRequest<{ success: boolean; data: { user: ApiUser }; message: string | null }>(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(apiData),
      });
      return { user: transformApiUser(response.data.user) };
    },
    delete: (id: string) => apiRequest<{ success: boolean; data: null; message: string | null }>(`/api/users/${id}`, {
      method: 'DELETE',
    }),
  },
  
  products: {
    list: async () => {
      const response = await apiRequest<{ success: boolean; data: { products: Product[] }; message: string | null }>('/api/products');
      return response.data.products;
    },
    get: async (id: string) => {
      const response = await apiRequest<{ success: boolean; data: { product: Product }; message: string | null }>(`/api/products/${id}`);
      return response.data.product;
    },
    create: async (data: CreateProductData) => {
      let imageUrl = '';
      if ('image' in data && data.image instanceof File) {
        imageUrl = await uploadImageToFirebase(data.image);
      } else if (data.image_url) {
        imageUrl = data.image_url;
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        image_url: imageUrl,
      };

      const response = await apiRequest<{ success: boolean; data: { product: Product }; message: string | null }>('/api/products', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      return response.data.product;
    },
    update: async (id: string, data: UpdateProductData) => {
      let imageUrl = '';
      if ('image' in data && data.image instanceof File) {
        imageUrl = await uploadImageToFirebase(data.image);
      } else if (data.image_url) {
        imageUrl = data.image_url;
      }

      const payload = {
        name: data.name,
        description: data.description,
        price: data.price,
        ...(imageUrl && { image_url: imageUrl }),
      };

      const response = await apiRequest<{ success: boolean; data: { product: Product }; message: string | null }>(`/api/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      return response.data.product;
    },
    delete: (id: string) => apiRequest<{ success: boolean; data: null; message: string | null }>(`/api/products/${id}`, {
      method: 'DELETE',
    }),
  },
};


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image?: File;
}

export interface UpdateProductData {
  name: string;
  description: string;
  price: number;
  image?: File;
}


export interface Product {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: string;
  image_url?: string;
  image?: File;
}

export interface UpdateProductData {
  name: string;
  description: string;
  price: string;
  image_url?: string;
  image?: File;
}


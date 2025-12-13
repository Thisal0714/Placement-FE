'use client';

import { useState, useEffect, useRef } from 'react';
import type { Product, CreateProductData, UpdateProductData } from '@/types/product';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: CreateProductData | UpdateProductData) => void;
  onClose: () => void;
  isLoading?: boolean;
}

export default function ProductForm({ product, onSubmit, onClose, isLoading }: ProductFormProps) {
  const [formData, setFormData] = useState(() => ({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price.toString() || '',
    image: null as File | null,
  }));
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: null,
      });
      if (product.imageUrl) {
        setImagePreview(product.imageUrl);
      }
      setErrors({});
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        image: null,
      });
      setImagePreview(null);
      setErrors({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else {
      const priceNum = parseFloat(formData.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    if (!product && !formData.image) {
      newErrors.image = 'Product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: CreateProductData | UpdateProductData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
    };

    if (formData.image) {
      (submitData as CreateProductData | UpdateProductData).image = formData.image;
    }

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <h3 className="text-xl font-bold text-foreground">
            {product ? 'Edit Product' : 'Create Product'}
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-foreground mb-1">
              Product Image {!product && '*'}
            </label>
            <div className="mt-2">
              {imagePreview && (
                <div className="mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border border-border"
                  />
                </div>
              )}
              <input
                ref={fileInputRef}
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-2 border border-input rounded-md hover:bg-muted transition-colors text-foreground"
              >
                {imagePreview ? 'Change Image' : 'Choose Image'}
              </button>
              {errors.image && (
                <p className="mt-1 text-sm text-danger">{errors.image}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Product Name *
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.name ? 'border-danger' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter product name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-danger">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-1">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.description ? 'border-danger' : 'border-input'
              } focus:outline-none focus:ring-2 focus:ring-primary`}
              placeholder="Enter product description"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-danger">{errors.description}</p>
            )}
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-foreground mb-1">
              Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-muted-foreground">$</span>
              <input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className={`w-full pl-8 pr-3 py-2 border rounded-md ${
                  errors.price ? 'border-danger' : 'border-input'
                } focus:outline-none focus:ring-2 focus:ring-primary`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-danger">{errors.price}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : product ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


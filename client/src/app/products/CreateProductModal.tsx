import React, { ChangeEvent, FormEvent, useState } from "react";
import Header from "@/app/(components)/Header";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating: number;
};

type FormState = {
  name: string;
  price: string;
  stockQuantity: string;
  rating: string;
};

type CreateProductModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (formData: ProductFormData) => void;
};

const CreateProductModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateProductModalProps) => {
  const [formData, setFormData] = useState<FormState>({
    name: "",
    price: "",
    stockQuantity: "",
    rating: "",
  });

  const [errors, setErrors] = useState<Partial<ProductFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductFormData> = {};
    const price = parseFloat(formData.price);
    const stockQuantity = parseInt(formData.stockQuantity);
    const rating = parseFloat(formData.rating);

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (isNaN(price) || price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (isNaN(stockQuantity) || stockQuantity < 0) {
      newErrors.stockQuantity = "Stock quantity cannot be negative";
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user starts typing
    if (errors[name as keyof ProductFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreate({
        name: formData.name,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        rating: parseFloat(formData.rating),
      });
    }
  };

  if (!isOpen) return null;

  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles = "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md";
  const errorCssStyles = "text-red-500 text-sm mt-1";

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-20">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <Header name="Create New Product" />
        <form onSubmit={handleSubmit} className="mt-5">
          {/* PRODUCT NAME */}
          <label htmlFor="productName" className={labelCssStyles}>
            Product Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            onChange={handleChange}
            value={formData.name}
            className={`${inputCssStyles} ${errors.name ? 'border-red-500' : ''}`}
            required
          />
          {errors.name && <p className={errorCssStyles}>{errors.name}</p>}

          {/* PRICE */}
          <label htmlFor="productPrice" className={labelCssStyles}>
            Price
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            value={formData.price}
            min="0"
            step="0.01"
            className={`${inputCssStyles} ${errors.price ? 'border-red-500' : ''}`}
            required
          />
          {errors.price && <p className={errorCssStyles}>{errors.price}</p>}

          {/* STOCK QUANTITY */}
          <label htmlFor="stockQuantity" className={labelCssStyles}>
            Stock Quantity
          </label>
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            onChange={handleChange}
            value={formData.stockQuantity}
            min="0"
            className={`${inputCssStyles} ${errors.stockQuantity ? 'border-red-500' : ''}`}
            required
          />
          {errors.stockQuantity && <p className={errorCssStyles}>{errors.stockQuantity}</p>}

          {/* RATING */}
          <label htmlFor="rating" className={labelCssStyles}>
            Rating (0-5)
          </label>
          <input
            type="number"
            name="rating"
            placeholder="Rating"
            onChange={handleChange}
            value={formData.rating}
            min="0"
            max="5"
            step="0.1"
            className={`${inputCssStyles} ${errors.rating ? 'border-red-500' : ''}`}
            required
          />
          {errors.rating && <p className={errorCssStyles}>{errors.rating}</p>}

          {/* CREATE ACTIONS */}
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductModal;
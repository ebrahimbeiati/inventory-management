"use client";

import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "@/state/api";
import ImageUploader from "@/app/components/ImageUploader";

type ProductFormData = {
  name: string;
  price: number;
  stockQuantity: number;
  rating?: number;
  imageUrl?: string;
  category?: string;
  tags?: string;
  description?: string;
}

interface CreateProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (productData: ProductFormData) => void;
}

// Default empty form state
const DEFAULT_FORM_STATE: ProductFormData = {
  name: "",
  price: 0,
  stockQuantity: 0,
  rating: 0,
  imageUrl: "",
  category: "",
  tags: "",
  description: ""
};

export default function CreateProductModal({ isOpen, onClose, onCreate }: CreateProductModalProps) {
  const { data: categories } = useGetCategoriesQuery();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>({...DEFAULT_FORM_STATE});
  
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({...DEFAULT_FORM_STATE});
      setNewCategory("");
      setShowNewCategory(false);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // For numeric fields, validate the input
    if (name === "price" || name === "stockQuantity" || name === "rating") {
      // If value is empty, set to 0 instead of NaN
      const parsedValue = value === "" ? 0 : parseFloat(value);
      
      // Ensure we don't set NaN values
      setFormData({
        ...formData,
        [name]: isNaN(parsedValue) ? 0 : parsedValue,
      });
    } else {
      // For non-numeric fields, set the value as is
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (base64Image: string | null) => {
    setFormData({
      ...formData,
      imageUrl: base64Image || undefined,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Add new category to formData if provided
    let updatedData = { ...formData };
    if (showNewCategory && newCategory) {
      updatedData.category = newCategory;
    }
    
    onCreate(updatedData);
    
    // Reset form
    setFormData({...DEFAULT_FORM_STATE});
    setNewCategory("");
    setShowNewCategory(false);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Add New Product
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Product Information Section */}
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                id="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Price *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  id="stockQuantity"
                  required
                  min="0"
                  step="1"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                {showNewCategory ? (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="New category name"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(false)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <select
                      name="category"
                      id="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Select a category</option>
                      {categories?.map((category: any) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setShowNewCategory(true)}
                      className="px-3 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-500"
                    >
                      New
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  name="rating"
                  id="rating"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || 0}
                  onChange={handleInputChange}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                />
              </div>
            </div>

            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Image URL
              </label>
              <input
                type="text"
                name="imageUrl"
                id="imageUrl"
                value={formData.imageUrl || ''}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
              {formData.imageUrl && (
                <div className="mt-2 relative h-24 w-24 rounded overflow-hidden border border-gray-300 dark:border-gray-600">
                  <img 
                    src={formData.imageUrl} 
                    alt="Product preview" 
                    className="object-cover w-full h-full"
                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=No+Image')}
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags || ''}
                onChange={handleInputChange}
                placeholder="tag1, tag2, tag3"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
              />
              {formData.tags && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {formData.tags.split(',').map((tag, index) => (
                    tag.trim() && (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      >
                        {tag.trim()}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 sm:flex sm:flex-row-reverse border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full sm:w-auto sm:ml-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Saving...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full sm:mt-0 sm:w-auto inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
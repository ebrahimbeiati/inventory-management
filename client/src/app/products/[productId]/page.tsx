"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product, useGetProductsQuery, useUpdateProductMutation, useDeleteProductMutation, useGetCategoriesQuery } from "@/state/api";
import { ArrowLeft, Edit, Save, Trash2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import ImageUploader from "@/app/components/ImageUploader";
import ImagePlaceholder from "@/app/components/ImagePlaceholder";

// Extend the Product interface to include description
interface ProductWithDescription extends Product {
  description?: string;
}

export default function ProductDetails() {
  const { productId } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: products } = useGetProductsQuery();
  const { data: categories } = useGetCategoriesQuery();
  const [product, setProduct] = useState<ProductWithDescription | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<ProductWithDescription | null>(null);
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [nextProductId, setNextProductId] = useState<string | null>(null);
  const [prevProductId, setPrevProductId] = useState<string | null>(null);
  
  useEffect(() => {
    if (products) {
      const foundProduct = products.find(p => p.productId === productId);
      setProduct(foundProduct || null);
      setEditedProduct(foundProduct || null);
      
      // Find next and previous products for navigation
      const productIndex = products.findIndex(p => p.productId === productId);
      if (productIndex > 0) {
        setPrevProductId(products[productIndex - 1].productId);
      } else {
        setPrevProductId(null);
      }
      
      if (productIndex < products.length - 1 && productIndex !== -1) {
        setNextProductId(products[productIndex + 1].productId);
      } else {
        setNextProductId(null);
      }
      
      // Check if we should start in edit mode based on URL parameter
      const editMode = searchParams.get('edit') === 'true';
      if (editMode && foundProduct) {
        setIsEditing(true);
      }
    }
  }, [products, productId, searchParams]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (!editedProduct) return;
    
    setEditedProduct({
      ...editedProduct,
      [name]: name === "price" || name === "stockQuantity" || name === "rating" 
        ? parseFloat(value) 
        : value,
    });
  };

  const handleImageChange = (base64Image: string | null) => {
    if (!editedProduct) return;
    
    setEditedProduct({
      ...editedProduct,
      imageUrl: base64Image || undefined,
    });
  };

  const handleSave = async () => {
    if (!editedProduct) return;
    
    try {
      await updateProduct(editedProduct).unwrap();
      setProduct(editedProduct);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    try {
      await deleteProduct(product.productId).unwrap();
      router.push("/products");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto p-4 ml-0 sm:ml-64">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => router.push("/products")}
            className="mr-4 flex items-center text-blue-500 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Products
          </button>
        </div>
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">Product not found</p>
        </div>
      </div>
    );
  }

  // Function to render stars for rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    // Create full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={`star-${i}`} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73L5.82 21 12 17.27z" />
        </svg>
      );
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <svg key="half-star" className="w-4 h-4 text-yellow-400" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73L5.82 21 12 17.27z" fill="none" stroke="currentColor" />
          <path d="M12 2v15.27" fill="none" stroke="currentColor" />
          <path d="M12 17.27L5.82 21l1.63-7.03L2 9.24l7.19-.61L12 2" fill="none" stroke="currentColor" />
          <path d="M12 2l2.81 6.62L22 9.24l-5.46 4.73L18.18 21 12 17.27" fill="currentColor" />
        </svg>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} className="w-4 h-4 text-gray-300 dark:text-gray-600" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.62L12 2 9.19 8.62 2 9.24l5.45 4.73L5.82 21 12 17.27z" fill="none" stroke="currentColor" />
        </svg>
      );
    }
    
    return stars;
  };

  return (
    <div className="container mx-auto px-4 pb-8 sm:ml-64">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 sm:mb-6 mt-4">
        <div className="flex items-center mb-3 sm:mb-0">
          <button 
            onClick={() => router.push("/products")}
            className="mr-4 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>Back to Products</span>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold dark:text-white">
            {isEditing ? "Edit Product" : "Product Details"}
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {prevProductId && (
            <button
              onClick={() => router.push(`/products/${prevProductId}`)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Previous Product"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
          
          {nextProductId && (
            <button
              onClick={() => router.push(`/products/${nextProductId}`)}
              className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600"
              title="Next Product"
            >
              <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-4 sm:p-0">
          {/* Left side - Image */}
          <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-700 lg:border-r border-gray-200 dark:border-gray-600">
            {isEditing ? (
              <div className="w-full max-w-md">
                <ImageUploader 
                  currentImage={editedProduct?.imageUrl} 
                  onImageChange={handleImageChange}
                />
              </div>
            ) : (
              <>
                {product.imageUrl ? (
                  <div className="w-full max-w-xs h-64 sm:h-80 relative mb-3">
                    <Image 
                      src={product.imageUrl} 
                      alt={product.name}
                      fill
                      style={{ objectFit: "contain" }}
                      className="rounded-md"
                    />
                  </div>
                ) : (
                  <div className="w-full max-w-xs h-64 sm:h-80 flex items-center justify-center rounded-md mb-3">
                    <ImagePlaceholder size="lg" />
                  </div>
                )}
                {product.rating !== undefined && product.rating > 0 && (
                  <div className="flex items-center mt-4">
                    <div className="flex">
                      {renderRating(product.rating)}
                    </div>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">({product.rating.toFixed(1)})</span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right side - Product Info */}
          <div className="p-4 sm:p-8">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editedProduct?.name || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={editedProduct?.price || 0}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      name="stockQuantity"
                      value={editedProduct?.stockQuantity || 0}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      name="rating"
                      value={editedProduct?.rating || 0}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                      min="0"
                      max="5"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={editedProduct?.category || ""}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">Select a category</option>
                      {categories?.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <textarea
                    name="tags"
                    value={editedProduct?.tags || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={2}
                    placeholder="e.g., electronics, gadgets, new"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={editedProduct?.description || ""}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                    rows={4}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h1 className="text-xl sm:text-2xl font-bold dark:text-white">{product.name}</h1>
                <p className="text-2xl sm:text-3xl text-blue-600 dark:text-blue-400 font-bold">${product.price.toFixed(2)}</p>
                
                <div className="py-3 border-t border-b border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap items-center py-1">
                    <span className="text-gray-700 dark:text-gray-300 font-medium w-32">Stock Status:</span>
                    <span className={`mt-1 sm:mt-0 sm:ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                      product.stockQuantity > 10 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : product.stockQuantity > 0
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
                    </span>
                  </div>
                  
                  {product.category && (
                    <div className="flex flex-wrap items-center py-1">
                      <span className="text-gray-700 dark:text-gray-300 font-medium w-32">Category:</span>
                      <span className="mt-1 sm:mt-0 sm:ml-2 inline-block bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 text-xs rounded-full">
                        {product.category}
                      </span>
                    </div>
                  )}
                </div>

                {product.description && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Description:</h3>
                    <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
                  </div>
                )}

                {product.tags && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 dark:text-gray-300 font-medium mb-2">Tags:</h3>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.split(',').map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 px-2 py-1 text-xs rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedProduct(product);
                    }}
                    className="flex items-center justify-center bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex-1 flex justify-center items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="flex items-center text-red-500 mb-4">
              <AlertCircle className="w-6 h-6 mr-2" />
              <h3 className="text-lg font-bold dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="mb-6 dark:text-gray-300">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-3 space-y-reverse sm:space-y-0 sm:space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                onClick={() => setIsDeleteConfirmOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                onClick={() => {
                  setIsDeleteConfirmOpen(false);
                  handleDelete();
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
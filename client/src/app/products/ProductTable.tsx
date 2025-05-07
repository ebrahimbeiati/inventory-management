"use client";

import { useState } from "react";
import { Product } from "@/state/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Eye, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Check, 
  ShoppingCart, 
  Tag,
  Info,
  DollarSign,
  Package,
  Calendar,
  Star
} from "lucide-react";
import ImagePlaceholder from "@/app/components/ImagePlaceholder";
import Rating from "@/app/components/Rating";

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
  selectedProducts: string[];
  toggleProductSelection: (productId: string) => void;
}

const ProductTable = ({ 
  products, 
  onEdit, 
  onDelete, 
  selectedProducts, 
  toggleProductSelection 
}: ProductTableProps) => {
  const router = useRouter();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) {
      return {
        label: "Out of Stock",
        colorClass: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
        icon: <AlertTriangle className="w-3 h-3 mr-1" />
      };
    } else if (quantity < 5) {
      return {
        label: "Low Stock",
        colorClass: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
        icon: <ShoppingCart className="w-3 h-3 mr-1" />
      };
    } else {
      return {
        label: "In Stock",
        colorClass: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
        icon: <Check className="w-3 h-3 mr-1" />
      };
    }
  };

  const viewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
  };

  const editProduct = (product: Product) => {
    onEdit(product);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return 'Invalid date';
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  // Mobile view - renders a card for each product
  const renderMobileView = () => {
    if (products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <Info className="h-12 w-12 text-gray-400 mb-3" />
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No products found</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try changing your search or filters</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stockQuantity);
          return (
            <div 
              key={product.productId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start">
                <div className="mr-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
                    checked={selectedProducts.includes(product.productId)}
                    onChange={() => toggleProductSelection(product.productId)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <div className="h-10 w-10 flex-shrink-0 mr-3">
                      {product.imageUrl ? (
                        <div className="relative h-10 w-10">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            sizes="40px"
                            className="object-cover rounded-md"
                          />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <ImagePlaceholder size="sm" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</h3>
                      {product.category && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">{product.category}</p>
                      )}
                    </div>
                  </div>
                  
                  {product.description && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {truncateText(product.description, 60)}
                    </p>
                  )}
                  
                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="flex items-center text-sm">
                      <DollarSign className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Package className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" />
                      <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stockStatus.colorClass}`}>
                        {product.stockQuantity === 0 
                          ? 'Out of stock' 
                          : product.stockQuantity < 5 
                          ? `Low: ${product.stockQuantity}` 
                          : product.stockQuantity}
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" />
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {formatDate(product.updatedAt || product.createdAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Star className="w-3 h-3 text-gray-500 dark:text-gray-400 mr-1" />
                      <div className="flex items-center">
                        <Rating value={product.rating || 0} size="small" />
                        <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                          {product.rating ? product.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {product.tags && product.tags.trim() !== '' && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.tags.split(',').slice(0, 2).map((tag, index) => (
                        <span 
                          key={index} 
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                        >
                          <Tag className="w-2 h-2 mr-1" />
                          {tag.trim()}
                        </span>
                      ))}
                      {product.tags.split(',').length > 2 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          +{product.tags.split(',').length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2 border-t border-gray-200 dark:border-gray-700 pt-2">
                    <button
                      onClick={() => viewProduct(product.productId)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-1"
                      title="View details"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => editProduct(product)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 p-1"
                      title="Edit product"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onDelete(product.productId)}
                      className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-1"
                      title="Delete product"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Desktop view - table layout
  const renderDesktopView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedProducts.length === products.length && products.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      products.forEach(product => {
                        if (!selectedProducts.includes(product.productId)) {
                          toggleProductSelection(product.productId);
                        }
                      });
                    } else {
                      products.forEach(product => {
                        if (selectedProducts.includes(product.productId)) {
                          toggleProductSelection(product.productId);
                        }
                      });
                    }
                  }}
                />
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Updated
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rating
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-4 whitespace-nowrap text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center py-8">
                    <Info className="h-12 w-12 text-gray-400 mb-3" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-300">No products found</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Try changing your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const stockStatus = getStockStatus(product.stockQuantity);
                return (
                  <tr 
                    key={product.productId} 
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                      hoveredRow === product.productId ? 'bg-gray-50 dark:bg-gray-700' : ''
                    }`}
                    onMouseEnter={() => setHoveredRow(product.productId)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={selectedProducts.includes(product.productId)}
                        onChange={() => toggleProductSelection(product.productId)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 mr-3">
                          {product.imageUrl ? (
                            <div className="relative h-10 w-10">
                              <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                sizes="40px"
                                className="object-cover rounded-md"
                              />
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                              <ImagePlaceholder size="sm" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {truncateText(product.description, 40)}
                          </div>
                          {product.tags && product.tags.trim() !== '' && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {product.tags.split(',').slice(0, 2).map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                                >
                                  <Tag className="w-2 h-2 mr-1" />
                                  {tag.trim()}
                                </span>
                              ))}
                              {product.tags.split(',').length > 2 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                                  +{product.tags.split(',').length - 2}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {product.category || '-'}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        ${product.price.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Value: ${(product.price * product.stockQuantity).toFixed(2)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        product.stockQuantity === 0
                          ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : product.stockQuantity < 5
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                          : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      }`}>
                        {product.stockQuantity === 0 
                          ? 'Out of stock' 
                          : product.stockQuantity < 5 
                          ? `Low: ${product.stockQuantity}` 
                          : product.stockQuantity}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(product.updatedAt || product.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <Rating value={product.rating || 0} size="small" />
                        <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                          {product.rating ? product.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => viewProduct(product.productId)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                          title="View details"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => editProduct(product)}
                          className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300"
                          title="Edit product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => onDelete(product.productId)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
                          title="Delete product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile view for small screens */}
      <div className="md:hidden">
        {renderMobileView()}
      </div>
      
      {/* Desktop view for medium screens and above */}
      <div className="hidden md:block">
        {renderDesktopView()}
      </div>
    </>
  );
};

export default ProductTable; 
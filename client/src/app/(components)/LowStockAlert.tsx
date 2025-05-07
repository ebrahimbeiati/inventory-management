"use client";

import { useEffect, useState } from "react";
import { useGetProductsQuery } from "@/state/api";
import { AlertTriangle, X } from "lucide-react";
import { useRouter } from "next/navigation";

const LowStockAlert = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: products } = useGetProductsQuery();
  const router = useRouter();
  
  const lowStockProducts = products?.filter(p => p.stockQuantity < 5 && p.stockQuantity > 0) || [];
  const outOfStockProducts = products?.filter(p => p.stockQuantity === 0) || [];
  
  useEffect(() => {
    // Show notification if there are low stock items
    if (lowStockProducts.length > 0 || outOfStockProducts.length > 0) {
      setIsOpen(true);
    }
  }, [lowStockProducts.length, outOfStockProducts.length]);
  
  if (!isOpen || (lowStockProducts.length === 0 && outOfStockProducts.length === 0)) {
    return null;
  }
  
  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
      <div className="bg-amber-500 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center text-white">
          <AlertTriangle className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Inventory Alert</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-white hover:text-amber-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="p-4 max-h-80 overflow-auto">
        {outOfStockProducts.length > 0 && (
          <div className="mb-3">
            <h4 className="font-semibold text-red-600 mb-2">Out of Stock ({outOfStockProducts.length})</h4>
            <ul className="space-y-1">
              {outOfStockProducts.slice(0, 3).map(product => (
                <li 
                  key={product.productId}
                  className="flex justify-between items-center p-2 bg-red-50 rounded cursor-pointer hover:bg-red-100"
                  onClick={() => {
                    router.push(`/products/${product.productId}`);
                    setIsOpen(false);
                  }}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">Stock: 0</span>
                </li>
              ))}
              {outOfStockProducts.length > 3 && (
                <li className="text-center text-sm text-gray-500 mt-1">
                  +{outOfStockProducts.length - 3} more items
                </li>
              )}
            </ul>
          </div>
        )}
        
        {lowStockProducts.length > 0 && (
          <div>
            <h4 className="font-semibold text-amber-600 mb-2">Low Stock ({lowStockProducts.length})</h4>
            <ul className="space-y-1">
              {lowStockProducts.slice(0, 3).map(product => (
                <li 
                  key={product.productId}
                  className="flex justify-between items-center p-2 bg-amber-50 rounded cursor-pointer hover:bg-amber-100"
                  onClick={() => {
                    router.push(`/products/${product.productId}`);
                    setIsOpen(false);
                  }}
                >
                  <span className="font-medium">{product.name}</span>
                  <span className="text-xs bg-amber-200 text-amber-800 px-2 py-1 rounded">
                    Stock: {product.stockQuantity}
                  </span>
                </li>
              ))}
              {lowStockProducts.length > 3 && (
                <li className="text-center text-sm text-gray-500 mt-1">
                  +{lowStockProducts.length - 3} more items
                </li>
              )}
            </ul>
          </div>
        )}
        
        <button
          onClick={() => {
            router.push('/products');
            setIsOpen(false);
          }}
          className="w-full mt-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Manage Inventory
        </button>
      </div>
    </div>
  );
};

export default LowStockAlert; 
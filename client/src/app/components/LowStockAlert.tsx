"use client";

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useGetProductsQuery } from '@/state/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const LowStockAlert = () => {
  const { user } = useAuth();
  const { data: products } = useGetProductsQuery(undefined, {
    // Skip the query if user is not authenticated
    skip: !user
  });
  const [isVisible, setIsVisible] = useState(false);
  const [lowStockProducts, setLowStockProducts] = useState<{ id: string; name: string; quantity: number }[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (user && products) {
      const lowStock = products.filter(
        product => product.stockQuantity > 0 && product.stockQuantity < 5
      ).map(product => ({
        id: product.productId,
        name: product.name,
        quantity: product.stockQuantity
      }));
      
      setLowStockProducts(lowStock);
      setIsVisible(lowStock.length > 0);
    } else {
      setLowStockProducts([]);
      setIsVisible(false);
    }
  }, [products, user]);

  if (!user || !isVisible || lowStockProducts.length === 0) {
    return null;
  }

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/products/${productId}`);
    setIsVisible(false);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-400 dark:border-yellow-600 p-4 rounded shadow-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Low Stock Alert ({lowStockProducts.length} {lowStockProducts.length === 1 ? 'product' : 'products'})
            </p>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-yellow-50 dark:bg-yellow-900/40 text-yellow-500 dark:text-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-600 p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/60"
              onClick={handleDismiss}
            >
              <span className="sr-only">Dismiss</span>
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 max-h-40 overflow-y-auto pr-1">
            <ul className="space-y-1">
              {lowStockProducts.map((product) => (
                <li key={product.id} className="text-sm text-yellow-700 dark:text-yellow-300 flex justify-between">
                  <button 
                    onClick={() => handleViewProduct(product.id)}
                    className="hover:underline text-left flex-1 truncate"
                  >
                    {product.name}
                  </button>
                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 rounded-full text-xs">
                    {product.quantity} left
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-3">
            <button
              type="button"
              onClick={() => router.push('/products')}
              className="text-sm font-medium text-yellow-800 dark:text-yellow-200 hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              View all inventory
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowStockAlert; 
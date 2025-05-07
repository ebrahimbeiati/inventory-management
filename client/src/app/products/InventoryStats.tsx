"use client";

import { useGetProductsQuery } from "@/state/api";
import {  
  AlertTriangle, 
  DollarSign, 
  Package, 
  BarChart3,
  PercentIcon,
  AlertOctagon
} from "lucide-react";
import { useRouter } from "next/navigation";

const InventoryStats = () => {
  const { data: products } = useGetProductsQuery();
  const router = useRouter();

  if (!products || products.length === 0) {
    return null;
  }

  // Calculate inventory statistics
  const totalProducts = products.length;
  const totalInventoryValue = products.reduce(
    (sum, product) => sum + product.price * product.stockQuantity,
    0
  );
  const totalStockQuantity = products.reduce(
    (sum, product) => sum + product.stockQuantity,
    0
  );
  const averagePrice = totalProducts > 0 
    ? products.reduce((sum, product) => sum + product.price, 0) / totalProducts
    : 0;
  const lowStockProducts = products.filter(
    (product) => product.stockQuantity < 5 && product.stockQuantity > 0
  );
  const outOfStockProducts = products.filter(
    (product) => product.stockQuantity === 0
  );
  
  // Calculate stock efficiency (percentage of products with healthy stock levels)
  const healthyStockProducts = products.filter(product => product.stockQuantity >= 5).length;
  const stockEfficiency = totalProducts > 0 ? (healthyStockProducts / totalProducts) * 100 : 0;
  
  const handleCardClick = (filterType: string) => {
    switch (filterType) {
      case 'low-stock':
        if (lowStockProducts.length > 0) {
          // Redirect to products with low stock filter
          router.push('/products');
        }
        break;
      case 'out-of-stock':
        if (outOfStockProducts.length > 0) {
          // Redirect to products with out of stock filter
          router.push('/products');
        }
        break;
      default:
        router.push('/products');
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Inventory Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center border-l-4 border-blue-500">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
            <Package className="text-blue-600 dark:text-blue-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {products.length} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">items</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center border-l-4 border-green-500">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
            <DollarSign className="text-green-600 dark:text-green-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Inventory Value</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${totalInventoryValue.toFixed(2)}
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center border-l-4 border-yellow-500">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg mr-4">
            <AlertTriangle className="text-yellow-600 dark:text-yellow-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Low Stock</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {lowStockProducts.length} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">items</span>
            </p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex items-center border-l-4 border-red-500">
          <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg mr-4">
            <AlertOctagon className="text-red-600 dark:text-red-400 w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Out of Stock</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {outOfStockProducts.length} <span className="text-sm font-normal text-gray-500 dark:text-gray-400">items</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Additional statistics - second row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock Efficiency</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{stockEfficiency.toFixed(1)}%</p>
                {stockEfficiency > 75 ? (
                  <span className="ml-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs px-2 py-1 rounded-full">Good</span>
                ) : stockEfficiency > 50 ? (
                  <span className="ml-2 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs px-2 py-1 rounded-full">Fair</span>
                ) : (
                  <span className="ml-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs px-2 py-1 rounded-full">Poor</span>
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Products with healthy stock levels</p>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-lg">
              <PercentIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${
                  stockEfficiency > 75 ? 'bg-green-600' : 
                  stockEfficiency > 50 ? 'bg-yellow-500' : 
                  'bg-red-600'
                }`} 
                style={{ width: `${stockEfficiency}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Inventory</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{(totalStockQuantity / totalProducts).toFixed(1)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Units per product</p>
            </div>
            <div className="bg-teal-100 dark:bg-teal-900 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
          
          <div className="mt-4 flex flex-col">
            <div className="grid grid-cols-3 text-xs text-gray-500 dark:text-gray-400 mb-1">
              <span>Min Stock</span>
              <span className="text-center">Average</span>
              <span className="text-right">Max Stock</span>
            </div>
            <div className="flex items-center w-full">
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.min(...products.map(p => p.stockQuantity))}</span>
              <div className="flex-1 mx-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
                <div className="bg-teal-500 h-1 rounded-full" style={{ width: '50%' }}></div>
              </div>
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{Math.max(...products.map(p => p.stockQuantity))}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryStats; 
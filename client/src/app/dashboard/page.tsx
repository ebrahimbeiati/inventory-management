"use client"
import React, { useState, useEffect } from 'react'
import { TrendingUp, Activity, Calendar, Clock, Filter } from 'lucide-react'
import { useGetProductsQuery } from "@/state/api"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"
import InventoryStats from "../products/InventoryStats"

// Type for our data summary
type ProductSummary = {
  category: string;
  stockQuantity: number;
  inventoryValue: number;
}

const Dashboard = () => {
  const { data: products, isLoading } = useGetProductsQuery()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [stockFilter, setStockFilter] = useState<'all' | 'outOfStock' | 'lowStock' | 'inStock'>('all')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  // Detect dark mode from system preferences and update when it changes
  useEffect(() => {
    // Check if user prefers dark mode
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Set initial value
    setIsDarkMode(darkModeQuery.matches);
    
    // Create a listener function
    const listener = (e: MediaQueryListEvent) => {
      setIsDarkMode(e.matches);
    };
    
    // Add the listener to detect changes
    darkModeQuery.addEventListener('change', listener);
    
    // Clean up
    return () => {
      darkModeQuery.removeEventListener('change', listener);
    };
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ml-0 sm:ml-64">
        <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500">No inventory data available. Add some products to see your dashboard.</p>
        </div>
      </div>
    )
  }

  // Category data for charts
  const categoryData: ProductSummary[] = []
  const categoryMap = new Map<string, ProductSummary>()
  
  products.forEach(product => {
    const category = product.category || 'Uncategorized'
    const inventoryValue = product.price * product.stockQuantity
    
    if (categoryMap.has(category)) {
      const existing = categoryMap.get(category)!
      existing.stockQuantity += product.stockQuantity
      existing.inventoryValue += inventoryValue
    } else {
      categoryMap.set(category, {
        category,
        stockQuantity: product.stockQuantity,
        inventoryValue
      })
    }
  })
  
  categoryMap.forEach(value => {
    categoryData.push(value)
  })
  
  // Stock distribution data for pie chart
  let filteredProducts = products;
  if (stockFilter === 'outOfStock') {
    filteredProducts = products.filter(p => p.stockQuantity === 0);
  } else if (stockFilter === 'lowStock') {
    filteredProducts = products.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5);
  } else if (stockFilter === 'inStock') {
    filteredProducts = products.filter(p => p.stockQuantity >= 5);
  }
  
  const stockDistribution = [
    { name: 'Out of Stock', value: filteredProducts.filter(p => p.stockQuantity === 0).length },
    { name: 'Low Stock', value: filteredProducts.filter(p => p.stockQuantity > 0 && p.stockQuantity < 5).length },
    { name: 'Healthy Stock', value: filteredProducts.filter(p => p.stockQuantity >= 5).length }
  ]
  
  const stockColors = ['#EF4444', '#F59E0B', '#10B981']
  
  // Price ranges data
  const priceRanges = [
    { name: '$0-$10', count: products.filter(p => p.price >= 0 && p.price <= 10).length },
    { name: '$10-$50', count: products.filter(p => p.price > 10 && p.price <= 50).length },
    { name: '$50-$100', count: products.filter(p => p.price > 50 && p.price <= 100).length },
    { name: '$100-$500', count: products.filter(p => p.price > 100 && p.price <= 500).length },
    { name: '$500+', count: products.filter(p => p.price > 500).length }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ml-0 sm:ml-64">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inventory Dashboard</h1>
          <p className="text-gray-600 dark:text-white mt-1">Overview of your inventory performance and statistics</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-1">
          <button 
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === 'week' 
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === 'month' 
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === 'quarter' 
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setTimeRange('quarter')}
          >
            Quarter
          </button>
          <button 
            className={`px-3 py-1.5 text-sm rounded ${
              timeRange === 'year' 
                ? 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>
      
      {/* Stats cards */}
      <InventoryStats />
      
      {/* Analytics Section */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Activity className="h-5 w-5 text-blue-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Analytics & Insights</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock by Category</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Clock className="h-3 w-3 mr-1" />
                <span>Updated now</span>
              </div>
            </div>
            <div className="h-80 ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <YAxis 
                    width={50}
                    tickFormatter={(value) => value.toLocaleString()}
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toLocaleString()} units`, 'Stock']}
                    labelFormatter={(value) => `Category: ${value}`}
                    contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb", color: isDarkMode ? "#e5e7eb" : "#111827" }}
                  />
                  <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#111827" }} />
                  <Bar dataKey="stockQuantity" name="Stock Quantity" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Inventory Value by Category */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center ">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inventory Value by Category</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <Calendar className="h-3 w-3 ml-3" />
                <span>{timeRange}</span>
              </div>
            </div>
            <div className="h-80 ml-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categoryData}
                  margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="category" 
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <YAxis 
                    width={80}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`$${value.toFixed(2).toLocaleString()}`, 'Value']}
                    labelFormatter={(value) => `Category: ${value}`}
                    contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb", color: isDarkMode ? "#e5e7eb" : "#111827" }}
                  />
                  <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#111827" }} />
                  <Bar dataKey="inventoryValue" name="Inventory Value" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Stock Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2 sm:mb-0">Stock Distribution</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setStockFilter('all')}
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stockFilter === 'all' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <Filter className="h-3 w-3 mr-1" />
                  <span>All Products</span>
                </button>
                <button 
                  onClick={() => setStockFilter('outOfStock')}
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stockFilter === 'outOfStock' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>Out of Stock</span>
                </button>
                <button 
                  onClick={() => setStockFilter('lowStock')}
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stockFilter === 'lowStock' 
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>Low Stock</span>
                </button>
                <button 
                  onClick={() => setStockFilter('inStock')}
                  className={`flex items-center text-xs px-2 py-1 rounded-full ${
                    stockFilter === 'inStock' 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>In Stock</span>
                </button>
              </div>
            </div>
            <div className="h-72 sm:h-80 flex flex-col items-center justify-center">
              {stockDistribution.every(item => item.value === 0) ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-10">
                  <p>No products match the selected filter.</p>
                  <button 
                    onClick={() => setStockFilter('all')} 
                    className="mt-2 text-blue-600 dark:text-blue-400 underline text-sm"
                  >
                    Reset filter
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-full max-w-[280px] mx-auto">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={stockDistribution}
                          cx="50%"
                          cy="50%"
                          label={false}
                          outerRadius={65}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {stockDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={stockColors[index % stockColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value) => [`${value} products`, 'Count']}
                          contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb", color: isDarkMode ? "#e5e7eb" : "#111827" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap justify-center mt-4 gap-3">
                    {stockDistribution.map((entry, index) => {
                      // Calculate percentage
                      const total = stockDistribution.reduce((acc, curr) => acc + curr.value, 0);
                      const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
                      
                      if (entry.value === 0) return null;
                      
                      return (
                        <div key={index} className="flex items-center px-3 py-1.5 bg-gray-50 dark:bg-gray-700 rounded-full shadow-sm">
                          <div 
                            className="w-4 h-4 rounded-full mr-2" 
                            style={{ backgroundColor: stockColors[index] }}
                          ></div>
                          <span className="text-sm text-gray-700 dark:text-gray-200">
                            {entry.name}: <strong>{entry.value}</strong> ({percentage}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Price Range Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price Ranges</h3>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span>{products.length} Products</span>
              </div>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceRanges}
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#374151" : "#e5e7eb"} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <YAxis 
                    width={50}
                    tickFormatter={(value) => value.toString()}
                    tick={{ fill: isDarkMode ? "#9ca3af" : "#4b5563" }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value} products`, 'Count']}
                    labelFormatter={(value) => `Price Range: ${value}`}
                    contentStyle={{ backgroundColor: isDarkMode ? "#1f2937" : "#ffffff", borderColor: isDarkMode ? "#374151" : "#e5e7eb", color: isDarkMode ? "#e5e7eb" : "#111827" }}
                  />
                  <Legend wrapperStyle={{ color: isDarkMode ? "#e5e7eb" : "#111827" }} />
                  <Bar dataKey="count" name="Product Count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inventory Health Summary</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Products</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Avg. Stock</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-3 bg-gray-50 dark:bg-gray-700 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {Array.from(categoryMap.entries()).map(([category, data], idx) => {
                const categoryProducts = products.filter(p => (p.category || 'Uncategorized') === category)
                const avgStock = data.stockQuantity / categoryProducts.length
                const hasLowStock = categoryProducts.some(p => p.stockQuantity < 5 && p.stockQuantity > 0)
                const hasOutOfStock = categoryProducts.some(p => p.stockQuantity === 0)
                
                let status = 'Healthy'
                let statusClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                
                if (hasOutOfStock) {
                  status = 'Critical'
                  statusClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                } else if (hasLowStock) {
                  status = 'Warning'
                  statusClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                }
                
                return (
                  <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{categoryProducts.length}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{avgStock.toFixed(1)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${data.inventoryValue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
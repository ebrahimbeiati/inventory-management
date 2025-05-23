"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProductsQuery } from "@/state/api";
import {
  Package,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Search,
  Download,
  X,
  BarChart3,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Users,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Eye,
  FileText,
  Printer,
  Share2,
  Settings,
  Bell,
  User,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Star,
  Heart,
  MessageSquare,
  Share,
  Bookmark,
  Flag,
  MoreVertical,
  ExternalLink,
  Copy,
  Link,
  QrCode,
  PieChart,
  LineChart,
  Activity,
  Target,
  Award,
  Trophy,
  Medal,
  Crown,
  Loader2,
  Tag,
  Box,
  AlertCircle,
  Upload,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'in-stock' | 'low-stock' | 'out-of-stock';
  lastUpdated: string;
  supplier?: string;
  sku?: string;
}

interface ProductMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Laptop Pro X1",
    category: "Electronics",
    price: 1299.99,
    stock: 15,
    status: "in-stock",
    lastUpdated: "2024-02-20",
    supplier: "Tech Supplies Inc",
    sku: "LAP-001",
  },
  {
    id: "2",
    name: "Wireless Mouse",
    category: "Electronics",
    price: 49.99,
    stock: 3,
    status: "low-stock",
    lastUpdated: "2024-02-19",
    supplier: "Tech Supplies Inc",
    sku: "MOU-002",
  },
  {
    id: "3",
    name: "Office Chair",
    category: "Furniture",
    price: 199.99,
    stock: 0,
    status: "out-of-stock",
    lastUpdated: "2024-02-18",
    supplier: "Office Solutions",
    sku: "CHA-003",
  },
  {
    id: "4",
    name: "Desk Lamp",
    category: "Furniture",
    price: 29.99,
    stock: 25,
    status: "in-stock",
    lastUpdated: "2024-02-17",
    supplier: "Office Solutions",
    sku: "LAM-004",
  },
];

const Products = () => {
  const { user } = useAuth();
  const { data: productsData, isLoading, isError } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sortField, setSortField] = useState<keyof Product>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Transform API data to match our interface
  const products: Product[] = productsData?.map(product => ({
    id: product.productId || "",
    name: product.name || "",
    category: product.category || "Uncategorized",
    price: product.price || 0,
    stock: product.stockQuantity || 0,
    status: (product.stockQuantity || 0) > 10 ? "in-stock" : (product.stockQuantity || 0) > 0 ? "low-stock" : "out-of-stock",
    lastUpdated: new Date().toISOString(),
    supplier: product.supplier || "Unknown",
    sku: product.sku || "N/A",
  })) || [];

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.supplier.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort filtered products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  const metrics: ProductMetric[] = [
    {
      id: "total",
      label: "Total Products",
      value: products.length,
      change: 12.5,
      trend: "up",
      icon: Package,
    },
    {
      id: "revenue",
      label: "Total Revenue",
      value: products.reduce((sum, p) => sum + p.price, 0),
      change: 8.3,
      trend: "up",
      icon: DollarSign,
    },
    {
      id: "low_stock",
      label: "Low Stock Items",
      value: products.filter(p => p.status === "low-stock").length,
      change: -5.2,
      trend: "down",
      icon: AlertTriangle,
    },
    {
      id: "out_of_stock",
      label: "Out of Stock",
      value: products.filter(p => p.status === "out-of-stock").length,
      change: 2.1,
      trend: "up",
      icon: AlertTriangle,
    },
  ];

  // Get unique categories and ensure they're all strings
  const categories = ["all", ...new Set(products.map(p => p.category || "Uncategorized"))].filter(Boolean);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvContent = products
        .map(product => `${product.id},${product.name},${product.category},${product.price},${product.stock}`)
        .join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "products-export.csv");
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error exporting:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    try {
      setIsSharing(true);
      const reportData = {
        title: "Products Report",
        text: "Current products report",
        url: window.location.href,
      };

      if (navigator.share) {
        await navigator.share(reportData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Report link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in-stock':
        return 'text-green-400 bg-green-400/10';
      case 'low-stock':
        return 'text-yellow-400 bg-yellow-400/10';
      case 'out-of-stock':
        return 'text-red-400 bg-red-400/10';
      default:
        return 'text-gray-400 bg-gray-400/10';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading products...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="rounded-full bg-red-500/20 p-3">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <p className="text-red-400">Failed to load products</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-60 border border-gray-700 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} />
            <span className="hidden md:inline">Add Product</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Updated</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {sortedProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{product.name}</div>
                    {product.sku && (
                      <div className="text-xs text-gray-400">SKU: {product.sku}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">{product.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">${product.price.toFixed(2)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">{product.stock}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {product.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">{formatDate(product.lastUpdated)}</div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-300">
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex flex-wrap gap-4">
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
          <Download size={20} />
          <span>Export</span>
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors">
          <Upload size={20} />
          <span>Import</span>
        </button>
      </div>

      {/* Product Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl rounded-lg bg-gray-800 p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-16 w-16 rounded-lg bg-gray-600 flex items-center justify-center">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
                    <p className="text-gray-400">SKU: {selectedProduct.sku}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCloseModal}
                  className="rounded-lg p-2 text-gray-400 hover:bg-gray-700"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Tag className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                    <p className="mt-1 font-medium">{selectedProduct.category}</p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Box className="h-4 w-4" />
                      <span>Supplier</span>
                    </div>
                    <p className="mt-1 font-medium">{selectedProduct.supplier}</p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                    <p className="mt-1 font-medium">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <BarChart3 className="h-4 w-4" />
                      <span>Stock</span>
                    </div>
                    <p className="mt-1 font-medium">{selectedProduct.stock} units</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 rounded-lg border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 rounded-lg bg-red-500 px-4 py-2 text-sm text-white hover:bg-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;
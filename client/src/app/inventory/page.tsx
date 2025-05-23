"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProductsQuery } from "@/state/api";
import {
  Package,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Search,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
  Download,
  Printer,
  Share2,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Tag,
  Box,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  PackageSearch,
  Filter,
  Eye,
  TrendingDown,
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "in_stock" | "low_stock" | "out_of_stock";
  lastUpdated: string;
  supplier: string;
  sku: string;
  sales: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  metrics: {
    revenue: number;
    profit: number;
    margin: number;
  };
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  status: "in_stock" | "low_stock" | "out_of_stock" | "overstock" | "reserved" | "in_transit";
  lastUpdated: string;
  location: {
    warehouse: string;
    aisle: string;
    shelf: string;
    bin: string;
  };
  supplier: {
    name: string;
    contact: string;
    leadTime: number;
    reliability: number;
  };
  sku: string;
  value: number;
  reorderPoint: number;
  leadTime: number;
  batchInfo: {
    batchNumber: string;
    manufacturingDate: string;
    expiryDate: string;
    qualityStatus: "approved" | "pending" | "rejected";
  };
  logistics: {
    lastShipmentDate: string;
    nextShipmentDate: string;
    carrier: string;
    trackingNumber: string;
    shippingMethod: string;
  };
  metrics: {
    turnover: number;
    daysOfStock: number;
    stockoutRisk: number;
    carryingCost: number;
    orderFrequency: number;
    safetyStock: number;
  };
}

interface InventoryMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
  color: string;
}

interface StockMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

export default function Inventory() {
  const { data: productsData, isLoading, isError } = useGetProductsQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [sortField, setSortField] = useState<keyof InventoryItem>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  // Transform API data to match our interface
  const inventoryItems: InventoryItem[] = productsData?.map(product => ({
    id: product.id || "",
    name: product.name || "",
    category: product.category || "Uncategorized",
    quantity: product.stock || 0,
    minQuantity: 5,
    maxQuantity: 100,
    status: (product.stock || 0) > 10 ? "in_stock" : (product.stock || 0) > 0 ? "low_stock" : "out_of_stock",
    lastUpdated: new Date().toISOString(),
    location: {
      warehouse: "Warehouse A",
      aisle: "A" + Math.floor(Math.random() * 10),
      shelf: "S" + Math.floor(Math.random() * 5),
      bin: "B" + Math.floor(Math.random() * 20),
    },
    supplier: {
      name: product.supplier || "Unknown",
      contact: "supplier@example.com",
      leadTime: 7,
      reliability: Math.floor(Math.random() * 100),
    },
    sku: product.sku || "N/A",
    value: (product.price || 0) * (product.stock || 0),
    reorderPoint: 10,
    leadTime: 7,
    batchInfo: {
      batchNumber: "B" + Math.floor(Math.random() * 10000),
      manufacturingDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
      expiryDate: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      qualityStatus: "approved",
    },
    logistics: {
      lastShipmentDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextShipmentDate: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      carrier: ["UPS", "FedEx", "DHL"][Math.floor(Math.random() * 3)],
      trackingNumber: "TRK" + Math.floor(Math.random() * 1000000),
      shippingMethod: ["Standard", "Express", "Priority"][Math.floor(Math.random() * 3)],
    },
    metrics: {
      turnover: Math.random() * 12,
      daysOfStock: Math.floor(Math.random() * 30),
      stockoutRisk: Math.random() * 100,
      carryingCost: Math.random() * 1000,
      orderFrequency: Math.floor(Math.random() * 30),
      safetyStock: Math.floor(Math.random() * 20),
    },
  })) || [];

  // Filter items based on search query, category, and status
  const filteredItems = inventoryItems.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      item.name.toLowerCase().includes(searchLower) ||
      item.category.toLowerCase().includes(searchLower) ||
      item.sku.toLowerCase().includes(searchLower) ||
      item.location.warehouse.toLowerCase().includes(searchLower) ||
      item.location.aisle.toLowerCase().includes(searchLower) ||
      item.location.shelf.toLowerCase().includes(searchLower) ||
      item.location.bin.toLowerCase().includes(searchLower);
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Sort filtered items
  const sortedItems = [...filteredItems].sort((a, b) => {
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

  const metrics: InventoryMetric[] = [
    {
      id: "total_items",
      label: "Total Items",
      value: inventoryItems.length,
      change: 12.5,
      trend: "up",
      icon: Package,
      color: "blue",
    },
    {
      id: "total_value",
      label: "Total Value",
      value: inventoryItems.reduce((sum, item) => sum + item.value, 0),
      change: 8.3,
      trend: "up",
      icon: DollarSign,
      color: "green",
    },
    {
      id: "in_transit",
      label: "In Transit",
      value: inventoryItems.filter(item => item.status === "in_transit").length,
      change: 5.2,
      trend: "up",
      icon: PackageSearch,
      color: "purple",
    },
    {
      id: "carrying_cost",
      label: "Carrying Cost",
      value: inventoryItems.reduce((sum, item) => sum + item.metrics.carryingCost, 0),
      change: -2.1,
      trend: "down",
      icon: BarChart3,
      color: "yellow",
    },
  ];

  const categories = ["all", ...new Set(inventoryItems.map(item => item.category || "Uncategorized"))].filter(Boolean);
  const statuses = ["all", "in_stock", "low_stock", "out_of_stock", "overstock"];

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDetails = (item: InventoryItem) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const csvContent = inventoryItems
        .map(item => `${item.id},${item.name},${item.category},${item.quantity},${item.value}`)
        .join("\n");
      
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      
      link.setAttribute("href", url);
      link.setAttribute("download", "inventory-export.csv");
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
        title: "Inventory Report",
        text: "Current inventory report",
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

  const stockMetrics: StockMetric[] = [
    {
      id: "total_products",
      label: "Total Products",
      value: inventoryItems.length,
      change: 8.3,
      trend: "up",
      icon: Package,
    },
    {
      id: "low_stock",
      label: "Low Stock Items",
      value: inventoryItems.filter(item => item.status === "low_stock").length,
      change: -2.1,
      trend: "down",
      icon: AlertTriangle,
    },
    {
      id: "out_of_stock",
      label: "Out of Stock",
      value: inventoryItems.filter(item => item.status === "out_of_stock").length,
      change: 1.5,
      trend: "up",
      icon: AlertTriangle,
    },
    {
      id: "total_value",
      label: "Total Value",
      value: inventoryItems.reduce((sum, item) => sum + item.value, 0),
      change: 12.5,
      trend: "up",
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <p className="text-gray-400">Loading inventory...</p>
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
          <p className="text-red-400">Failed to load inventory</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory</h1>
          <p className="text-gray-400">Manage your product inventory</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
            <Plus size={20} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stockMetrics.map((metric) => (
          <div
            key={`metric-${metric.id}`}
            className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <metric.icon size={20} />
                <span className="text-sm">{metric.label}</span>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">
                {metric.id === "total_value" ? formatCurrency(metric.value) : metric.value.toLocaleString()}
              </div>
              <div className="mt-2 flex items-center gap-2">
                {metric.trend === "up" ? (
                  <TrendingUp className="text-green-400" size={16} />
                ) : (
                  <TrendingDown className="text-red-400" size={16} />
                )}
                <span
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {metric.change}%
                </span>
                <span className="text-sm text-gray-400">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Products Table */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option key="all-category" value="all" disabled>All Categories</option>
                <option key="electronics" value="Electronics">Electronics</option>
                <option key="accessories" value="Accessories">Accessories</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option key="all-status" value="all" disabled>All Status</option>
                <option key="in-stock" value="in_stock">In Stock</option>
                <option key="low-stock" value="low_stock">Low Stock</option>
                <option key="out-of-stock" value="out_of_stock">Out of Stock</option>
              </select>
              <button className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600">
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700/50">
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Product</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">SKU</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Stock</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Price</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Last Updated</th>
                <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedItems.map((item) => (
                <tr key={`product-${item.id}`} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-white">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">{item.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">{item.sku}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{item.quantity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-white">{formatCurrency(item.value)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      item.status === "in_stock" ? "bg-green-400 text-green-400" :
                      item.status === "low_stock" ? "bg-yellow-400 text-yellow-400" :
                      "bg-red-400 text-red-400"
                    }`}>
                      {item.status === "in_stock" ? "In Stock" : item.status === "low_stock" ? "Low Stock" : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-400">
                      {new Date(item.lastUpdated).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-gray-400 hover:text-white">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-white">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Item Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
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
                    <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                    <p className="text-gray-400">SKU: {selectedItem.sku}</p>
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
                    <p className="mt-1 font-medium">{selectedItem.category}</p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <Box className="h-4 w-4" />
                      <span>Location</span>
                    </div>
                    <p className="mt-1 font-medium">
                      {selectedItem.location.aisle}-{selectedItem.location.shelf}-{selectedItem.location.bin}
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <DollarSign className="h-4 w-4" />
                      <span>Value</span>
                    </div>
                    <p className="mt-1 font-medium">{formatCurrency(selectedItem.value)}</p>
                  </div>
                  <div className="rounded-lg bg-gray-700/50 p-4">
                    <div className="flex items-center space-x-2 text-gray-400">
                      <BarChart3 className="h-4 w-4" />
                      <span>Quantity</span>
                    </div>
                    <p className="mt-1 font-medium">{selectedItem.quantity} units</p>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-400">Inventory Metrics</h3>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Turnover Rate</p>
                      <p className="mt-1 text-lg font-medium">{selectedItem.metrics.turnover.toFixed(1)}x/year</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Days of Stock</p>
                      <p className="mt-1 text-lg font-medium">{selectedItem.metrics.daysOfStock} days</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Stockout Risk</p>
                      <p className="mt-1 text-lg font-medium">{selectedItem.metrics.stockoutRisk.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-400">Reorder Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Reorder Point</p>
                      <p className="mt-1 text-lg font-medium">{selectedItem.reorderPoint} units</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Lead Time</p>
                      <p className="mt-1 text-lg font-medium">{selectedItem.leadTime} days</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-400">Location Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Warehouse</p>
                      <p className="mt-1 font-medium">{selectedItem.location.warehouse}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Storage Location</p>
                      <p className="mt-1 font-medium">
                        {selectedItem.location.aisle}-{selectedItem.location.shelf}-{selectedItem.location.bin}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-400">Batch Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Batch Number</p>
                      <p className="mt-1 font-medium">{selectedItem.batchInfo.batchNumber}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Quality Status</p>
                      <p className="mt-1 font-medium">{selectedItem.batchInfo.qualityStatus}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Manufacturing Date</p>
                      <p className="mt-1 font-medium">
                        {new Date(selectedItem.batchInfo.manufacturingDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Expiry Date</p>
                      <p className="mt-1 font-medium">
                        {new Date(selectedItem.batchInfo.expiryDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="mb-4 text-sm font-medium text-gray-400">Logistics Information</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Carrier</p>
                      <p className="mt-1 font-medium">{selectedItem.logistics.carrier}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Tracking Number</p>
                      <p className="mt-1 font-medium">{selectedItem.logistics.trackingNumber}</p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Last Shipment</p>
                      <p className="mt-1 font-medium">
                        {new Date(selectedItem.logistics.lastShipmentDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-lg bg-gray-700/50 p-4">
                      <p className="text-sm text-gray-400">Next Shipment</p>
                      <p className="mt-1 font-medium">
                        {new Date(selectedItem.logistics.nextShipmentDate).toLocaleDateString()}
                      </p>
                    </div>
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
}
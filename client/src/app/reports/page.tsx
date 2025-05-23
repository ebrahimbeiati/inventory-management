"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  ArrowUpRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ReportMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

interface SalesData {
  date: string;
  revenue: number;
  orders: number;
}

const mockSalesData: SalesData[] = [
  { date: "2024-01", revenue: 15000, orders: 120 },
  { date: "2024-02", revenue: 18000, orders: 150 },
  { date: "2024-03", revenue: 22000, orders: 180 },
  { date: "2024-04", revenue: 25000, orders: 200 },
  { date: "2024-05", revenue: 28000, orders: 220 },
  { date: "2024-06", revenue: 30000, orders: 240 },
];

const Reports = () => {
  const { } = useAuth();
  const [dateRange, setDateRange] = useState("last30days");
  const [selectedMetric, setSelectedMetric] = useState("revenue");

  const metrics: ReportMetric[] = [
    {
      id: "revenue",
      label: "Total Revenue",
      value: 150000,
      change: 12.5,
      trend: "up",
      icon: DollarSign,
    },
    {
      id: "orders",
      label: "Total Orders",
      value: 1250,
      change: 8.3,
      trend: "up",
      icon: ShoppingCart,
    },
    {
      id: "customers",
      label: "New Customers",
      value: 180,
      change: -5.2,
      trend: "down",
      icon: Users,
    },
    {
      id: "products",
      label: "Products Sold",
      value: 3500,
      change: 15.7,
      trend: "up",
      icon: Package,
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-gray-400">View and analyze your business metrics</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-48 border border-gray-700 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            >
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisYear">This Year</option>
            </select>
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download size={20} />
            <span className="hidden md:inline">Export Report</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-400">
                <metric.icon size={20} />
                <span className="text-sm">{metric.label}</span>
              </div>
              <button
                onClick={() => setSelectedMetric(metric.id)}
                className={`p-1 rounded-lg transition-colors ${
                  selectedMetric === metric.id
                    ? "bg-blue-500/20 text-blue-400"
                    : "hover:bg-gray-700/50 text-gray-400"
                }`}
              >
                <BarChart3 size={16} />
              </button>
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">
                {metric.id === "revenue" ? formatCurrency(metric.value) : formatNumber(metric.value)}
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
                <span className="text-sm text-gray-400">vs last period</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-400">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockSalesData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
                tickFormatter={(value) => `$${value/1000}k`}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem',
                }}
                labelStyle={{ color: '#F3F4F6' }}
                itemStyle={{ color: '#F3F4F6' }}
                formatter={(value: number, name: string) => {
                  if (name === 'revenue') {
                    return [formatCurrency(value), 'Revenue'];
                  }
                  return [value, 'Orders'];
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="orders"
                stroke="#22C55E"
                fillOpacity={1}
                fill="url(#colorOrders)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {mockSalesData.slice(-3).map((data, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gray-700/50">
                  <ShoppingCart className="text-gray-400" size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {formatNumber(data.orders)} orders
                  </p>
                  <p className="text-xs text-gray-400">{data.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">
                  {formatCurrency(data.revenue)}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <ArrowUpRight size={14} />
                  <span>12%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 
"use client";

import { useAuth } from "@/hooks/useAuth";
import { Bell, Search } from "lucide-react";
import React from "react";
import {
  Area,
  AreaChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

interface Stat {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: 'up' | 'down';
  change: string;
}

interface Activity {
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
}

const stats: Stat[] = [
  {
    title: "Total Sales",
    value: "$24,500",
    icon: <Bell className="h-6 w-6 text-blue-500" />,
    trend: "up",
    change: "+12.5%",
  },
  {
    title: "Total Orders",
    value: "1,234",
    icon: <Bell className="h-6 w-6 text-green-500" />,
    trend: "up",
    change: "+8.2%",
  },
  {
    title: "Total Products",
    value: "567",
    icon: <Bell className="h-6 w-6 text-yellow-500" />,
    trend: "down",
    change: "-2.4%",
  },
  {
    title: "Total Customers",
    value: "890",
    icon: <Bell className="h-6 w-6 text-purple-500" />,
    trend: "up",
    change: "+5.7%",
  },
];

const salesData = [
  { date: "Jan", sales: 4000 },
  { date: "Feb", sales: 3000 },
  { date: "Mar", sales: 5000 },
  { date: "Apr", sales: 2780 },
  { date: "May", sales: 1890 },
  { date: "Jun", sales: 2390 },
];

const inventoryData = [
  { name: "Electronics", value: 400 },
  { name: "Clothing", value: 300 },
  { name: "Food", value: 200 },
  { name: "Other", value: 100 },
];

const recentActivity: Activity[] = [
  {
    title: "New Order",
    description: "Order #12345 has been placed",
    time: "2 hours ago",
    icon: <Bell className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "Low Stock Alert",
    description: "Product #789 is running low on stock",
    time: "4 hours ago",
    icon: <Bell className="h-6 w-6 text-yellow-500" />,
  },
  {
    title: "New Customer",
    description: "John Doe has created an account",
    time: "6 hours ago",
    icon: <Bell className="h-6 w-6 text-green-500" />,
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {user?.name || 'User'}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 w-full md:w-60 border border-gray-700 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
            <Bell size={20} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">{stat.title}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className="p-3 rounded-full bg-gray-700/50">
                {stat.icon}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm">
                <span className={`font-medium ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {stat.change}
                </span>
                <span className="text-gray-400 ml-2">vs last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Sales Overview</h2>
            <select className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3B82F6"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Inventory Chart */}
        <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Inventory Status</h2>
            <select className="bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Food</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(31, 41, 55)',
                    border: '1px solid rgb(75, 85, 99)',
                    borderRadius: '0.5rem',
                    color: 'white',
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-gray-300">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50">
        <div className="p-6 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
        </div>
        <div className="divide-y divide-gray-700/50">
          {recentActivity.map((activity, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-full bg-gray-700/50">
                  {activity.icon}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{activity.title}</p>
                  <p className="text-gray-400 text-sm mt-1">{activity.description}</p>
                  <p className="text-gray-500 text-xs mt-2">{activity.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
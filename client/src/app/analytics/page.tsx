"use client";

import React from "react";
import Header from "@/app/(components)/Header";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  Cell
} from "recharts";

const Analytics = () => {
  // Sample data for the charts
  const salesData = [
    { name: "Jan", value: 4000 },
    { name: "Feb", value: 3000 },
    { name: "Mar", value: 5000 },
    { name: "Apr", value: 2780 },
    { name: "May", value: 1890 },
    { name: "Jun", value: 2390 },
  ];

  const productCategoryData = [
    { name: "Electronics", value: 400 },
    { name: "Clothing", value: 300 },
    { name: "Furniture", value: 200 },
    { name: "Books", value: 150 },
    { name: "Others", value: 100 },
  ];

  const customerRetentionData = [
    { name: "Week 1", new: 45, returning: 120 },
    { name: "Week 2", new: 52, returning: 130 },
    { name: "Week 3", new: 48, returning: 150 },
    { name: "Week 4", new: 61, returning: 180 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <Header name="Analytics & Insights" />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* KPI Cards */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">$24,780</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+12% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">New Customers</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">237</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+5% from last month</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Avg. Order Value</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">$128</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">+3% from last month</p>
        </div>
      </div>
      
      {/* Sales Trend Chart */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Monthly Sales Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Sales ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Categories Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Sales by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productCategoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}`, "Units Sold"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Customer Retention Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Customer Acquisition</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={customerRetentionData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" stackId="a" fill="#8884d8" name="New Customers" />
                <Bar dataKey="returning" stackId="a" fill="#82ca9d" name="Returning Customers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Additional Insights Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Key Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Top Selling Products</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>Wireless Headphones - 124 units</li>
              <li>Smart Watch - 98 units</li>
              <li>Laptop Sleeve - 76 units</li>
            </ol>
          </div>
          
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Geographic Distribution</h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 dark:text-gray-400">
              <li>North America - 45%</li>
              <li>Europe - 30%</li>
              <li>Asia - 20%</li>
              <li>Others - 5%</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 
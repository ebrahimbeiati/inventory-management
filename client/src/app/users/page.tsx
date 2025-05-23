"use client";

import { useState } from "react";
import {
  Users as UsersIcon,
  UserPlus,
  Search,
  Filter,
  MapPin,
  Shield,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
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

interface UserMetric {
  id: string;
  label: string;
  value: number;
  change: number;
  trend: "up" | "down";
  icon: React.ElementType;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  status: "active" | "inactive";
  lastActive: string;
  location: string;
  phone?: string;
}

interface UserActivity {
  date: string;
  newUsers: number;
  activeUsers: number;
}

const mockUserActivity: UserActivity[] = [
  { date: "2024-01", newUsers: 15, activeUsers: 120 },
  { date: "2024-02", newUsers: 18, activeUsers: 150 },
  { date: "2024-03", newUsers: 22, activeUsers: 180 },
  { date: "2024-04", newUsers: 25, activeUsers: 200 },
  { date: "2024-05", newUsers: 28, activeUsers: 220 },
  { date: "2024-06", newUsers: 30, activeUsers: 240 },
];

const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "admin",
    status: "active",
    lastActive: "2024-03-15",
    location: "New York, USA",
    phone: "+1 234 567 890",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "manager",
    status: "active",
    lastActive: "2024-03-14",
    location: "London, UK",
    phone: "+44 123 456 789",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "user",
    status: "inactive",
    lastActive: "2024-03-10",
    location: "Sydney, Australia",
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "user",
    status: "active",
    lastActive: "2024-03-15",
    location: "Toronto, Canada",
    phone: "+1 987 654 321",
  },
];

const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const metrics: UserMetric[] = [
    {
      id: "total",
      label: "Total Users",
      value: 150,
      change: 12.5,
      trend: "up",
      icon: UsersIcon,
    },
    {
      id: "active",
      label: "Active Users",
      value: 120,
      change: 8.3,
      trend: "up",
      icon: UsersIcon,
    },
    {
      id: "new",
      label: "New Users",
      value: 15,
      change: -5.2,
      trend: "down",
      icon: UserPlus,
    },
    {
      id: "admins",
      label: "Administrators",
      value: 5,
      change: 0,
      trend: "up",
      icon: Shield,
    },
  ];

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400">Manage and monitor user activity</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full md:w-64 border border-gray-700 bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 text-gray-300">
            <Filter size={20} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UserPlus size={20} />
            <span className="hidden md:inline">Add User</span>
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
            </div>
            <div className="mt-4">
              <div className="text-2xl font-bold text-white">
                {formatNumber(metric.value)}
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

      {/* User Activity Chart */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">User Activity</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-400">New Users</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-400">Active Users</span>
            </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={mockUserActivity}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActiveUsers" x1="0" y1="0" x2="0" y2="1">
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
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="newUsers"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorNewUsers)"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="activeUsers"
                stroke="#22C55E"
                fillOpacity={1}
                fill="url(#colorActiveUsers)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User List */}
      <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-lg font-semibold text-white">User List</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedRole(null)}
              className={`px-3 py-1 rounded-lg text-sm ${
                !selectedRole
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedRole("admin")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedRole === "admin"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Admins
            </button>
            <button
              onClick={() => setSelectedRole("manager")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedRole === "manager"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Managers
            </button>
            <button
              onClick={() => setSelectedRole("user")}
              className={`px-3 py-1 rounded-lg text-sm ${
                selectedRole === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Users
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-gray-700/50">
                <th className="pb-4 font-medium">Name</th>
                <th className="pb-4 font-medium">Role</th>
                <th className="pb-4 font-medium">Status</th>
                <th className="pb-4 font-medium">Last Active</th>
                <th className="pb-4 font-medium">Location</th>
                <th className="pb-4 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="text-sm">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-white">{user.name}</div>
                        <div className="text-gray-400">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-500/20 text-purple-400"
                        : user.role === "manager"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                    }`}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 text-gray-400">{user.lastActive}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin size={16} />
                      <span>{user.location}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg border border-gray-700/50 p-6 max-w-lg w-full mx-4">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{selectedUser.name}</h3>
                <p className="text-gray-400">{selectedUser.email}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={20} />
                <span>{selectedUser.location}</span>
              </div>
              {selectedUser.phone && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Shield size={20} />
                  <span>{selectedUser.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.role === "admin"
                    ? "bg-purple-500/20 text-purple-400"
                    : selectedUser.role === "manager"
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}>
                  {selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedUser.status === "active"
                    ? "bg-green-500/20 text-green-400"
                    : "bg-red-500/20 text-red-400"
                }`}>
                  {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
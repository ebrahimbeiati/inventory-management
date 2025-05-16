"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, Users, ShoppingCart, BarChart2, 
  Settings, LogOut, User, HelpCircle,
  LineChart, FileText, ChevronLeft, ChevronRight,
  Menu
} from 'lucide-react';
// import { useAppSelector } from '@/app/redux'; // removed unused
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  onClose: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle logout action
  const handleLogout = () => {
    signOut();
    router.push('/login');
    onClose();
  };

  // Get current route
  const isClient = typeof window !== 'undefined';
  const pathname = isClient ? window.location.pathname : '';

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navItems = [
    { path: '/dashboard', icon: BarChart2, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/products/bulk-update', icon: ShoppingCart, label: 'Bulk Update' },
    { path: '/users', icon: Users, label: 'Users' },
    { path: '/analytics', icon: LineChart, label: 'Analytics' },
    { path: '/reports', icon: FileText, label: 'Reports' },
    { path: '/help', icon: HelpCircle, label: 'Help' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">Inventory Pro</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <nav className="py-2">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <div 
                    className={`flex items-center px-4 py-3 text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                        : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="ml-3">{item.label}</span>
                  </div>
                </Link>
              ))}
              <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:block fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out transform ${
        isCollapsed ? 'md:w-20' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : ''}`}>
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">Inventory Pro</span>
          </div>
          <div className="flex items-center">
            <button 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Sidebar content */}
        <div className="py-4 px-3">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <div 
                  className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </div>
              </Link>
            ))}
          </nav>
          
          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center min-w-0 flex-1">
                <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                {!isCollapsed && (
                  <div className="ml-3 text-sm min-w-0 flex-1">
                    <p className="font-medium text-gray-700 dark:text-gray-300 truncate">
                      {user?.role || 'User'}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 truncate max-w-[150px]" title={user?.email}>
                      {user?.email}
                    </p>
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
} 
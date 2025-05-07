"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Home, Package, Users, ShoppingCart, BarChart2, 
  Settings, LogOut, ChevronLeft, Menu, User, X, HelpCircle
} from 'lucide-react';
import { useAppSelector } from '@/app/redux';
import { useAuth } from '@/hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  // Handle logout action
  const handleLogout = () => {
    logout();
    router.push('/login');
    onClose(); // Close the sidebar after logout
  };

  // Handle clicking on mobile sidebar links
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  // Get current route
  const isClient = typeof window !== 'undefined';
  const pathname = isClient ? window.location.pathname : '';

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-md">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white">Inventory Pro</span>
          </div>
          <button 
            className="md:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sidebar content */}
        <div className="py-4 px-3">
          <nav className="space-y-1">
            <Link href="/dashboard">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/dashboard') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <BarChart2 className="w-5 h-5 mr-3" />
                Dashboard
              </div>
            </Link>

            <Link href="/products">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/products') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <Package className="w-5 h-5 mr-3" />
                Products
              </div>
            </Link>

            <Link href="/products/bulk-update">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/products/bulk-update') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <ShoppingCart className="w-5 h-5 mr-3" />
                Bulk Update
              </div>
            </Link>

            <Link href="/users">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/users') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <Users className="w-5 h-5 mr-3" />
                Users
              </div>
            </Link>

            <Link href="/help">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/help') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <HelpCircle className="w-5 h-5 mr-3" />
                Help
              </div>
            </Link>

            <Link href="/settings">
              <div 
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive('/settings') 
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={handleLinkClick}
              >
                <Settings className="w-5 h-5 mr-3" />
                Settings
              </div>
            </Link>
          </nav>
          
          {/* Sidebar footer */}
          <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700">
                  <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700 dark:text-gray-300">Admin User</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Logout"
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
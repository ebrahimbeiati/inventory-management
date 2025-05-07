"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Package, 
  BarChart2, 
  Users, 
  Settings, 
  FileText, 
  CreditCard, 
  LogOut, 
  X, 
  DollarSign 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/products', name: 'Products', icon: <Package className="w-5 h-5" /> },
    { path: '/users', name: 'Users', icon: <Users className="w-5 h-5" /> },
    { path: '/expenses', name: 'Expenses', icon: <DollarSign className="w-5 h-5" /> },
    { path: '/reports', name: 'Reports', icon: <FileText className="w-5 h-5" /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/settings', name: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Desktop Sidebar - fixed on the left */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-gray-800 dark:text-white">Inventory App</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-between flex-1 overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                    isActive(item.path)
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                onClick={() => alert("Logout functionality would go here")}
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Sidebar - slide over */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 flex z-40">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose}></div>
          
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={onClose}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-xl font-semibold text-gray-800 dark:text-white">Inventory App</span>
              </div>
            </div>
            
            <div className="flex-1 h-0 overflow-y-auto">
              <nav className="px-2 py-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      isActive(item.path)
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                    }`}
                    onClick={onClose}
                  >
                    {item.icon}
                    <span className="ml-3">{item.name}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                  onClick={() => alert("Logout functionality would go here")}
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar; 
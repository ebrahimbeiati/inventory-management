"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Package, 
  BarChart2, 
  Menu, 
  X, 
  Search,
  User,
  ShoppingCart,
  Bell,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useGetProductsQuery } from "@/state/api";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotificationTooltip, setShowNotificationTooltip] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { signOut, user } = useAuth();
  const { data: products, isLoading: isLoadingProducts, error: productsError } = useGetProductsQuery();

  // Calculate notifications
  const lowStockProducts = products?.filter(p => p.stockQuantity < 5 && p.stockQuantity > 0) || [];
  const outOfStockProducts = products?.filter(p => p.stockQuantity === 0) || [];
  const lowStockCount = lowStockProducts.length;
  const outOfStockCount = outOfStockProducts.length;
  const totalAlerts = lowStockCount + outOfStockCount;

  useEffect(() => {
    if (isLoadingProducts) {
      console.log('Loading products...');
    } else if (productsError) {
      console.error('Error loading products:', productsError);
    } else {
      console.log('Products loaded:', products);
      console.log('Low stock count:', lowStockCount);
      console.log('Out of stock count:', outOfStockCount);
      console.log('Total alerts:', totalAlerts);
    }
  }, [products, isLoadingProducts, productsError, lowStockCount, outOfStockCount, totalAlerts]);

  // Handle mobile menu
  const handleMobileMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    if (onMenuClick) {
      onMenuClick();
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
    setSearchTerm('');
  };

  // Handle logout
  const handleLogout = () => {
    signOut();
    router.push('/login');
    setIsUserMenuOpen(false);
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { href: '/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { href: '/products/bulk-update', label: 'Bulk Update', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white shadow-md' 
        : 'bg-white/90 backdrop-blur-md'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/dashboard">
              <div className="flex items-center cursor-pointer">
                <div className="bg-blue-600 text-white p-2 rounded-md">
                  <Package className="w-5 h-5" />
                </div>
                <span className="ml-2 font-bold text-lg text-gray-900">Inventory Pro</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <div className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Search and Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                    bg-white text-gray-900
                    focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </form>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => router.push('/products')}
                onMouseEnter={() => setShowNotificationTooltip(true)}
                onMouseLeave={() => setShowNotificationTooltip(false)}
                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative"
                title="Stock Alerts"
              >
                <Bell className="w-5 h-5" />
                {!isLoadingProducts && totalAlerts > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {totalAlerts}
                    </span>
                    {/* Tooltip */}
                    {showNotificationTooltip && (
                      <div 
                        className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 z-[9999] text-left border border-gray-200 dark:border-gray-700"
                        style={{ transform: 'translateY(8px)' }}
                      >
                        <div className="space-y-3">
                          {lowStockCount > 0 && (
                            <div className="flex items-center text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{lowStockCount} {lowStockCount === 1 ? 'product' : 'products'} low in stock</span>
                            </div>
                          )}
                          {outOfStockCount > 0 && (
                            <div className="flex items-center text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-2 rounded">
                              <AlertTriangle className="w-4 h-4 mr-2 flex-shrink-0" />
                              <span className="text-sm">{outOfStockCount} {outOfStockCount === 1 ? 'product' : 'products'} out of stock</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                  {user?.name ? (
                    <span className="text-blue-600 font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </div>
                <span className="hidden md:block text-sm font-medium text-gray-700">
                  {user?.name || 'User'}
                </span>
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 py-2 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || ''}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">
                      Role: {user?.role || 'User'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={handleMobileMenuClick}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile Search - Only visible on mobile */}
        <div className="md:hidden py-2">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 
                  bg-white text-gray-900
                  focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 text-gray-500 absolute left-3 top-2.5" />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
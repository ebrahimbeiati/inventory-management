"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Package, 
  BarChart2, 
  Settings, 
  User, 
  Menu, 
  X, 
  LogOut,
  ShoppingCart,
  Bell,
  Search,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Info,
  Star,
  StarHalf,
  StarOff,
  Search as SearchIcon,
  Sparkles,
  Check,
  Languages
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/app/redux';
import { setIsDarkMode } from '@/state';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showLanguageNote, setShowLanguageNote] = useState(false);
  const [hoveredLanguage, setHoveredLanguage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  // Add dark mode state and toggle
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();

  const toggleDarkMode = () => {
    dispatch(setIsDarkMode(!isDarkMode));
  };

  const languageCategories = {
    all: 'All Languages',
    popular: 'Popular',
    european: 'European',
    asian: 'Asian',
    middleEast: 'Middle East'
  };

  const languages = [
    { 
      code: 'en', 
      name: 'English', 
      flag: '🇺🇸',
      greeting: 'Hello!',
      color: 'from-blue-500 to-blue-600'
    },
    { 
      code: 'es', 
      name: 'Español', 
      flag: '🇪🇸',
      greeting: '¡Hola!',
      color: 'from-red-500 to-red-600'
    },
    { 
      code: 'fr', 
      name: 'Français', 
      flag: '🇫🇷',
      greeting: 'Bonjour!',
      color: 'from-blue-400 to-blue-500'
    },
    { 
      code: 'de', 
      name: 'Deutsch', 
      flag: '🇩🇪',
      greeting: 'Hallo!',
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const filteredLanguages = languages.filter(lang => {
    const matchesSearch = lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lang.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || lang.code === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getProficiencyIcon = (proficiency: string) => {
    switch (proficiency) {
      case 'complete':
        return <Star className="w-4 h-4 text-yellow-400" />;
      case 'partial':
        return <StarHalf className="w-4 h-4 text-yellow-400" />;
      case 'planned':
        return <StarOff className="w-4 h-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== 'en') {
      setShowLanguageNote(true);
      setTimeout(() => {
        setShowLanguageNote(false);
        setSelectedLanguage('en');
      }, 2000);
    } else {
      setSelectedLanguage(langCode);
    }
    setIsLanguageOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-selector')) {
        setIsLanguageOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to products page with search term
    if (searchTerm.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/products');
    }
    // Reset search state
    setSearchTerm('');
    setIsSearchOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { href: '/products', label: 'Products', icon: <Package className="w-5 h-5" /> },
    { href: '/products/bulk-update', label: 'Bulk Update', icon: <ShoppingCart className="w-5 h-5" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-30 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white dark:bg-gray-800 shadow-md' 
        : 'bg-white/90 dark:bg-gray-800/95 backdrop-blur-md'
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
                <span className="ml-2 font-bold text-lg text-gray-900 dark:text-white">Inventory Pro</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link href={link.href} key={link.href}>
                <div
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors ${
                    isActive(link.href)
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{link.icon}</span>
                  {link.label}
                </div>
              </Link>
            ))}
          </nav>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-2">
            {/* Search */}
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-1.5 rounded-md border border-gray-300 dark:border-gray-600 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                            focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
                <Search className="w-4 h-4 text-gray-500 dark:text-gray-400 absolute left-3 top-2" />
                <button
                  type="button"
                  className="absolute right-2 top-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Search className="w-5 h-5" />
              </button>
            )}

            {/* Language Selector */}
            <div className="relative language-selector">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="group flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 hover:from-gray-100 hover:to-gray-200 dark:hover:from-gray-700 dark:hover:to-gray-600 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300" />
                  <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {languages.find(lang => lang.code === selectedLanguage)?.flag}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-all duration-300 ${
                    isLanguageOpen ? 'rotate-180 text-blue-500 dark:text-blue-400' : ''
                  }`} 
                />
              </button>

              {/* Language Dropdown */}
              {isLanguageOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black/5 dark:ring-white/5 focus:outline-none z-50 animate-fadeIn overflow-hidden">
                  <div className="p-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        onMouseEnter={() => setHoveredLanguage(lang.code)}
                        onMouseLeave={() => setHoveredLanguage(null)}
                        className={`relative group flex items-center justify-between w-full px-4 py-3 text-sm transition-all duration-300 rounded-xl ${
                          selectedLanguage === lang.code
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/50 dark:to-blue-800/50'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`absolute -inset-1 bg-gradient-to-r ${lang.color} rounded-full opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`} />
                            <span className="text-xl relative">{lang.flag}</span>
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="font-medium text-gray-700 dark:text-gray-200">
                              {lang.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {hoveredLanguage === lang.code ? lang.greeting : ''}
                            </span>
                          </div>
                        </div>
                        {selectedLanguage === lang.code && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              Active
                            </span>
                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="p-1.5 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <Bell className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              <button className="flex items-center p-1.5 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="ml-1 p-1.5 rounded-md text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>

            {/* Dark Mode Toggle Button */}
            <button 
              onClick={toggleDarkMode}
              className="relative p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
              aria-label="Toggle Dark Mode"
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => {
                setIsMenuOpen(!isMenuOpen);
                if (onMenuClick) onMenuClick();
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-800 shadow-lg rounded-b-lg">
          {navLinks.map((link) => (
            <Link href={link.href} key={link.href}>
              <div
                className={`px-3 py-2 rounded-md text-base font-medium flex items-center ${
                  isActive(link.href)
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200'
                    : 'text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="mr-2">{link.icon}</span>
                {link.label}
              </div>
            </Link>
          ))}
          
          <div className="pt-4 pb-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user?.name || 'User'}
                </div>
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {user?.email || 'user@example.com'}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1 px-2">
              <button className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                <Bell className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Notifications
              </button>
              <button className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full">
                <Settings className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
              >
                <LogOut className="mr-2 h-5 w-5 text-gray-500 dark:text-gray-400" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language Note */}
      {showLanguageNote && (
        <div className="fixed top-4 right-4 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl text-sm text-gray-700 dark:text-gray-200 shadow-xl z-50 animate-slideIn border border-gray-100 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Languages className="w-5 h-5 text-blue-500 dark:text-blue-400" />
              <Sparkles className="w-3 h-3 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <p>Language support coming soon!</p>
          </div>
        </div>
      )}
    </header>
  );
}

// Add these styles to your global CSS file
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-8px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes slideIn {
  from { transform: translateX(100%) scale(0.95); opacity: 0; }
  to { transform: translateX(0) scale(1); opacity: 1; }
}

.animate-fadeIn {
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-slideIn {
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
`; 
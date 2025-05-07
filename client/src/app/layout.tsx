"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import LowStockAlert from './components/LowStockAlert';
import ThemeProvider from './components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle window resizing to close mobile sidebar automatically
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <html lang="en" className="light">
      <body className={`${inter.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200`}>
        <Provider store={store}>
          {/* Theme provider applies dark mode class based on Redux state */}
          <ThemeProvider />
          
          <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Sidebar - fixed on desktop, slide-over on mobile */}
            <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
            
            {/* Mobile overlay when sidebar is open */}
            {isMobileMenuOpen && (
              <div 
                className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" 
                onClick={() => setIsMobileMenuOpen(false)}
              ></div>
            )}
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen overflow-hidden">
              {/* Header fixed at top */}
              <Header />
              
              {/* Main scrollable content */}
              <main className="flex-1 overflow-y-auto pt-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                {children}
              </main>
            </div>
          </div>
          <LowStockAlert />
        </Provider>
      </body>
    </html>
  );
}

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
import { AuthProvider } from '../hooks/useAuth';
import { usePathname } from 'next/navigation';
import AuthGuard from './components/AuthGuard';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isLoginPage = pathname === '/login';

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
          <AuthProvider>
            <ThemeProvider />
            
            <AuthGuard>
              {isLoginPage ? (
                <div className="h-screen w-full">{children}</div>
              ) : (
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                  <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                  
                  {isMobileMenuOpen && (
                    <div 
                      className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    ></div>
                  )}
                  
                  <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
                    
                    <main className="flex-1 overflow-y-auto pt-20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
                      {children}
                    </main>
                  </div>
                  
                  <LowStockAlert />
                </div>
              )}
            </AuthGuard>
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}

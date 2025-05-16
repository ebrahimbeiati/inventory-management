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
import { usePathname } from 'next/navigation';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from '@/hooks/useAuth';
import Login from '@/app//login/page';
import { AuthProvider as OIDCProvider } from 'react-oidc-context';
import { config } from '@/config';

const cognitoConfig = {
  authority: `https://cognito-idp.${config.aws.region}.amazonaws.com/${config.aws.cognito.userPoolId}`,
  client_id: config.aws.cognito.userPoolClientId,
  redirect_uri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
  response_type: 'code',
  scope: 'email openid phone profile',
  loadUserInfo: true,
  onSigninCallback: () => {
    window.history.replaceState(
      {},
      document.title,
      window.location.pathname
    );
  },
  metadata: {
    authorization_endpoint: `https://${config.aws.cognito.userPoolId}.auth.${config.aws.region}.amazoncognito.com/oauth2/authorize`,
    token_endpoint: `https://${config.aws.cognito.userPoolId}.auth.${config.aws.region}.amazoncognito.com/oauth2/token`,
    userinfo_endpoint: `https://${config.aws.cognito.userPoolId}.auth.${config.aws.region}.amazoncognito.com/oauth2/userInfo`,
    end_session_endpoint: `https://${config.aws.cognito.userPoolId}.auth.${config.aws.region}.amazoncognito.com/logout`
  }
};

// Debug logging
console.log('Environment variables:', {
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID
});

console.log('OIDC Config:', {
  authority: cognitoConfig.authority,
  client_id: cognitoConfig.client_id,
  redirect_uri: cognitoConfig.redirect_uri,
  metadata: cognitoConfig.metadata
});

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
        <OIDCProvider {...cognitoConfig}>
          <Provider store={store}>
            <AuthProvider>
              <ThemeProvider />
  
              <AuthGuard>
                {isLoginPage ? (
                  <Login />
                ) : (
                  <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                    <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                    
                    {isMobileMenuOpen && (
                      <div 
                        className="md:hidden fixed inset-0 bg-opacity-50 z-20" 
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
        </OIDCProvider>
      </body>
    </html>
  );
}
"use client";

import './globals.css';
import { Inter } from 'next/font/google';
import { Provider } from 'react-redux';
import { store } from '@/state/store';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { useState, useEffect } from 'react';
import LowStockAlert from './components/LowStockAlert';
import { usePathname } from 'next/navigation';
import AuthGuard from './components/AuthGuard';
import { AuthProvider } from '@/hooks/useAuth';
import Login from '@/app//login/page';
import { AuthProvider as OIDCProvider } from 'react-oidc-context';
import { config } from '@/utils/config';

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
    <html lang="en">
      <body className={inter.className}>
      <OIDCProvider {...cognitoConfig}>
          <Provider store={store}>
            <AuthProvider>
              <AuthGuard>
                {isLoginPage ? (
                  <Login />
                ) : (
                  <div className="flex h-screen bg-gray-50">
                    <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                    
                    <div className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64">
                      <Header onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
                      
                      <main className="flex-1 overflow-y-auto pt-20 px-4 md:px-6 bg-gray-50 text-gray-900">
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
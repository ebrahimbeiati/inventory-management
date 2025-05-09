"use client"
import { useAppDispatch, useAppSelector } from '../../redux'
import { setIsSidebarCollapsed } from '../../../state';
import { Archive, ChevronLeft, CircleDollarSign, Clipboard, Layout, LucideIcon, SlidersHorizontal, User } from 'lucide-react'
import React, { useEffect, useState, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation';

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
  isActive: boolean;
  onClick: () => void;
}

const SidebarLink = React.memo(({
  href,
  icon: Icon,
  label,
  isCollapsed,
  isActive,
  onClick
}: SidebarLinkProps) => {
  return (
    <div className={`relative ${isCollapsed ? "py-4" : "px-8 py-4"}`}>
      <button
        onClick={onClick}
        className={`w-full flex items-center ${
          isCollapsed ? "justify-center" : "justify-start"
        } ${
          isActive 
            ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100" 
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        } transition-colors duration-200 rounded-lg`}
      >
        <div className="relative">
          <Icon className={`w-6 h-6 ${
            isActive 
              ? "text-blue-800 dark:text-blue-100" 
              : "text-gray-700 dark:text-gray-300"
          }`} />
          
          {isCollapsed && (
            <div className="absolute left-[calc(100%+10px)] top-0 bg-gray-800 dark:bg-gray-700 text-white px-3 py-1.5 rounded-md text-sm 
              opacity-0 invisible group-hover:opacity-100 group-hover:visible
              transition-all duration-200 whitespace-nowrap z-50 shadow-lg
              before:content-[''] before:absolute before:top-[50%] before:right-[100%] before:-translate-y-1/2
              before:border-8 before:border-transparent before:border-r-gray-800 dark:before:border-r-gray-700">
              {label}
            </div>
          )}
        </div>

        {!isCollapsed && (
          <span className={`ml-3 font-medium ${
            isActive 
              ? "text-blue-800 dark:text-blue-100" 
              : "text-gray-700 dark:text-gray-300"
          }`}>
            {label}
          </span>
        )}
      </button>
    </div>
  );
});

SidebarLink.displayName = 'SidebarLink';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleSidebar = useCallback(() => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  }, [dispatch, isSidebarCollapsed]);

  const handleNavigation = useCallback((href: string) => {
    router.push(href);
  }, [router]);

  const isActive = useCallback((href: string) => {
    return pathname === href || (pathname === '/' && href === '/dashboard');
  }, [pathname]);

  // Trigger animation periodically
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 2000);
    
    return () => clearInterval(animationInterval);
  }, []);
  
  const sidebarClassNames = `fixed left-0 top-0 flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-64 md:w-64"
  } bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden h-screen shadow-md z-30`;

  const navItems = [
    { href: "/dashboard", icon: Layout, label: "Dashboard" },
    { href: "/inventory", icon: Archive, label: "Inventory" },
    { href: "/products", icon: Clipboard, label: "Products" },
    { href: "/users", icon: User, label: "Users" },
    { href: "/settings", icon: SlidersHorizontal, label: "Settings" },
    { href: "/expenses", icon: CircleDollarSign, label: "Expenses" }
  ];

  return (
    <div className={sidebarClassNames}>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b dark:border-gray-700'>
        {!isSidebarCollapsed && (
          <>
            <div className='flex items-center gap-2'>
              <div 
                className={`w-8 h-8 bg-amber-200 dark:bg-amber-700 rounded-full flex items-center justify-center ${isSidebarCollapsed ? "px-5" : "px-8"}`}
                onClick={() => setIsAnimating(true)}
              >
                <span 
                  className={`font-bold ${isAnimating ? 'animate-pulse transition-all duration-300 text-blue-800 dark:text-blue-200 scale-150' : ''}`}
                  onAnimationEnd={() => setIsAnimating(false)}
                >
                  E
                </span>
              </div>
              <h1 className={`font-extrabold text-lg ${isSidebarCollapsed ? "hidden" : "block"} dark:text-white`}>EBISTOCK</h1>
            </div>
            <button 
              onClick={toggleSidebar}
              className='p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700'
            >
              <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
            </button>
          </>
        )}
        
        {isSidebarCollapsed && (
          <button 
            onClick={toggleSidebar}
            className='w-full flex justify-center p-1 hover:bg-gray-100 dark:hover:bg-gray-700'
          >
            <div 
              className={`w-8 h-8 bg-amber-200 dark:bg-amber-700 rounded-full flex items-center justify-center ${isSidebarCollapsed ? "px-5" : "px-8"}`}
              onClick={() => setIsAnimating(true)}
            >
              <span 
                className={`font-bold ${isAnimating ? 'animate-pulse transition-all duration-300 text-blue-800 dark:text-blue-200 scale-150' : ''}`}
                onAnimationEnd={() => setIsAnimating(false)}
              >
                E
              </span>
            </div>
          </button>
        )}
      </div>
      
      {/* Links Section */}
      <div className='flex-grow overflow-y-auto p-3'>
        {navItems.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isCollapsed={isSidebarCollapsed}
            isActive={isActive(item.href)}
            onClick={() => handleNavigation(item.href)}
          />
        ))}
      </div>
      
      {/* Footer */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} p-3 border-t dark:border-gray-700 text-center`}>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © {new Date().getFullYear()} Ebrahim
        </p>
      </div>
    </div>
  );
}
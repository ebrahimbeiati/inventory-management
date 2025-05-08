"use client"
import { useAppDispatch, useAppSelector } from '../../redux'
import { setIsSidebarCollapsed } from '../../../state';
import { Archive, ChevronLeft, CircleDollarSign, Clipboard, Layout, LucideIcon, SlidersHorizontal, User } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation';
import Link from 'next/link'

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed: boolean;
}

const SidebarLink = ({
  href,
  icon : Icon,
  label,
  isCollapsed
}: SidebarLinkProps) =>{
  const pathname = usePathname();
  const isActive = pathname === href || (pathname === '/' && href === '/dashboard');

  return (
    <Link href={href}>
    <div
      className={`cursor-pointer flex items-center relative ${
        isCollapsed ? "justify-center py-4" : "justify-start px-8 py-4"
      }
      hover:text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 gap-3 transition-colors ${
        isActive ? "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-100" : ""
      }
      group
    }`}
      title={isCollapsed ? label : ""}
    >
      <div className="relative">
        <Icon className="w-6 h-6 !text-gray-700 dark:!text-gray-300" />
        
        {/* Enhanced tooltip for collapsed mode */}
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

      <span
        className={`${
          isCollapsed ? "hidden" : "block"
        } font-medium text-gray-700 dark:text-gray-300`}
      >
        {label}
      </span>
    </div>
  </Link>
  )
};



export default function Sidebar() {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed
  );
  const [isAnimating, setIsAnimating] = useState(false);

  // Trigger animation periodically
  useEffect(() => {
    const animationInterval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 1000);
    }, 2000);
    
    return () => clearInterval(animationInterval);
  }, []);

  const toggleSidebar = () => {
    dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
  };
  
  const sidebarClassNames = `fixed left-0 top-0 flex flex-col ${
    isSidebarCollapsed ? "w-0 md:w-16" : "w-64 md:w-64"
  } bg-white dark:bg-gray-800 transition-all duration-300 overflow-hidden h-screen shadow-md z-30`;

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
      <SidebarLink
          href="/dashboard"
          icon={Layout}
          label="Dashboard"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/inventory"
          icon={Archive}
          label="Inventory"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/products"
          icon={Clipboard}
          label="Products"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/users"
          icon={User}
          label="Users"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/settings"
          icon={SlidersHorizontal}
          label="Settings"
          isCollapsed={isSidebarCollapsed}
        />
        <SidebarLink
          href="/expenses"
          icon={CircleDollarSign}
          label="Expenses"
          isCollapsed={isSidebarCollapsed}
        />

        {/* Navigation links would go here */}
      </div>
      
      {/* Footer */}
      <div className={`${isSidebarCollapsed ? "hidden" : "block"} p-3 border-t dark:border-gray-700 text-center`}>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © {new Date().getFullYear()} Ebrahim
        </p>
      </div>
    </div>
  )
}
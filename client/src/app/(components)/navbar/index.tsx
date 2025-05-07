"use client"
import { useAppSelector } from '@/app/redux';
import { useAppDispatch } from '@/app/redux';
import { setIsSidebarCollapsed, setIsDarkMode } from '@/state';
import { MenuSquare, Bell, Sun, Moon, Settings, } from 'lucide-react'
import Link from 'next/link';
import React from 'react'

export default function Navbar() {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
      );

      const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
      };
      const isDarkMode = useAppSelector(
        (state) => state.global.isDarkMode
      );
      const toggleDarkMode = () => {
        const newState = !isDarkMode;
        dispatch(setIsDarkMode(newState));
        
        // Apply the change immediately
        if (newState) {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
      };
      
      

  return (
    <div className={`flex items-center justify-between w-full mb-10`}> 
        <div className={`flex justify-between items-center gap-5`}>
            <button className={`flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200`} onClick={toggleSidebar}>
                <MenuSquare className={`w-5 h-5`} />
            </button>

        </div>
        <div className="relative">
            <input type="search" placeholder='Search...' className={`pl-10 pr-4 py-2 w-50 md:w-60 rounded-md border border-gray-300 dark:border-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200`} />
            <div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3'>
                <Bell className="w-5 h-5 text-gray-500" />
            </div>
        </div>
        {/* rightside */}
        <div className={`flex justify-between items-center gap-2`}>
            <div className='hidden md:flex items-center gap-2 justify-between'>
                <div>
                    <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        {isDarkMode ? (
                            <Sun className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-500" />
                        )}
                    </button>
                </div>
                <div className='relative'>
                    <Bell className="w-5 h-5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" />
                    <span className='absolute -top-3 -right-2 bg-red-500 text-white inline-flex items-center justify-center rounded-full text-xs px-[0.4rem] '>
                        1
                    </span>
                    
                </div>
                <hr className='w-0 md:w-px h-5 bg-gray-200 dark:bg-gray-700 border-solid border-l border-gray-400 dark:border-gray-600' />
                <div className="flex items-center gap-2 cursor-pointer">image</div>
                <span className='font-semibold text-gray-500 dark:text-gray-300'>Ebrahim</span>
            </div>
            <Link href="/settings">
            <Settings className="w-5 h-5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" />
        </Link>

        </div>
        
    </div>
  );
}
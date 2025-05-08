"use client"
import { useAppSelector } from '../../redux';
import { useAppDispatch } from '../../redux';
import { setIsSidebarCollapsed, setIsDarkMode } from '../../../state';
import { MenuSquare, Bell, Sun, Moon, Settings, Globe } from 'lucide-react'
import Link from 'next/link';
import React, { useState } from 'react'

export default function Navbar() {
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const [showLanguageNote, setShowLanguageNote] = useState(false);

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

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== 'en') {
            setShowLanguageNote(true);
            setTimeout(() => {
                setShowLanguageNote(false);
                e.target.value = 'en';
            }, 3000);
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
                <div className='flex items-center gap-2 justify-between'>
                    <div>
                        <button onClick={toggleDarkMode} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                            ) : (
                                <Moon className="w-5 h-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    {/* Language Selector */}
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-md border border-gray-200 dark:border-gray-700">
                        <Globe className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        <select 
                            className="bg-transparent text-sm text-gray-700 dark:text-gray-300 focus:outline-none cursor-pointer"
                            defaultValue="en"
                            onChange={handleLanguageChange}
                        >
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                            <option value="de">Deutsch</option>
                        </select>
                    </div>
                    {showLanguageNote && (
                        <div className="fixed top-4 right-4 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-sm text-blue-600 dark:text-blue-300 shadow-lg z-50">
                            Language support coming soon
                        </div>
                    )}
                    <div className='relative hidden md:block'>
                        <Bell className="w-5 h-5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" />
                        <span className='absolute -top-3 -right-2 bg-red-500 text-white inline-flex items-center justify-center rounded-full text-xs px-[0.4rem] '>
                            1
                        </span>
                    </div>
                    <hr className='w-0 md:w-px h-5 bg-gray-200 dark:bg-gray-700 border-solid border-l border-gray-400 dark:border-gray-600 hidden md:block' />
                    <div className="flex items-center gap-2 cursor-pointer hidden md:flex">image</div>
                    <span className='font-semibold text-gray-500 dark:text-gray-300 hidden md:inline'>Ebrahim</span>
                </div>
                <Link href="/settings">
                    <Settings className="w-5 h-5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200" />
                </Link>
            </div>
        </div>
    );
}
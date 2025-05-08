"use client"
import React, { useState } from 'react';
import { Globe, Info } from 'lucide-react';

const LanguageSelector = () => {
    const [showLanguageTooltip, setShowLanguageTooltip] = useState(false);
    const [showLanguageNote, setShowLanguageNote] = useState(false);

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value !== 'en') {
            setShowLanguageNote(true);
            // Reset back to English after 3 seconds
            setTimeout(() => {
                setShowLanguageNote(false);
                e.target.value = 'en';
            }, 3000);
        }
    };

    return (
        <div className="relative">
            <button 
                className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                onMouseEnter={() => setShowLanguageTooltip(true)}
                onMouseLeave={() => setShowLanguageTooltip(false)}
            >
                <Globe className="w-5 h-5 text-gray-500 dark:text-gray-300" />
            </button>
            {showLanguageTooltip && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 z-50">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-5 h-5 text-blue-500" />
                        <h3 className="font-medium text-gray-900 dark:text-white">Language</h3>
                    </div>
                    <select 
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        defaultValue="en"
                        onChange={handleLanguageChange}
                    >
                        <option value="en">English</option>
                        <option value="es">Español</option>
                        <option value="fr">Français</option>
                        <option value="de">Deutsch</option>
                        <option value="ar">العربية</option>
                        <option value="zh">中文</option>
                    </select>
                    {showLanguageNote && (
                        <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md flex items-start gap-2">
                            <Info className="w-4 h-4 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-blue-600 dark:text-blue-300">
                                We're working on adding support for this language. English will be used for now.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector; 
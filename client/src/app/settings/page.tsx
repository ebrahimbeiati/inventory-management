"use client";

import React, { useState } from "react";
import Header from "@/app/(components)/Header";
import { Bell, Eye, Info } from "lucide-react";

type Setting = {
  id: string;
  label: string;
  description: string;
  value: string | boolean;
  type: "toggle" | "select";
  icon: JSX.Element;
  options?: string[];
};

const Settings = () => {
  const initialSettings: Setting[] = [
    {
      id: "notifications",
      label: "Notifications",
      description: "Enable or disable system notifications",
      value: true,
      type: "toggle",
      icon: <Bell className="w-5 h-5" />
    },
    {
      id: "accessibility",
      label: "Accessibility",
      description: "Enable high contrast mode for better visibility",
      value: false,
      type: "toggle",
      icon: <Eye className="w-5 h-5" />
    }
  ];

  const [settings, setSettings] = useState<Setting[]>(initialSettings);

  const handleSettingChange = (id: string, newValue: string | boolean) => {
    setSettings(prev => {
      const updated = [...prev];
      const settingIndex = updated.findIndex(setting => setting.id === id);
      if (settingIndex !== -1) {
        updated[settingIndex].value = newValue;
      }
      return updated;
    });
  };

  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <Header name="Settings" />
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {settings.map((setting) => (
          <div 
            key={setting.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  {setting.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {setting.label}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {setting.description}
                  </p>
                </div>
              </div>
              
              <div className="ml-4">
                {setting.type === "toggle" ? (
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={setting.value as boolean}
                      onChange={() => handleSettingChange(setting.id, !setting.value)}
                    />
                    <div className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                      transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                      after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                      after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                      peer-checked:bg-blue-600">
                    </div>
                  </label>
                ) : (
                  <select
                    value={setting.value as string}
                    onChange={(e) => handleSettingChange(setting.id, e.target.value)}
                    className="px-3 py-2 border rounded-lg text-gray-700 dark:text-gray-300 
                             dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 
                             focus:ring-blue-500 focus:border-transparent"
                  >
                    {setting.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 flex items-start space-x-3">
        <Info className="w-5 h-5 text-blue-500 dark:text-blue-400 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
            Language Support Coming Soon
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
            We're working on adding support for multiple languages. Stay tuned for updates!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
"use client";

import React, { useState, useEffect } from "react";
import Header from "@/app/(components)/Header";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsDarkMode } from "@/state";

type UserSetting = {
  label: string;
  value: string | boolean;
  type: "text" | "toggle";
};

const Settings = () => {
  // Get the dark mode state from Redux
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();

  // Initial settings with mock data
  const initialSettings: UserSetting[] = [
    { label: "Username", value: "john doe", type: "text" },
    { label: "Email", value: "john.doe@example.com", type: "text" },
    { label: "Notification", value: true, type: "toggle" },
    { label: "Dark Mode", value: isDarkMode, type: "toggle" }, // Connect to Redux state
    { label: "Language", value: "English", type: "text" },
  ];

  const [userSettings, setUserSettings] = useState<UserSetting[]>(initialSettings);

  // Update local state when Redux state changes
  useEffect(() => {
    setUserSettings(prev => {
      const updated = [...prev];
      const darkModeIndex = updated.findIndex(setting => setting.label === "Dark Mode");
      if (darkModeIndex !== -1) {
        updated[darkModeIndex].value = isDarkMode;
      }
      return updated;
    });
  }, [isDarkMode]);

  const handleToggleChange = (index: number) => {
    const settingsCopy = [...userSettings];
    const newValue = !settingsCopy[index].value as boolean;
    settingsCopy[index].value = newValue;
    setUserSettings(settingsCopy);

    // If it's the Dark Mode toggle, update Redux state
    if (settingsCopy[index].label === "Dark Mode") {
      dispatch(setIsDarkMode(newValue));
    }
  };

  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <Header name="User Settings" />
      <div className="overflow-x-auto mt-5 shadow-md">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg">
          <thead className="bg-gray-800 dark:bg-gray-700 text-white">
            <tr>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Setting
              </th>
              <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                Value
              </th>
            </tr>
          </thead>
          <tbody>
            {userSettings.map((setting, index) => (
              <tr className="hover:bg-blue-50 dark:hover:bg-gray-700" key={setting.label}>
                <td className="py-2 px-4">{setting.label}</td>
                <td className="py-2 px-4">
                  {setting.type === "toggle" ? (
                    <label className="inline-flex relative items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={setting.value as boolean}
                        onChange={() => handleToggleChange(index)}
                      />
                      <div
                        className="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full peer peer-focus:ring-blue-400 peer-focus:ring-4 
                        transition peer-checked:after:translate-x-full peer-checked:after:border-white 
                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white 
                        after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all
                        peer-checked:bg-blue-600"
                      ></div>
                    </label>
                  ) : (
                    <input
                      type="text"
                      className="px-4 py-2 border rounded-lg text-gray-500 dark:text-gray-300 
                                dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:border-blue-500"
                      value={setting.value as string}
                      onChange={(e) => {
                        const settingsCopy = [...userSettings];
                        settingsCopy[index].value = e.target.value;
                        setUserSettings(settingsCopy);
                      }}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Settings;
"use client";

import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux";
import { setIsDarkMode } from "@/state";

const ThemeProvider = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const dispatch = useAppDispatch();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    
    if (storedTheme === "dark") {
      dispatch(setIsDarkMode(true));
    } else if (storedTheme === "light") {
      dispatch(setIsDarkMode(false));
    } else {
      // Check system preference if no stored theme
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      dispatch(setIsDarkMode(prefersDark));
      
      // Listen for system preference changes
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        // Only update if user hasn't manually set theme
        if (!localStorage.getItem("theme")) {
          dispatch(setIsDarkMode(e.matches));
        }
      };
      
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [dispatch]);

  // Apply theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  return null; // This component doesn't render anything
};

export default ThemeProvider; 
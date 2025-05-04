import type { Config } from "tailwindcss";
import { createThemes } from "tw-colors";
import colors from "tailwindcss/colors";

const baseColors = [
  "gray",
  "red",
  "yellow",
  "green",
  "blue",
  "indigo",
  "purple",
  "pink",
];

const shadeMapping = {
  "50": "900",
  "100": "800",
  "200": "700",
  "300": "600",
  "400": "500",
  "500": "400",
  "600": "300",
  "700": "200",
  "800": "100",
  "900": "50",
};

const generateThemeObject = (colors: any, mapping: any, invert = false) => {
  const theme: any = {};
  baseColors.forEach((color) => {
    theme[color] = {};
    Object.entries(mapping).forEach(([key, value]: any) => {
      const shadeKey = invert ? value : key;
      theme[color][key] = colors[color][shadeKey];
    });
  });
  return theme;
};

const lightTheme = generateThemeObject(colors, shadeMapping);
const darkTheme = generateThemeObject(colors, shadeMapping, true);

// Add custom application-specific colors
const customColors = {
  light: {
    // Inventory specific colors
    'low-stock': '#FFC107',        // Warning yellow for low stock
    'out-of-stock': '#F44336',     // Error red for out of stock
    'in-stock': '#4CAF50',         // Success green for in stock
    
    // UI colors
    'card-bg': '#FFFFFF',
    'card-border': '#E0E0E0',
    'table-header': '#F5F5F5',
    'table-row-alt': '#FAFAFA',
    'hover': '#F5F9FF',
    
    // Status colors
    'status-pending': '#FFB74D',   // Orange for pending status
    'status-completed': '#66BB6A', // Green for completed status
    'status-cancelled': '#EF5350', // Red for cancelled status
  },
  dark: {
    // Inventory specific colors
    'low-stock': '#FFD54F',        // Brighter yellow for dark mode
    'out-of-stock': '#EF5350',     // Lighter red for dark mode
    'in-stock': '#66BB6A',         // Lighter green for dark mode
    
    // UI colors
    'card-bg': '#1E1E1E',
    'card-border': '#333333',
    'table-header': '#252525',
    'table-row-alt': '#1A1A1A',
    'hover': '#2D3748',
    
    // Status colors
    'status-pending': '#FFA726',   // Brighter orange for dark mode
    'status-completed': '#81C784', // Lighter green for dark mode
    'status-cancelled': '#E57373', // Lighter red for dark mode
  }
};

const themes = {
  light: {
    ...lightTheme,
    white: "#ffffff",
    ...customColors.light,
  },
  dark: {
    ...darkTheme,
    white: colors.gray["950"],
    black: colors.gray["50"],
    ...customColors.dark,
  },
};

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)"],
        mono: ["var(--font-geist-mono)"],
      },
      // Custom box shadows for cards and elevated elements
      boxShadow: {
        'card': '0 2px 5px 0 rgba(0,0,0,0.05)',
        'card-hover': '0 5px 15px 0 rgba(0,0,0,0.1)',
        'card-dark': '0 2px 5px 0 rgba(0,0,0,0.3)',
        'card-hover-dark': '0 5px 15px 0 rgba(0,0,0,0.4)',
      },
      // Custom animation for skeleton loading
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      // Custom spacing for inventory-specific needs
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
    },
  },
  plugins: [createThemes(themes)],
};

export default config; 
import type { Config } from "tailwindcss";

// Add custom application-specific colors
const customColors = {
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
};

const config: Config = {
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
      colors: customColors,
    },
  },
  plugins: [],
};

export default config; 
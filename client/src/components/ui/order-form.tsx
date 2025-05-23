"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface OrderFormProps {
  symbol: string;
  price: string;
  onClose: () => void;
}

export function OrderForm({ symbol, price, onClose }: OrderFormProps) {
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle order submission
    console.log({
      symbol,
      price,
      orderType,
      amount,
      leverage,
    });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-xl"
    >
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Place Order</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </motion.button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-gray-700/50 p-4">
            <div>
              <p className="text-sm text-gray-400">Symbol</p>
              <p className="text-lg font-medium text-white">{symbol}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Price</p>
              <p className="text-lg font-medium text-white">{price}</p>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setOrderType("buy")}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
                orderType === "buy"
                  ? "bg-green-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setOrderType("sell")}
              className={`flex-1 rounded-lg py-2 px-4 text-sm font-medium transition-colors ${
                orderType === "sell"
                  ? "bg-red-500 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sell
            </button>
          </div>

          <div className="space-y-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-400">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter amount"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="leverage" className="block text-sm font-medium text-gray-400">
              Leverage
            </label>
            <input
              type="number"
              id="leverage"
              value={leverage}
              onChange={(e) => setLeverage(e.target.value)}
              className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter leverage"
              min="1"
              max="100"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className={`w-full rounded-lg py-2 px-4 text-sm font-medium text-white transition-colors ${
            orderType === "buy" ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {orderType === "buy" ? "Buy" : "Sell"} {symbol}
        </button>
      </form>
    </motion.div>
  );
} 
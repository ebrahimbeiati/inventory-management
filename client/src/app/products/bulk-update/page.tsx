"use client";

import { useState } from "react";
import { useGetProductsQuery, useUpdateProductMutation } from "@/state/api";
import Header from "@/app/(components)/Header";
import { ArrowLeft, Check, Save, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BulkUpdatePage() {
  const router = useRouter();
  const { data: products, isLoading } = useGetProductsQuery();
  const [updateProduct] = useUpdateProductMutation();
  
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [bulkValue, setBulkValue] = useState<number | string>("");
  
  const handleSelectAll = () => {
    if (!products) return;
    
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(p => p.productId));
    }
  };
  
  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };
  
  const handleBulkUpdate = async () => {
    if (!products || !bulkAction || selectedProducts.length === 0) return;
    
    try {
      const selectedProductsData = products.filter(p => 
        selectedProducts.includes(p.productId)
      );
      
      // Apply updates to each selected product
      const updatePromises = selectedProductsData.map(product => {
        const updateData = { ...product };
        
        if (bulkAction === "price") {
          updateData.price = Number(bulkValue);
        } else if (bulkAction === "stock") {
          updateData.stockQuantity = Number(bulkValue);
        } else if (bulkAction === "adjust_stock") {
          updateData.stockQuantity = Math.max(0, product.stockQuantity + Number(bulkValue));
        }
        
        return updateProduct(updateData).unwrap();
      });
      
      await Promise.all(updatePromises);
      
      alert(`Successfully updated ${selectedProducts.length} products!`);
      setSelectedProducts([]);
      setBulkAction("");
      setBulkValue("");
    } catch (error) {
      console.error("Error in bulk update:", error);
      alert("Failed to update products. Please try again.");
    }
  };
  
  if (isLoading) {
    return <div className="py-8 text-center">Loading products...</div>;
  }
  
  return (
    <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => router.push("/products")}
          className="mr-4 flex items-center text-blue-500 hover:text-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Products
        </button>
        <Header name="Bulk Product Update" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="mb-4 flex flex-col md:flex-row md:items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Action
            </label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Select an action...</option>
              <option value="price">Update Price (set to value)</option>
              <option value="stock">Update Stock (set to value)</option>
              <option value="adjust_stock">Adjust Stock (add/subtract)</option>
            </select>
          </div>
          
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {bulkAction === "price" ? "New Price ($)" : 
               bulkAction === "stock" ? "New Stock Quantity" :
               bulkAction === "adjust_stock" ? "Adjust Stock By (use negative to decrease)" :
               "Value"}
            </label>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={bulkValue}
              onChange={(e) => setBulkValue(e.target.value)}
              placeholder={
                bulkAction === "price" ? "Enter new price" : 
                bulkAction === "stock" ? "Enter new stock quantity" :
                bulkAction === "adjust_stock" ? "Enter adjustment amount" :
                "Select an action first"
              }
              disabled={!bulkAction}
            />
          </div>
          
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center"
            onClick={handleBulkUpdate}
            disabled={!bulkAction || selectedProducts.length === 0 || bulkValue === ""}
          >
            <Save className="w-4 h-4 mr-2" />
            Update {selectedProducts.length} Products
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={products && selectedProducts.length === products.length}
                      onChange={handleSelectAll}
                      className="mr-2 rounded"
                    />
                    Select All
                  </div>
                </th>
                <th className="py-2 px-4 border-b text-left">Product Name</th>
                <th className="py-2 px-4 border-b text-right">Current Price</th>
                <th className="py-2 px-4 border-b text-right">Current Stock</th>
              </tr>
            </thead>
            <tbody>
              {products && products.map((product) => (
                <tr 
                  key={product.productId}
                  className={`hover:bg-gray-50 ${selectedProducts.includes(product.productId) ? 'bg-blue-50' : ''}`}
                >
                  <td className="py-2 px-4 border-b">
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.productId)}
                      onChange={() => toggleProductSelection(product.productId)}
                      className="rounded"
                    />
                  </td>
                  <td className="py-2 px-4 border-b font-medium">{product.name}</td>
                  <td className="py-2 px-4 border-b text-right">${product.price.toFixed(2)}</td>
                  <td className="py-2 px-4 border-b text-right">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      product.stockQuantity > 10 
                        ? 'bg-green-100 text-green-800'
                        : product.stockQuantity > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stockQuantity}
                    </span>
                  </td>
                </tr>
              ))}
              
              {products && products.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    No products found. Add some products first!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useGetProductsQuery, useCreateProductMutation, useGetCategoriesQuery, useGetTagsQuery, useDeleteProductMutation, Product } from "@/state/api";
import { PlusCircle, SearchIcon, ImageIcon, Download, Filter, ListChecks, Trash2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import CreateProductModal from "./CreateProductModal";
import { useRouter, useSearchParams } from "next/navigation";
import InventoryStats from "./InventoryStats";
import ProductTable from "./ProductTable";

type ProductFormData = {
    name: string;
    price: number;
    stockQuantity: number;
    rating?: number;
    imageUrl?: string;
    description?: string;
    category?: string;
    tags?: string;
}

export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [sortBy, setSortBy] = useState<string>("name");
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [selectedTag, setSelectedTag] = useState<string>("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Get search parameters from URL when component loads
    useEffect(() => {
        const urlSearchTerm = searchParams.get('search');
        const urlCategory = searchParams.get('category');
        const urlTag = searchParams.get('tag');
        
        if (urlSearchTerm) setSearchTerm(urlSearchTerm);
        if (urlCategory) setSelectedCategory(urlCategory);
        if (urlTag) setSelectedTag(urlTag);
    }, [searchParams]);
    
    const apiSearchParams = { 
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
        tag: selectedTag || undefined
    };
    
    const { data: products, isLoading, isError } = useGetProductsQuery(apiSearchParams);
    const { data: categories } = useGetCategoriesQuery();
    const { data: tags } = useGetTagsQuery();

    const [createProduct] = useCreateProductMutation();
    const [deleteProduct] = useDeleteProductMutation();

    const handleCreateModal = async (productData: ProductFormData) => {
        try {
            // Validate product data before sending to API
            if (!productData.name?.trim()) {
                alert("Product name is required");
                return;
            }
            
            // Make sure numeric fields are valid
            const validatedData = {
                ...productData,
                price: typeof productData.price === 'number' && !isNaN(productData.price) 
                    ? productData.price 
                    : 0,
                stockQuantity: typeof productData.stockQuantity === 'number' && !isNaN(productData.stockQuantity) 
                    ? productData.stockQuantity 
                    : 0,
                rating: productData.rating !== undefined && typeof productData.rating === 'number' && !isNaN(productData.rating) 
                    ? productData.rating 
                    : undefined
            };
            
            console.log("Sending product data:", validatedData);
            const result = await createProduct(validatedData).unwrap();
            console.log("Product created:", result);
            setIsModalOpen(false);
            
            // After successful creation, restore the current search if any
            if (searchTerm || selectedCategory || selectedTag) {
                updateURLWithSearchParams({
                    search: searchTerm,
                    category: selectedCategory,
                    tag: selectedTag
                });
            }
        } catch (error: unknown) {
            console.error("Error creating product:", error);
            
            // Display a user-friendly error message
            const errorMessage = error && typeof error === 'object' && 'data' in error && 
                error.data && typeof error.data === 'object' && 'message' in error.data
                ? error.data.message 
                : "Failed to create product. Please try again.";
            alert(errorMessage);
        }
    };

    const handleEditProduct = (product: Product) => {
        // Navigate directly to edit mode by adding edit=true parameter
        router.push(`/products/${product.productId}?edit=true`);
    };

    const handleDeleteProduct = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await deleteProduct(productId).unwrap();
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    const toggleProductSelection = (productId: string) => {
        if (selectedProducts.includes(productId)) {
            setSelectedProducts(selectedProducts.filter(id => id !== productId));
        } else {
            setSelectedProducts([...selectedProducts, productId]);
        }
    };

    const handleDeleteSelected = async () => {
        try {
            // Delete each selected product one by one
            const deletePromises = selectedProducts.map(productId => 
                deleteProduct(productId).unwrap()
            );
            
            await Promise.all(deletePromises);
            setSelectedProducts([]);
            setIsConfirmDeleteOpen(false);
        } catch (error) {
            console.error("Error deleting products:", error);
            alert("Failed to delete some products. Please try again.");
        }
    };

    const exportToCSV = () => {
        if (!products) return;
        
        // Create CSV content
        const headers = ["Name", "Price", "Stock", "Rating", "Category", "Tags"];
        const csvContent = [
            headers.join(","),
            ...products.map(product => 
                [
                    `"${product.name}"`, 
                    product.price, 
                    product.stockQuantity,
                    product.rating || 0,
                    `"${product.category || ''}"`,
                    `"${product.tags || ''}"`
                ].join(",")
            )
        ].join("\n");
        
        // Create download link
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "products.csv");
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const sortedProducts = products ? [...products].sort((a, b) => {
        switch(sortBy) {
            case "price":
                return a.price - b.price;
            case "stock":
                return a.stockQuantity - b.stockQuantity;
            case "rating":
                return (a.rating || 0) - (b.rating || 0);
            default:
                return a.name.localeCompare(b.name);
        }
    }) : [];

    // Helper function to update URL with search parameters
    const updateURLWithSearchParams = (params: { search?: string, category?: string, tag?: string }) => {
        const urlParams = new URLSearchParams();
        if (params.search) urlParams.set('search', params.search);
        if (params.category) urlParams.set('category', params.category);
        if (params.tag) urlParams.set('tag', params.tag);
        
        const url = `/products${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
        router.push(url, { scroll: false });
    };

    // New function to clear URL parameters without affecting state
    const clearURLParams = () => {
        router.push('/products', { scroll: false });
    };

    // Modified function to open modal and clear URL params
    const openCreateModal = () => {
        clearURLParams();
        setIsModalOpen(true);
    };

    if(isLoading) return (
        <div className="py-4 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ml-0 sm:ml-64">
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </div>
    );
    
    if(isError || !products) return (
        <div className="py-4 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md text-red-500 text-center ml-0 sm:ml-64">
            Error fetching products
        </div>
    );

    return (
        <div className="mx-auto pb-5 w-full px-4 sm:px-6 lg:px-8 ml-0 sm:ml-64">
            <div className="py-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Products Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your inventory products</p>
            </div>
            
            <InventoryStats />
            
            <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-6">
                {/* Search Form - Full Width on Mobile */}
                <div className="mb-4">
                    <form onSubmit={(e) => e.preventDefault()} className="flex items-center border-2 border-gray-300 dark:border-gray-600 rounded">
                        <SearchIcon className="w-4 h-4 text-gray-500 dark:text-gray-400 m-2" />
                        <input 
                            type="text" 
                            placeholder="Search products" 
                            className="w-full py-2 px-4 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none" 
                            value={searchTerm} 
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                updateURLWithSearchParams({
                                    search: e.target.value,
                                    category: selectedCategory,
                                    tag: selectedTag
                                });
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    updateURLWithSearchParams({
                                        search: searchTerm,
                                        category: selectedCategory,
                                        tag: selectedTag
                                    });
                                }
                            }}
                        />
                    </form>
                </div>
                
                {/* Filters Section - Horizontal Scrolling on Mobile */}
                <div className="mb-6 overflow-x-auto pb-2">
                    <div className="flex items-center space-x-3 min-w-max">
                        <div className="flex items-center">
                            <Filter className="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1" />
                            <select 
                                className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="price">Sort by Price</option>
                                <option value="stock">Sort by Stock</option>
                                <option value="rating">Sort by Rating</option>
                            </select>
                        </div>
                        
                        <div className="flex items-center">
                            <select 
                                className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                value={selectedCategory}
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                    updateURLWithSearchParams({
                                        search: searchTerm,
                                        category: e.target.value,
                                        tag: selectedTag
                                    });
                                }}
                            >
                                <option value="">All Categories</option>
                                {categories?.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {tags && tags.length > 0 && (
                            <div className="flex items-center">
                                <select 
                                    className="py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                                    value={selectedTag}
                                    onChange={(e) => {
                                        setSelectedTag(e.target.value);
                                        updateURLWithSearchParams({
                                            search: searchTerm,
                                            category: selectedCategory,
                                            tag: e.target.value
                                        });
                                    }}
                                >
                                    <option value="">All Tags</option>
                                    {tags.map(tag => (
                                        <option key={tag} value={tag}>
                                            {tag}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Selection and Action Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            className="mr-2 rounded"
                            checked={products.length > 0 && selectedProducts.length === products.length}
                            onChange={() => {
                                if (selectedProducts.length === products.length) {
                                    setSelectedProducts([]);
                                } else {
                                    setSelectedProducts(products.map(p => p.productId));
                                }
                            }}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {selectedProducts.length === 0 
                                ? "Select All" 
                                : `${selectedProducts.length} product${selectedProducts.length === 1 ? "" : "s"} selected`}
                        </span>
                    </div>
                    
                    {/* Action Buttons - Stacked on Mobile, Row on Desktop */}
                    <div className="grid grid-cols-2 sm:flex sm:space-x-2 gap-2">
                        {selectedProducts.length > 0 && (
                            <button
                                className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                                onClick={() => setIsConfirmDeleteOpen(true)}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                <span className="whitespace-nowrap">Delete Selected</span>
                            </button>
                        )}
                        
                        <button
                            className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                            onClick={exportToCSV}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            <span>Export</span>
                        </button>
                        
                        <button
                            className="flex items-center justify-center bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => router.push('/products/bulk-update')}
                        >
                            <ListChecks className="w-4 h-4 mr-2" />
                            <span className="whitespace-nowrap">Bulk Update</span>
                        </button>
                        
                        <button
                            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            onClick={openCreateModal}
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            <span>Add Product</span>
                        </button>
                    </div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 dark:bg-gray-700 rounded-lg flex flex-col items-center">
                        <ImageIcon className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No products found</p>
                        <button
                            className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                            onClick={openCreateModal}
                        >
                            <PlusCircle className="w-4 h-4 mr-2" />
                            Add Your First Product
                        </button>
                    </div>
                ) : (
                    <ProductTable 
                        products={sortedProducts}
                        onEdit={handleEditProduct}
                        onDelete={handleDeleteProduct}
                        selectedProducts={selectedProducts}
                        toggleProductSelection={toggleProductSelection}
                    />
                )}
            </div>

            {/* Confirmation Modal for Bulk Delete */}
            {isConfirmDeleteOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <div className="flex items-center text-red-500 mb-4">
                            <AlertCircle className="w-6 h-6 mr-2 flex-shrink-0" />
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white">Confirm Deletion</h3>
                        </div>
                        <p className="mb-6 text-gray-600 dark:text-gray-300">
                            Are you sure you want to delete {selectedProducts.length} selected product{selectedProducts.length === 1 ? "" : "s"}? 
                            This action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                                onClick={() => setIsConfirmDeleteOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                onClick={handleDeleteSelected}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <CreateProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreate={handleCreateModal}
            />
        </div>
    );
}


"use client";

import { useGetProductsQuery, useCreateProductMutation } from "@/state/api";
import { PlusCircle, SearchIcon } from "lucide-react";
import { useState } from "react";
import Header from "../(components)/Header";
import Rating from "../(components)/Rating";
import CreateProductModal from "./CreateProductModal";

type ProductFormData = {
    name: string;
    price: number;
    stockQuantity: number;
    rating: number;
}
export default function Products() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: products, isLoading, isError } = useGetProductsQuery(searchTerm);

    const [createProduct] = useCreateProductMutation();

    const handleCreateModal = async (productData: ProductFormData) => {
        try {
            await createProduct(productData).unwrap();
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error creating product:", error);
        }
    };

    if(isLoading) return <div className="py-4">Loading...</div>;
    if(isError || !products) return <div className="py-4 text-red-500 text-center">Error fetching products</div>;

    return (
        <div className="mx-auto pb-5 w-full">
            <div className="mb-6" >
                <div className="flex  items-center border-2 border-gray-300 rounded">
                    <SearchIcon className="w-4 h-4 text-gray-500 m-2 " />
                    <input type="text" placeholder="Search products" className="w-full py-2 px-4 rounded bg-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <Header name="Products" />
                    <button
                        className="flex items-center bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded cursor-pointer"
                        onClick={() => setIsModalOpen(true)}
                    >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Product
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-between">
                    { isLoading ?( <div>Loading...</div> ) :(
                    products?.map((product) => (
                        <div key={product.productId} className="border border-gray-300 rounded-md p-4 shadow w-full mx-auto max-w-full">
                            <div className="flex flex-col items-center">
                                image
                                <h2 className="text-lg font-semibold">{product.name}</h2>
                                <p className="text-gray-500">${product.price.toFixed(2)}</p>
                                <div className="text-sm text-gray-500 mt-1">
                                    Stock: {product.stockQuantity}
                                </div>
                                {product.rating && (
                                    <div className="flex items-center text-gray-500 mt-2">
                                        <Rating rating={product.rating} />
                                    </div>
                                )}
                               
                            </div>
                            <CreateProductModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                onCreate={handleCreateModal}
                            />
                        </div>
                        ))
                    )}
                </div>

            
     
    </div>
    );
}

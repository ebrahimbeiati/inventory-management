import { useGetDashboardMetricsQuery } from "@/state/api";
import { ShoppingBag } from "lucide-react";
import Rating from "../(components)/Rating";
import React from "react";


const CardPopularProducts = () => {
  const { data: dashboardMetrics, isLoading } = useGetDashboardMetricsQuery();

  return (
    <div className="row-span-3 xl:row-span-6 bg-white shadow-md rounded-2xl pb-16">
      {isLoading ? (
        <div className="m-5">Loading...</div>
      ) : (
        <>
          <h3 className="text-lg font-semibold px-7 pt-5 pb-2">
            Popular Products
          </h3>
          <hr />
          <div className="overflow-auto h-full">
            {dashboardMetrics?.popularProducts.map((product)=>(
                    <div
                     key={product.productId}
                        className="flex items-center justify-between px-7 py-4 border-b border-gray-200">
                            <div className="flex items-center gap-2">
                        <div>imgbbbb</div>
                        
                            <div className="flex flex-col justify-between gap-1">
                            <div className="font-bold text-gray-700">{product.name}</div>
                            <div className="flex text-sm items-center">
                                <span className=" font-bold text-green-500">${product.price}</span>
                                <span className="text-gray-500">|</span>
                                <Rating rating={product.rating || 0} />
                            </div>
                           
                        </div> 
                        </div>
                        {/* rightside */}
                        <div className="text-sm flex items-center">
                            <button className="px-4 py-2 rounded-md bg-green-500 text-white">
                                <ShoppingBag className="w-4 h-4" />
                            </button>
                            {
                                Math.round(product.stockQuantity / 1000)}k Sold
                            
                        </div>
                        </div>
                ))
            }
          </div>
       
        </>
      )}
    </div>
  );
};

export default CardPopularProducts;
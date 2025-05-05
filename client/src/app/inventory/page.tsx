"use client"


import { useGetProductsQuery } from "@/state/api";
import Header from "../(components)/Header";
import { DataGrid, GridColDef } from "@mui/x-data-grid";




const columns: GridColDef[] = [
    { field: "productId", headerName: "ID", width: 90 },
    { field: "name", headerName: "Product Name", width: 200 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      type: "number",
      valueGetter: (value, row) => `$${row.price}`,
    },
    {
      field: "rating",
      headerName: "Rating",
      width: 110,
      type: "number",
      valueGetter: (value, row) => (row.rating ? row.rating : "N/A"),
    },
    {
      field: "stockQuantity",
      headerName: "Stock Quantity",
      width: 150,
      type: "number",
    },
  ];
export default function Inventory() {
    const { data: products,isError, isLoading } = useGetProductsQuery();

    if(isLoading) return <div>Loading...</div>;
    if(isError || !products) return <div>Error fetching products</div>;


    return (
        <div className="flex flex-col gap-4">
            <Header name="Inventory" />
            <DataGrid
                className="w-full bg-white rounded-md p-4 border border-gray-200 shadow-md mt-5 !text-gray-700"
                rows={products}
                columns={columns}
                getRowId={(row) => row.productId}
                checkboxSelection
            />
        </div>
    );
}
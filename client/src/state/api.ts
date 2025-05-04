import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Product {
    productId: string;
    name:string;
    price:number;
    stockQuantity:number;
}


export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL }),
    reducerPath: 'api',
    tagTypes: ['Product'],
    endpoints: (build) => ({}),
    });

    export const {  } = api;
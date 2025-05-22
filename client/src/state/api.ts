import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { config } from '@/utils/config';

export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  imageUrl?: string;
  category?: string;
  tags?: string;
  createdAt?: string;
}

export interface NewProduct {
  name: string;
  price: number;
  rating?: number;
  stockQuantity: number;
  imageUrl?: string;
  category?: string;
  tags?: string;
}

export interface SalesSummary {
  salesSummaryId: string;
  totalValue: number;
  changePercentage?: number;
  date: string;
}

export interface PurchaseSummary {
  purchaseSummaryId: string;
  totalPurchased: number;
  changePercentage?: number;
  date: string;
}

export interface ExpenseSummary {
  expenseSummarId: string;
  totalExpenses: number;
  date: string;
}

export interface ExpenseByCategorySummary {
  expenseByCategorySummaryId: string;
  category: string;
  amount: string;
  date: string;
}

export interface DashboardMetrics {
  popularProducts: Product[];
  salesSummary: SalesSummary[];
  purchaseSummary: PurchaseSummary[];
  expenseSummary: ExpenseSummary[];
  expenseByCategorySummary: ExpenseByCategorySummary[];
}

export interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt?: string;
  // lastLogin?: string;
}

export interface NewUser {
  name: string;
  email: string;
  role: string;
  status: string;
}

interface ApiError {
  status: number;
  data: {
    message: string;
  };
}

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: config.api.baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Get the ID token from localStorage
      const idToken = localStorage.getItem('idToken');
      console.log('API Request - Base URL:', config.api.baseUrl);
      console.log('API Request - ID Token present:', !!idToken);
      
      if (idToken) {
        // Ensure we're sending the token in the correct format
        headers.set('Authorization', `Bearer ${idToken}`);
        // Add content type header
        headers.set('Content-Type', 'application/json');
      }
      
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["DashboardMetrics", "Products", "Users", "Expenses", "Categories", "Tags"],
  endpoints: (build) => ({
    getDashboardMetrics: build.query<DashboardMetrics, void>({
      query: () => "/dashboard",
      providesTags: ["DashboardMetrics"],
    }),
    getProducts: build.query<Product[], { search?: string; category?: string; tag?: string } | void>({
      query: (params) => ({
        url: "/products",
        params: params || {},
      }),
      providesTags: ["Products"],
    }),
    getCategories: build.query<string[], void>({
      query: () => "/products/categories",
      providesTags: ["Categories"],
    }),
    getTags: build.query<string[], void>({
      query: () => "/products/tags",
      providesTags: ["Tags"],
    }),
    getProductById: build.query<Product, string>({
      query: (productId) => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<Product, NewProduct>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
      invalidatesTags: ["Products", "Categories", "Tags"],
    }),
    updateProduct: build.mutation<Product, Product>({
      query: (product) => ({
        url: `/products/${product.productId}`,
        method: "PUT",
        body: product,
      }),
      invalidatesTags: (result, error, product) => [
        { type: "Products", id: product.productId },
        "Products",
        "Categories",
        "Tags",
      ],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (productId) => ({
        url: `/products/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Categories", "Tags"],
    }),
    getUsers: build.query<User[], { search?: string } | void>({
      query: (params) => ({
        url: '/users',
        params: params && 'search' in params ? { search: params.search } : undefined,
      }),
      transformResponse: (response: User[]) => {
        console.log('Users API Response:', response);
        return response;
      },
      transformErrorResponse: (error: ApiError) => {
        console.error('Users API Error:', error);
        return error;
      },
      providesTags: ["Users"],
    }),
    getUserById: build.query<User, string>({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, id) => [{ type: "Users", id }],
    }),
    createUser: build.mutation<User, NewUser>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: build.mutation<User, User>({
      query: (user) => ({
        url: `/users/${user.userId}`,
        method: "PUT",
        body: user,
      }),
      invalidatesTags: (result, error, user) => [
        { type: "Users", id: user.userId },
        "Users",
      ],
    }),
    deleteUser: build.mutation<void, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
    getExpensesByCategory: build.query<ExpenseByCategorySummary[], void>({
      query: () => "/expenses",
      providesTags: ["Expenses"],
    }),
  }),
});

export const {
  useGetDashboardMetricsQuery,
  useGetProductsQuery,
  useGetCategoriesQuery,
  useGetTagsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetExpensesByCategoryQuery,
} = api;
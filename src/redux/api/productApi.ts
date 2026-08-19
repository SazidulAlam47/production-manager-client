/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TDailySummary, TProduct } from '../../types';
import { baseApi } from './baseApi';

const productApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllProducts: build.query<TProduct[], Record<string, any> | void>({
            query: (params) => ({
                url: '/products',
                method: 'GET',
                params,
            }),
            providesTags: ['product'],
        }),
        getDailySummary: build.query<TDailySummary, string | void>({
            query: (date) => ({
                url: date
                    ? `/products/daily-summary?date=${date}`
                    : '/products/daily-summary',
                method: 'GET',
            }),
            providesTags: ['product', 'barcode'],
        }),
        getProductById: build.query<TProduct, string>({
            query: (productId: string) => ({
                url: `/products/${productId}`,
                method: 'GET',
            }),
            providesTags: ['product'],
        }),
        createProduct: build.mutation<TProduct, Partial<TProduct>>({
            query: (data: Partial<TProduct>) => ({
                url: '/products',
                method: 'POST',
                data,
            }),
            invalidatesTags: ['product'],
        }),
        updateProduct: build.mutation<
            TProduct,
            { productId: string; data: Partial<TProduct> }
        >({
            query: (args: { productId: string; data: Partial<TProduct> }) => ({
                url: `/products/${args.productId}`,
                method: 'PATCH',
                data: args.data,
            }),
            invalidatesTags: ['product'],
        }),
        deleteProduct: build.mutation<TProduct, string>({
            query: (productId: string) => ({
                url: `/products/${productId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['product'],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useGetDailySummaryQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;

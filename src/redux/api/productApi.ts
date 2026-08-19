/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    TDailySummary,
    TPaginatedData,
    TProduct,
    TResponseSuccessType,
} from '../../types';
import { baseApi } from './baseApi';

const productApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllProducts: build.query<
            TPaginatedData<TProduct>,
            Record<string, any> | void
        >({
            query: (params) => ({
                url: '/products',
                method: 'GET',
                params,
            }),
            transformResponse: (
                response: TResponseSuccessType<TProduct[]>,
            ) => ({
                data: response.data,
                meta: response.meta,
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
            transformResponse: (
                response: TResponseSuccessType<TDailySummary>,
            ) => response.data,
            providesTags: ['product', 'barcode'],
        }),
        getProductById: build.query<TProduct, string>({
            query: (productId: string) => ({
                url: `/products/${productId}`,
                method: 'GET',
            }),
            transformResponse: (
                response: TResponseSuccessType<TProduct>,
            ) => response.data,
            providesTags: ['product'],
        }),
        createProduct: build.mutation<TProduct, Partial<TProduct>>({
            query: (data: Partial<TProduct>) => ({
                url: '/products',
                method: 'POST',
                data,
            }),
            transformResponse: (
                response: TResponseSuccessType<TProduct>,
            ) => response.data,
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
            transformResponse: (
                response: TResponseSuccessType<TProduct>,
            ) => response.data,
            invalidatesTags: ['product'],
        }),
        deleteProduct: build.mutation<TProduct, string>({
            query: (productId: string) => ({
                url: `/products/${productId}`,
                method: 'DELETE',
            }),
            transformResponse: (
                response: TResponseSuccessType<TProduct>,
            ) => response.data,
            invalidatesTags: ['product'],
        }),
    }),
});

export const {
    useGetAllProductsQuery,
    useLazyGetAllProductsQuery,
    useGetDailySummaryQuery,
    useGetProductByIdQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;

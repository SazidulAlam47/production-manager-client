/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
    TBarcode,
    TPaginatedData,
    TResponseSuccessType,
} from '../../types';
import { baseApi } from './baseApi';

const barcodeApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllBarcodesByProductId: build.query<
            TPaginatedData<TBarcode>,
            { productId: string; params?: Record<string, any> } | string
        >({
            query: (args) => {
                const productId =
                    typeof args === 'string' ? args : args.productId;
                const params =
                    typeof args === 'string' ? undefined : args.params;
                return {
                    url: `/barcode/product/${productId}`,
                    method: 'GET',
                    params,
                };
            },
            transformResponse: (
                response: TResponseSuccessType<TBarcode[]>,
            ) => ({
                data: response.data,
                meta: response.meta,
            }),
            providesTags: ['barcode'],
        }),
        createBarcode: build.mutation<
            TBarcode,
            { productId: string; barcode: string }
        >({
            query: (data: { productId: string; barcode: string }) => ({
                url: '/barcode',
                method: 'POST',
                data,
            }),
            transformResponse: (
                response: TResponseSuccessType<TBarcode>,
            ) => response.data,
            invalidatesTags: ['barcode', 'product'],
        }),
        deleteBarcode: build.mutation<TBarcode, string>({
            query: (barcodeId: string) => ({
                url: `/barcode/${barcodeId}`,
                method: 'DELETE',
            }),
            transformResponse: (
                response: TResponseSuccessType<TBarcode>,
            ) => response.data,
            invalidatesTags: ['barcode', 'product'],
        }),
    }),
});

export const {
    useGetAllBarcodesByProductIdQuery,
    useCreateBarcodeMutation,
    useDeleteBarcodeMutation,
} = barcodeApi;

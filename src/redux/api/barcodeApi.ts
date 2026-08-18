/* eslint-disable @typescript-eslint/no-explicit-any */
import type { TBarcode } from '../../types';
import { baseApi } from './baseApi';

const barcodeApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllBarcodesByProductId: build.query<TBarcode[], string>({
            query: (productId: string) => ({
                url: `/barcode/product/${productId}`,
                method: 'GET',
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
            invalidatesTags: ['barcode', 'product'],
        }),
        deleteBarcode: build.mutation<TBarcode, string>({
            query: (barcodeId: string) => ({
                url: `/barcode/${barcodeId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['barcode', 'product'],
        }),
    }),
});

export const {
    useGetAllBarcodesByProductIdQuery,
    useCreateBarcodeMutation,
    useDeleteBarcodeMutation,
} = barcodeApi;

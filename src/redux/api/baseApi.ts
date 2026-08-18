import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from '../../helpers/axios/axiosBaseQuery';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: axiosBaseQuery(),
    endpoints: () => ({}),
    tagTypes: ['product'],
});

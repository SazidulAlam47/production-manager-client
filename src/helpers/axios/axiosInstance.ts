import axios from 'axios';
import { getFromLocalStorage } from '../../utils/localStorage';
import type { TResponseErrorType, TResponseSuccessType } from '../../types';

export const authKey = 'accessToken';

const axiosInstance = axios.create();
axiosInstance.defaults.headers.post['Content-Type'] = 'application/json';
axiosInstance.defaults.headers['Accept'] = 'application/json';
axiosInstance.defaults.baseURL = import.meta.env.VITE_API_URL as string;

axiosInstance.interceptors.request.use(
    function (config) {
        const accessToken = getFromLocalStorage(authKey);
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

axiosInstance.interceptors.response.use(
    function (response) {
        const responseObject: TResponseSuccessType = {
            data: response?.data?.data,
        };
        return responseObject as any;
    },
    async function (error) {
        const responseObject: TResponseErrorType = {
            statusCode: error?.status || 500,
            message: error?.response?.data?.message || 'Something went wrong!',
        };
        return Promise.reject(responseObject);
    },
);

export default axiosInstance;

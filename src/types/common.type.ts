/* eslint-disable @typescript-eslint/no-explicit-any */
export type TMeta = {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
};

export type TResponseSuccessType<T> = {
    data: T;
    meta?: TMeta;
    success?: boolean;
    message?: string;
};

export type TPaginatedData<T> = {
    data: T[];
    meta?: TMeta;
};

export type TResponseErrorType = {
    statusCode: number;
    message: string;
};

export type TDecodedUser = {
    email?: string;
    role?: string;
    name?: string;
    [key: string]: any;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TResponseSuccessType = {
    data: any;
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

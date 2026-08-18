import { jwtDecode } from 'jwt-decode';
import type { TDecodedUser } from '../types';

export const decodeToken = (token: string | null) => {
    if (!token) {
        return null;
    }
    try {
        return jwtDecode(token) as TDecodedUser;
    } catch {
        return null;
    }
};

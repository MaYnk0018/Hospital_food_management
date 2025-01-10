import React from 'react';
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    contact?: string;
}
interface AuthContextType {
    user: User | null;
    login: (userData: User & {
        token: string;
    }) => void;
    logout: () => void;
    isLoading: boolean;
}
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};

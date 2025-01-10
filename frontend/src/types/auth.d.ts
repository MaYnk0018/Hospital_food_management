export interface User {
    id: string;
    email: string;
    name: string;
    role: 'manager' | 'pantry' | 'delivery';
}
export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

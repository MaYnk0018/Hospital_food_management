// src/types/auth.ts
export interface SignupRequest {
    email: string;
    password: string;
    name: string;
    role: 'manager' | 'pantry' | 'delivery';
    contact: string;
  }
  
  export interface LoginRequest {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message?: string;
    data?: {
      user: {
        id: string;
        name: string;
        email: string;
        role: string;
        contact: string;
      };
      token: string;
    };
    errors?: any[];
  }
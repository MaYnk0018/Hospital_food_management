export declare const api: import("axios").AxiosInstance;
export declare const apiService: {
    auth: {
        login: (email: string, password: string) => Promise<any>;
        getProfile: () => Promise<any>;
    };
    patients: {
        getAll: () => Promise<any>;
        getById: (id: string) => Promise<any>;
        create: (data: any) => Promise<any>;
        update: (id: string, data: any) => Promise<any>;
        delete: (id: string) => Promise<any>;
    };
};

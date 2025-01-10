export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'manager' | 'pantry' | 'delivery';
    contact: string;
    createdAt: string;
}
export interface UserState {
    currentUser: User | null;
    error: string | null;
    loading: boolean;
}
export declare const signInStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/signInStart">, signInSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<User, "user/signInSuccess">, signInFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "user/signInFailure">, updateStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/updateStart">, updateSuccess: import("@reduxjs/toolkit").ActionCreatorWithPayload<User, "user/updateSuccess">, updateFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "user/updateFailure">, deleteUserStart: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/deleteUserStart">, deleteUserSuccess: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/deleteUserSuccess">, deleteUserFailure: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "user/deleteUserFailure">, signoutSuccess: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/signoutSuccess">;
declare const _default: import("redux").Reducer<UserState>;
export default _default;

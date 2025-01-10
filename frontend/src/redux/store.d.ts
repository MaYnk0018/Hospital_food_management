export declare const store: import("@reduxjs/toolkit").EnhancedStore<{
    user: import("./user/userSlice").UserState;
    theme: import("./theme/themeSlice").ThemeState;
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: import("redux-thunk").ThunkDispatch<{
        user: import("./user/userSlice").UserState;
        theme: import("./theme/themeSlice").ThemeState;
    }, undefined, import("redux").UnknownAction>;
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import themeReducer from './theme/themeSlice';

// Configure store with combined reducers
export const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the type for theme options
type ThemeMode = 'light' | 'dark';

// Define and export the state interface
export interface ThemeState {
  theme: ThemeMode;
}

const initialState: ThemeState = {
  theme: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
export type { ThemeMode };
type ThemeMode = 'light' | 'dark';
export interface ThemeState {
    theme: ThemeMode;
}
export declare const toggleTheme: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"theme/toggleTheme">, setTheme: import("@reduxjs/toolkit").ActionCreatorWithPayload<ThemeMode, "theme/setTheme">;
declare const _default: import("redux").Reducer<ThemeState>;
export default _default;
export type { ThemeMode };

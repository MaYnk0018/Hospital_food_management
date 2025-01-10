import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store.ts";
import ThemeProvider from "./components/themeProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <ReduxProvider store={store}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </ReduxProvider>
);

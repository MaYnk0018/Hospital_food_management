import React from "react";
interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}
export declare const ProtectedRoute: ({ children, allowedRoles, }: ProtectedRouteProps) => import("react/jsx-runtime").JSX.Element;
declare const App: React.FC;
export default App;

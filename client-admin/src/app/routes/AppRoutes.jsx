import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../features/auth/pages/DashboardPage";


//  Ruta protegida
const ProtectedRoute = ({ children }) => {

    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};


export const AppRoutes = () => {

    const token = useAuthStore((state) => state.token);

    return (
        <Routes>

            {/* LOGIN */}
            <Route
                path="/login"
                element={
                    !token
                        ? <LoginPage />
                        : <Navigate to="/dashboard" replace />
                }
            />

            {/* DASHBOARD */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* INICIO */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* CUALQUIER OTRA */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
};
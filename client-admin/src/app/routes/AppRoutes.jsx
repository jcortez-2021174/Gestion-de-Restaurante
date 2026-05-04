import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthPage } from '../../features/auth/pages/AuthPage';
import Dashboard from '../../features/dashboard/Dashboard';

// 🔐 Ruta protegida
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
                        ? <AuthPage /> 
                        : <Navigate to="/dashboard" replace />
                } 
            />

            {/* DASHBOARD */}
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } 
            />

            {/* RUTA INICIAL */}
            <Route 
                path="/" 
                element={<Navigate to="/login" replace />} 
            />

            {/* CUALQUIER OTRA */}
            <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
    );
};
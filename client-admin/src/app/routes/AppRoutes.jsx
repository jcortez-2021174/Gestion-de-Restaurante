import { Routes, Route, Navigate } from 'react-router-dom';
// Subimos dos niveles (../../) para salir de 'routes' y de 'app'
import { useAuthStore } from '../../features/auth/store/authStore';
import { AuthPage } from '../../features/auth/pages/AuthPage';

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/login" element={<AuthPage />} />

            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <div style={{ backgroundColor: 'black', color: 'white', minHeight: '100vh', padding: '20px' }}>
                            <h1 style={{ color: '#d4af37' }}>Bienvenido al Gestor del Restaurante Aurea</h1>
                        </div>
                    </ProtectedRoute>
                } 
            />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
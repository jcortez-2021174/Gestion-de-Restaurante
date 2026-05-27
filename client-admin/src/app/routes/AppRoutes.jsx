import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";
import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../features/auth/pages/DashboardPage";
import { MenuPage } from "../../features/auth/pages/MenuPage";
import { OrdersPage } from "../../features/auth/pages/OrdersPage";
import { ReservationsPage } from "../../features/auth/pages/ReservationsPage";
import { MesasPage } from "../../features/auth/pages/MesasPage";
import { ClientsPage } from "../../features/auth/pages/ClientsPage";
import { VerifyEmailPage } from "../../features/auth/pages/Verifyemailpage";
import { UserDashboardPage } from "../../features/auth/pages/UserDashboardPage";
import { UserMenuPage } from "../../features/auth/pages/UserMenuPage";
import { PuntosAureaPage } from "../../features/auth/pages/PuntosAureaPage";
import { UserNosotrosPage } from "../../features/auth/pages/UserNosotrosPage";
import { UserReservasPage } from "../../features/auth/pages/UserReservasPage";
import { ClientOrderPage } from "../../features/auth/pages/ClientOrderPage";

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    if (!token) return <Navigate to="/login" replace />;
    return children;
};

export const AppRoutes = () => {
    const token = useAuthStore((state) => state.token);

    return (
        <Routes>
            <Route path="/login" element={!token ? <LoginPage /> : <Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/menu" element={<ProtectedRoute><MenuPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
            <Route path="/reservations" element={<ProtectedRoute><ReservationsPage /></ProtectedRoute>} />
            <Route path="/tables" element={<ProtectedRoute><MesasPage /></ProtectedRoute>} />
            <Route path="/clients" element={<ProtectedRoute><ClientsPage /></ProtectedRoute>} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* USER */}
            <Route path="/home" element={<ProtectedRoute><UserDashboardPage /></ProtectedRoute>} />
            <Route path="/user/menu" element={<ProtectedRoute><UserMenuPage /></ProtectedRoute>} />
            <Route path="/user/orders" element={<ProtectedRoute><ClientOrderPage /></ProtectedRoute>} />
            <Route path="/user/reservations" element={<ProtectedRoute><UserReservasPage /></ProtectedRoute>} />
            <Route path="/user/nosotros" element={<ProtectedRoute><UserNosotrosPage /></ProtectedRoute>} />
            <Route path="/user/contacto" element={<ProtectedRoute><div>Contacto - próximamente</div></ProtectedRoute>} />
            <Route path="/user/puntos" element={<ProtectedRoute><PuntosAureaPage /></ProtectedRoute>} />

            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
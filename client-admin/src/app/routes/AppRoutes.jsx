import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import { VerifyEmailPage } from "../../features/auth/pages/Verifyemailpage";

import { DashboardPage } from "../../features/admin/pages/DashboardPage";
import { MenuPage } from "../../features/admin/pages/MenuPage";
import { OrdersPage } from "../../features/admin/pages/OrdersPage";
import { ReservationsPage } from "../../features/admin/pages/ReservationsPage";
import { MesasPage } from "../../features/admin/pages/MesasPage";
import { ClientsPage } from "../../features/admin/pages/ClientsPage";
import { PuntosAureaPage } from "../../features/admin/pages/PuntosAureaPage";
import { ReportsPage } from "../../features/admin/pages/ReportsPage";
import { SettingsPage } from "../../features/admin/pages/SettingsPage";

import { UserDashboardPage } from "../../features/user/pages/UserDashboardPage";
import { UserMenuPage } from "../../features/user/pages/UserMenuPage";
import { UserNosotrosPage } from "../../features/user/pages/UserNosotrosPage";
import { UserReservasPage } from "../../features/user/pages/UserReservasPage";
import { ClientOrderPage } from "../../features/user/pages/ClientOrderPage";

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
            <Route
                path="/login"
                element={
                    !token
                        ? <LoginPage />
                        : <Navigate to="/dashboard" replace />
                }
            />

            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <MenuPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reservations"
                element={
                    <ProtectedRoute>
                        <ReservationsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tables"
                element={
                    <ProtectedRoute>
                        <MesasPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/clients"
                element={
                    <ProtectedRoute>
                        <ClientsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute>
                        <ReportsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/puntos"
                element={
                    <ProtectedRoute>
                        <PuntosAureaPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <UserDashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/menu"
                element={
                    <ProtectedRoute>
                        <UserMenuPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/orders"
                element={
                    <ProtectedRoute>
                        <ClientOrderPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/reservations"
                element={
                    <ProtectedRoute>
                        <UserReservasPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/nosotros"
                element={
                    <ProtectedRoute>
                        <UserNosotrosPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/user/contacto"
                element={
                    <ProtectedRoute>
                        <div>Contacto - próximamente</div>
                    </ProtectedRoute>
                }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
    );
};
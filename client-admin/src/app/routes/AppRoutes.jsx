import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";
import { getAuthenticatedHome } from "../../features/auth/auth.navigation";
import { getJwtRole } from "../../features/auth/jwt.claims";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import { RegisterPage } from "../../features/auth/pages/RegisterPage";
import { VerifyEmailPage } from "../../features/auth/pages/Verifyemailpage";
import { ForgotPasswordPage } from "../../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage";

import { DashboardPage } from "../../features/admin/pages/DashboardPage";
import { MenuPage } from "../../features/admin/pages/MenuPage";
import { OrdersPage } from "../../features/admin/pages/OrdersPage";
import { ReservationsPage } from "../../features/admin/pages/ReservationsPage";
import { MesasPage } from "../../features/admin/pages/MesasPage";
import { ClientsPage } from "../../features/admin/pages/ClientsPage";
import { PuntosAureaPage } from "../../features/admin/pages/PuntosAureaPage";
import { ReportsPage } from "../../features/admin/pages/ReportsPage";
import { SettingsPage } from "../../features/admin/pages/SettingsPage";
import { RewardsPage } from "../../features/admin/pages/RewardsPage";

import { UserDashboardPage } from "../../features/user/pages/UserDashboardPage";
import { UserMenuPage } from "../../features/user/pages/UserMenuPage";
import { UserNosotrosPage } from "../../features/user/pages/UserNosotrosPage";
import { UserReservasPage } from "../../features/user/pages/UserReservasPage";
import { ClientOrderPage } from "../../features/user/pages/ClientOrderPage";
import { UserNotificationsPage } from "../../features/user/pages/UserNotificationsPage";

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole && getJwtRole(token) !== requiredRole) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

const PublicOnlyRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);
    const role = getJwtRole(token);

    if (token) {
        return <Navigate to={getAuthenticatedHome(role)} replace />;
    }

    return children;
};

export const AppRoutes = () => {
    return (
        <Routes>
            <Route
                path="/login"
                element={
                    <PublicOnlyRoute>
                        <LoginPage />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicOnlyRoute>
                        <RegisterPage />
                    </PublicOnlyRoute>
                }
            />

            <Route path="/verify-email" element={<VerifyEmailPage />} />

            <Route
                path="/forgot-password"
                element={
                    <PublicOnlyRoute>
                        <ForgotPasswordPage />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/reset-password"
                element={
                    <PublicOnlyRoute>
                        <ResetPasswordPage />
                    </PublicOnlyRoute>
                }
            />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <DashboardPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/menu"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <MenuPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/orders"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reservations"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <ReservationsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/tables"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <MesasPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/clients"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <ClientsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <ReportsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/rewards"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
                        <RewardsPage />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/settings"
                element={
                    <ProtectedRoute requiredRole="ADMIN_ROLE">
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
                path="/user/notifications"
                element={
                    <ProtectedRoute>
                        <UserNotificationsPage />
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

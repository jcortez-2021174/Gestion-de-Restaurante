import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "../../features/auth/store/authStore";

import { LoginPage } from "../../features/auth/pages/LoginPage";
import { DashboardPage } from "../../features/auth/pages/DashboardPage";
import { MenuPage } from "../../features/auth/pages/MenuPage";
import { OrdersPage } from "../../features/auth/pages/OrdersPage";
import { ReservationsPage } from "../../features/auth/pages/ReservationsPage";
import { MesasPage } from "../../features/auth/pages/MesasPage";
import { ClientsPage } from "../../features/auth/pages/ClientsPage";
import { VerifyEmailPage } from "../../features/auth/pages/VerifyEmailPage";

import { UserDashboardPage } from "../../features/auth/pages/UserDashboardPage";
import { UserMenuPage } from "../../features/auth/pages/UserMenuPage";

// ✅ IMPORT NUEVO
import { PuntosAureaPage } from "../../features/auth/pages/PuntosAureaPage";

// =========================
// RUTA PROTEGIDA
// =========================

const ProtectedRoute = ({ children }) => {
    const token = useAuthStore((state) => state.token);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// =========================
// ROUTES
// =========================

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

            {/* MENU */}
            <Route
                path="/menu"
                element={
                    <ProtectedRoute>
                        <MenuPage />
                    </ProtectedRoute>
                }
            />

            {/* ORDERS */}
            <Route
                path="/orders"
                element={
                    <ProtectedRoute>
                        <OrdersPage />
                    </ProtectedRoute>
                }
            />

            {/* RESERVATIONS */}
            <Route
                path="/reservations"
                element={
                    <ProtectedRoute>
                        <ReservationsPage />
                    </ProtectedRoute>
                }
            />

            {/* TABLES */}
            <Route
                path="/tables"
                element={
                    <ProtectedRoute>
                        <MesasPage />
                    </ProtectedRoute>
                }
            />

            {/* CLIENTS */}
            <Route
                path="/clients"
                element={
                    <ProtectedRoute>
                        <ClientsPage />
                    </ProtectedRoute>
                }
            />

            {/* VERIFY EMAIL */}
            <Route
                path="/verify-email"
                element={<VerifyEmailPage />}
            />

            {/* HOME */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* USER HOME */}
            <Route
                path="/home"
                element={
                    <ProtectedRoute>
                        <UserDashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* USER MENU */}
            <Route
                path="/user/menu"
                element={
                    <ProtectedRoute>
                        <UserMenuPage />
                    </ProtectedRoute>
                }
            />

            {/* USER ORDERS */}
            <Route
                path="/user/orders"
                element={
                    <ProtectedRoute>
                        <div>Órdenes cliente - próximamente</div>
                    </ProtectedRoute>
                }
            />

            {/* USER RESERVATIONS */}
            <Route
                path="/user/reservations"
                element={
                    <ProtectedRoute>
                        <div>Reservas cliente - próximamente</div>
                    </ProtectedRoute>
                }
            />

            {/* USER ABOUT */}
            <Route
                path="/user/nosotros"
                element={
                    <ProtectedRoute>
                        <div>Sobre nosotros - próximamente</div>
                    </ProtectedRoute>
                }
            />

            {/* USER CONTACT */}
            <Route
                path="/user/contacto"
                element={
                    <ProtectedRoute>
                        <div>Contacto - próximamente</div>
                    </ProtectedRoute>
                }
            />

            {/* ✅ PUNTOS AUREA */}
            <Route
                path="/user/puntos-aurea"
                element={
                    <ProtectedRoute>
                        <PuntosAureaPage />
                    </ProtectedRoute>
                }
            />

            {/* 404 */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
};
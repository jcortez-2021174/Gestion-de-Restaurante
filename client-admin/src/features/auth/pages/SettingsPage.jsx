import "../styles/settings.css";
import { Link } from "react-router-dom";

export const SettingsPage = () => {

    return (

        <div className="container">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="logo-box">
                    <img src="/logo.png" alt="logo" />
                </div>

                <ul className="menu">

                    <Link to="/dashboard" className="menu-link">
                        <li>
                            <i className="ri-home-5-line"></i>
                            Inicio
                        </li>
                    </Link>

                    <Link to="/menu" className="menu-link">
                        <li>
                            <i className="ri-restaurant-line"></i>
                            Menú
                        </li>
                    </Link>

                    <Link to="/orders" className="menu-link">
                        <li>
                            <i className="ri-shopping-cart-line"></i>
                            Pedidos
                        </li>
                    </Link>

                    <Link to="/reservations" className="menu-link">
                        <li>
                            <i className="ri-calendar-line"></i>
                            Reservas
                        </li>
                    </Link>

                    <Link to="/tables" className="menu-link">
                        <li>
                            <i className="ri-table-line"></i>
                            Mesas
                        </li>
                    </Link>

                    <Link to="/clients" className="menu-link">
                        <li>
                            <i className="ri-user-line"></i>
                            Clientes
                        </li>
                    </Link>

                    <Link to="/reports" className="menu-link">
                        <li>
                            <i className="ri-bar-chart-box-line"></i>
                            Reportes
                        </li>
                    </Link>

                    <Link to="/settings" className="menu-link active-link">
                        <li>
                            <i className="ri-settings-3-line"></i>
                            Configuración
                        </li>
                    </Link>

                </ul>

                <div className="sidebar-image">

                    <img src="/vino.jpg" alt="vino" />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">
                        <i className="ri-settings-4-line"></i>
                    </div>

                    <p>
                        Ajusta cada detalle
                        <br />
                        de tu restaurante.
                    </p>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main">

                {/* HEADER */}
                <div className="header">

                    <div>

                        <h2>
                            Configuración
                        </h2>

                        <p>
                            Administra los ajustes y preferencias del sistema.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">
                                2
                            </span>

                        </div>

                        <div className="divider"></div>

                        <div className="user">

                            <i className="ri-user-line"></i>

                            <div className="user-info">

                                <span>
                                    Administrador
                                </span>

                                <small>
                                    admin@aurea.com
                                </small>

                            </div>

                            <i className="ri-arrow-down-s-line"></i>

                        </div>

                    </div>

                </div>

                {/* SETTINGS */}
                <div className="settings-layout">

                    {/* LEFT */}
                    <div className="settings-content">

                        {/* TABS */}
                        <div className="settings-tabs">

                            <button className="active">
                                <i className="ri-settings-3-line"></i>
                                General
                            </button>

                            <button>
                                <i className="ri-store-2-line"></i>
                                Restaurante
                            </button>

                            <button>
                                <i className="ri-user-settings-line"></i>
                                Usuarios
                            </button>

                            <button>
                                <i className="ri-bank-card-line"></i>
                                Pagos
                            </button>

                            <button>
                                <i className="ri-notification-2-line"></i>
                                Notificaciones
                            </button>

                            <button>
                                <i className="ri-shield-check-line"></i>
                                Seguridad
                            </button>

                        </div>

                        {/* GENERAL CONFIG */}
                        <div className="settings-box">

                            <div className="settings-title">

                                <i className="ri-tools-line"></i>

                                <h3>
                                    Configuración General
                                </h3>

                            </div>

                            <div className="settings-grid">

                                <div className="input-group">

                                    <label>
                                        Nombre del Restaurante
                                    </label>

                                    <input
                                        type="text"
                                        value="Aurea - El Arte del Cordero"
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Correo Electrónico
                                    </label>

                                    <input
                                        type="email"
                                        value="contacto@aurea.com"
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Teléfono
                                    </label>

                                    <input
                                        type="text"
                                        value="+502 5555-1234"
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Moneda
                                    </label>

                                    <select>

                                        <option>
                                            Quetzal (Q)
                                        </option>

                                        <option>
                                            Dólar ($)
                                        </option>

                                    </select>

                                </div>

                                <div className="input-group full-width">

                                    <label>
                                        Dirección
                                    </label>

                                    <input
                                        type="text"
                                        value="Zona 10, Ciudad de Guatemala"
                                    />

                                </div>

                                <div className="input-group">

                                    <label>
                                        Zona Horaria
                                    </label>

                                    <select>

                                        <option>
                                            (GMT-06:00) Guatemala
                                        </option>

                                    </select>

                                </div>

                                <div className="input-group">

                                    <label>
                                        Idioma
                                    </label>

                                    <select>

                                        <option>
                                            Español
                                        </option>

                                        <option>
                                            English
                                        </option>

                                    </select>

                                </div>

                            </div>

                            <button className="btn-save">

                                <i className="ri-save-line"></i>

                                Guardar Cambios

                            </button>

                        </div>

                        {/* EXTRA SETTINGS */}
                        <div className="extra-settings-grid">

                            {/* ADMIN PROFILE */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-admin-line"></i>

                                    <h3>
                                        Perfil del Administrador
                                    </h3>

                                </div>

                                <div className="admin-profile">

                                    <div className="admin-avatar">
                                        AD
                                    </div>

                                    <div>

                                        <h4>
                                            Administrador General
                                        </h4>

                                        <span>
                                            Último acceso: Hoy 10:42 AM
                                        </span>

                                    </div>

                                </div>

                            </div>

                            {/* VISUAL */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-image-edit-line"></i>

                                    <h3>
                                        Personalización Visual
                                    </h3>

                                </div>

                                <div className="visual-actions">

                                    <button className="btn-outline-setting">

                                        <i className="ri-upload-cloud-2-line"></i>

                                        Cambiar Logo

                                    </button>

                                    <button className="btn-outline-setting">

                                        <i className="ri-image-line"></i>

                                        Cambiar Banner

                                    </button>

                                </div>

                            </div>

                            {/* HOURS */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-time-line"></i>

                                    <h3>
                                        Horarios del Restaurante
                                    </h3>

                                </div>

                                <div className="hours-grid">

                                    <div className="input-group">

                                        <label>
                                            Apertura
                                        </label>

                                        <input
                                            type="time"
                                            value="08:00"
                                        />

                                    </div>

                                    <div className="input-group">

                                        <label>
                                            Cierre
                                        </label>

                                        <input
                                            type="time"
                                            value="23:00"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* RESERVATIONS */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-calendar-check-line"></i>

                                    <h3>
                                        Configuración de Reservas
                                    </h3>

                                </div>

                                <div className="settings-grid">

                                    <div className="input-group">

                                        <label>
                                            Máximo por Mesa
                                        </label>

                                        <input
                                            type="number"
                                            value="8"
                                        />

                                    </div>

                                    <div className="input-group">

                                        <label>
                                            Tiempo Máximo
                                        </label>

                                        <select>

                                            <option>
                                                2 Horas
                                            </option>

                                            <option>
                                                3 Horas
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>

                            {/* PAYMENTS */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-bank-card-line"></i>

                                    <h3>
                                        Métodos de Pago
                                    </h3>

                                </div>

                                <div className="switch-list">

                                    <div className="switch-item">

                                        <span>
                                            Visa / Mastercard
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" checked />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                    <div className="switch-item">

                                        <span>
                                            PayPal
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" checked />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                    <div className="switch-item">

                                        <span>
                                            Efectivo
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" checked />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                </div>

                            </div>

                            {/* NOTIFICATIONS */}
                            <div className="extra-card">

                                <div className="extra-card-header">

                                    <i className="ri-notification-2-line"></i>

                                    <h3>
                                        Notificaciones
                                    </h3>

                                </div>

                                <div className="switch-list">

                                    <div className="switch-item">

                                        <span>
                                            Nuevos Pedidos
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" checked />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                    <div className="switch-item">

                                        <span>
                                            Nuevas Reservas
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" checked />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                    <div className="switch-item">

                                        <span>
                                            Correos del Sistema
                                        </span>

                                        <label className="switch">

                                            <input type="checkbox" />

                                            <span className="slider"></span>

                                        </label>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="settings-sidebar">

                        {/* INFO */}
                        <div className="side-box">

                            <h3>
                                Información del Sistema
                            </h3>

                            <div className="info-item">

                                <span>
                                    Versión del Sistema
                                </span>

                                <strong>
                                    1.0.0
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Última Actualización
                                </span>

                                <strong>
                                    20/05/2025
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Base de Datos
                                </span>

                                <strong className="status-online">
                                    Conectada
                                </strong>

                            </div>

                            <div className="info-item">

                                <span>
                                    Estado del Sistema
                                </span>

                                <strong className="status-online">
                                    Operativo
                                </strong>

                            </div>

                        </div>

                        {/* BACKUP */}
                        <div className="side-box">

                            <h3>
                                Respaldo de Datos
                            </h3>

                            <p>
                                Realiza copias de seguridad de la información del restaurante.
                            </p>

                            <button className="btn-outline-setting">

                                <i className="ri-download-cloud-2-line"></i>

                                Realizar Respaldo

                            </button>

                        </div>

                        {/* ACTIONS */}
                        <div className="side-box">

                            <h3>
                                Acciones del Sistema
                            </h3>

                            <div className="action-item">

                                <div>

                                    <h4>
                                        Limpiar Caché
                                    </h4>

                                    <span>
                                        Mejora el rendimiento del sistema
                                    </span>

                                </div>

                                <i className="ri-arrow-right-s-line"></i>

                            </div>

                            <div className="action-item">

                                <div>

                                    <h4>
                                        Cerrar Sesiones
                                    </h4>

                                    <span>
                                        Cierra sesiones activas
                                    </span>

                                </div>

                                <i className="ri-arrow-right-s-line"></i>

                            </div>

                            <div className="action-item danger-action">

                                <div>

                                    <h4>
                                        Restablecer Sistema
                                    </h4>

                                    <span>
                                        Reinicia la configuración
                                    </span>

                                </div>

                                <i className="ri-arrow-right-s-line"></i>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

};
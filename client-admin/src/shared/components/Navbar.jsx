import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../features/auth/store/authStore";
import { useCartStore } from "../../features/user/store/carStore";
import {
  marcarNotificacionAdminLeida,
  marcarTodasAdminLeidas,
  obtenerNotificacionesAdmin,
} from "../../services/notificaciones.service";
import { useSmartPolling } from "../hooks/useSmartPolling";

const destinationFor = (notification) => {
  if (notification.categoria === "PEDIDO") return "/orders";
  if (notification.categoria === "RESERVACION") return "/reservations";
  if (notification.categoria === "RECOMPENSA" || notification.categoria === "PUNTOS") return "/rewards";
  if (notification.evento === "CLIENTE_REGISTRADO") return "/clients";
  return "/dashboard";
};

const notificationIcon = (notification) => {
  if (notification.categoria === "PEDIDO") return "ri-shopping-bag-3-line";
  if (notification.categoria === "RESERVACION") return "ri-calendar-check-line";
  if (notification.categoria === "RECOMPENSA") return "ri-gift-line";
  if (notification.evento === "CLIENTE_REGISTRADO") return "ri-user-add-line";
  return "ri-notification-3-line";
};

const formatDate = (value) => new Intl.DateTimeFormat("es-GT", {
  dateStyle: "short",
  timeStyle: "short",
}).format(new Date(value));

export const Navbar = ({ notificationCount = 0 }) => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const hydrateProfile = useAuthStore((state) => state.hydrateProfile);
  const logout = useAuthStore((state) => state.logout);
  const clearCart = useCartStore((state) => state.vaciarCarrito);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(notificationCount);
  const [toast, setToast] = useState(null);
  const knownIds = useRef(null);

  useEffect(() => {
    hydrateProfile();
  }, [hydrateProfile]);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!event.target.closest(".admin-navbar-anchor")) {
        setProfileOpen(false);
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      const result = await obtenerNotificacionesAdmin();
      const incomingIds = new Set(result.notificaciones.map((item) => item.id));

      if (knownIds.current) {
        const newNotification = result.notificaciones.find((item) => (
          !knownIds.current.has(item.id) && !item.leida
        ));
        if (newNotification) setToast(newNotification);
      }

      knownIds.current = incomingIds;
      setNotifications(result.notificaciones);
      setUnreadCount(result.noLeidas);
    } catch {
      setUnreadCount((current) => current || notificationCount);
    }
  }, [notificationCount]);

  useSmartPolling(loadNotifications, 30000);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(null), 5000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const displayName = user?.name
    ? `${user.name} ${user.surname || ""}`.trim()
    : user?.username || "Administrador Aurea";
  const username = user?.username || displayName;
  const email = user?.email || "Correo no disponible";
  const role = user?.role || "ADMIN_ROLE";
  const initials = useMemo(() => {
    const source = user?.name && user?.surname ? `${user.name} ${user.surname}` : username;
    return source.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }, [user, username]);

  const handleLogout = async () => {
    clearCart();
    await logout();
    navigate("/login", { replace: true });
  };

  const openNotification = async (notification) => {
    if (!notification.leida) {
      await marcarNotificacionAdminLeida(notification.id);
      setNotifications((current) => current.map((item) => (
        item.id === notification.id ? { ...item, leida: true } : item
      )));
      setUnreadCount((current) => Math.max(0, current - 1));
    }
    setNotificationsOpen(false);
    navigate(destinationFor(notification));
  };

  const markAllRead = async () => {
    await marcarTodasAdminLeidas();
    setNotifications((current) => current.map((item) => ({ ...item, leida: true })));
    setUnreadCount(0);
  };

  return (
    <>
      <div className="header admin-navbar">
        <div>
          <h2>Bienvenido a Aurea</h2>
          <p>Tradicion e innovacion en cada plato.</p>
        </div>

        <div className="user-box">
          <div className="admin-navbar-anchor">
            <button
              type="button"
              className={`notification admin-notification-button${notificationsOpen ? " is-open" : ""}`}
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setProfileOpen(false);
              }}
              aria-label="Abrir notificaciones"
              aria-expanded={notificationsOpen}
            >
              <i className="ri-notification-3-line" />
              {unreadCount > 0 && <span className="badge">{Math.min(unreadCount, 99)}</span>}
            </button>

            {notificationsOpen && (
              <section className="admin-notification-panel">
                <header>
                  <div><span>Centro de actividad</span><h3>Notificaciones</h3></div>
                  <button type="button" onClick={markAllRead} disabled={!unreadCount}>Marcar todas</button>
                </header>
                <div className="admin-notification-list">
                  {notifications.slice(0, 12).map((notification) => (
                    <button
                      type="button"
                      className={`admin-notification-item${notification.leida ? "" : " is-unread"}`}
                      key={notification.id}
                      onClick={() => openNotification(notification)}
                    >
                      <span className="admin-notification-icon"><i className={notificationIcon(notification)} /></span>
                      <span className="admin-notification-copy">
                        <strong>{notification.titulo}</strong>
                        <span>{notification.resumen}</span>
                        <small>{formatDate(notification.fecha)}</small>
                      </span>
                      {!notification.leida && <span className="admin-unread-dot" />}
                    </button>
                  ))}
                  {!notifications.length && <p className="admin-notification-empty">No hay actividad reciente.</p>}
                </div>
              </section>
            )}
          </div>

          <div className="divider" />

          <div className="admin-navbar-anchor">
            <button
              type="button"
              className="user admin-user-trigger"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              aria-expanded={profileOpen}
            >
              <span className="admin-user-avatar">
                {user?.profilePicture ? <img src={user.profilePicture} alt="" /> : initials}
              </span>
              <span className="user-info">
                <strong>{displayName}</strong>
                <span>{username}</span>
                <small>{role}</small>
                <em>{email}</em>
              </span>
              <i className={profileOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"} />
            </button>

            {profileOpen && (
              <section className="admin-profile-menu">
                <div className="admin-profile-summary">
                  <strong>{displayName}</strong>
                  <span>{role}</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
                <button type="button" onClick={() => { setProfileDialogOpen(true); setProfileOpen(false); }}>
                  <i className="ri-user-line" /> Mi perfil
                </button>
                <button type="button" onClick={() => navigate("/settings")}>
                  <i className="ri-settings-3-line" /> Configuracion
                </button>
                <button type="button" onClick={() => { setNotificationsOpen(true); setProfileOpen(false); }}>
                  <i className="ri-notification-3-line" /> Notificaciones
                </button>
                <button type="button" className="admin-logout-action" onClick={handleLogout}>
                  <i className="ri-logout-box-r-line" /> Cerrar sesion
                </button>
              </section>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <button type="button" className="admin-live-toast" onClick={() => openNotification(toast)}>
          <span><i className={notificationIcon(toast)} /></span>
          <div><strong>{toast.titulo}</strong><small>{toast.resumen}</small></div>
          <i className="ri-arrow-right-line" />
        </button>
      )}

      {profileDialogOpen && (
        <div className="admin-profile-dialog-backdrop" onClick={() => setProfileDialogOpen(false)}>
          <section className="admin-profile-dialog" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="admin-profile-dialog-close" onClick={() => setProfileDialogOpen(false)}>
              <i className="ri-close-line" />
            </button>
            <span className="admin-user-avatar is-large">
              {user?.profilePicture ? <img src={user.profilePicture} alt="" /> : initials}
            </span>
            <span className="admin-eyebrow">Perfil administrativo</span>
            <h2>{displayName}</h2>
            <dl>
              <div><dt>Username</dt><dd>{username}</dd></div>
              <div><dt>Correo</dt><dd>{email}</dd></div>
              <div><dt>Rol</dt><dd>{role}</dd></div>
            </dl>
          </section>
        </div>
      )}
    </>
  );
};

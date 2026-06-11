import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useCartStore } from "../store/carStore";
import "../styles/user-shell.css";
import "../styles/user-components.css";
import "../styles/user-page-overrides.css";

const navigation = [
  { to: "/home", label: "Inicio", icon: "ri-home-4-line" },
  { to: "/user/menu", label: "Menú", icon: "ri-restaurant-line" },
  { to: "/user/reservations", label: "Reservas", icon: "ri-calendar-line" },
  { to: "/user/orders", label: "Pedidos", icon: "ri-motorbike-line", cart: true },
  { to: "/user/puntos", label: "Puntos Aurea", icon: "ri-vip-crown-line" },
  { to: "/user/notifications", label: "Notificaciones", icon: "ri-notification-3-line" },
  { to: "/user/nosotros", label: "Sobre Nosotros", icon: "ri-group-line" },
];

export const UserShell = ({ children, className = "", contentClassName = "" }) => {
  const [navigationOpen, setNavigationOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const carrito = useCartStore((state) => state.carrito);
  const clearCart = useCartStore((state) => state.vaciarCarrito);
  const navigate = useNavigate();
  const cartCount = carrito.reduce((total, item) => total + item.cantidad, 0);

  const handleLogout = async () => {
    clearCart();
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className={`user-shell ${className}`.trim()}>
      <header className="user-mobile-header">
        <NavLink to="/home" className="user-mobile-brand" aria-label="Ir al inicio">
          <img src="/logo.png" alt="Aurea" />
        </NavLink>
        <div className="user-mobile-actions">
          <button
            className="user-mobile-cart"
            type="button"
            onClick={() => navigate("/user/orders")}
            aria-label="Abrir pedidos"
          >
            <i className="ri-shopping-bag-line" />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <button
            className="user-menu-toggle"
            type="button"
            onClick={() => setNavigationOpen((current) => !current)}
            aria-expanded={navigationOpen}
            aria-label="Abrir navegación"
          >
            <i className={navigationOpen ? "ri-close-line" : "ri-menu-3-line"} />
          </button>
        </div>
      </header>

      {navigationOpen && (
        <button
          type="button"
          className="user-shell-backdrop"
          onClick={() => setNavigationOpen(false)}
          aria-label="Cerrar navegación"
        />
      )}

      <aside className={`user-sidebar${navigationOpen ? " is-open" : ""}`}>
        <NavLink to="/home" className="user-brand" onClick={() => setNavigationOpen(false)}>
          <img src="/logo.png" alt="Aurea Restaurant Manager" />
        </NavLink>

        <div className="user-sidebar-section user-navigation-section">
          <span className="user-sidebar-section-label">Navegación</span>
          <nav className="user-navigation" aria-label="Navegación del cliente">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setNavigationOpen(false)}
                className={({ isActive }) => `user-nav-link${isActive ? " is-active" : ""}`}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
                {item.cart && cartCount > 0 && <strong>{cartCount}</strong>}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="user-sidebar-bottom">
          <section className="user-sidebar-section user-contact-card">
            <span className="user-sidebar-section-label">Contacto</span>
            <a href="tel:+50212345678">
              <i className="ri-phone-line" />
              <span>+502 1234 5678</span>
            </a>
            <a href="mailto:loscodiguitos26@gmail.com">
              <i className="ri-mail-line" />
              <span>loscodiguitos26@gmail.com</span>
            </a>
            <div className="user-contact-address">
              <i className="ri-map-pin-line" />
              <span>5ta avenida 12-34, Zona 10<br />Ciudad de Guatemala</span>
            </div>
          </section>

          <section className="user-sidebar-section user-social-section">
            <span className="user-sidebar-section-label">Síguenos</span>
            <div className="user-social-links" aria-label="Redes sociales">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                <i className="ri-facebook-fill" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                <i className="ri-instagram-line" />
              </a>
              <a href="https://wa.me/50255551234" target="_blank" rel="noreferrer" aria-label="WhatsApp">
                <i className="ri-whatsapp-line" />
              </a>
            </div>
          </section>

          <section className="user-sidebar-section user-account-section">
            <span className="user-sidebar-section-label">Tu cuenta</span>
            <button type="button" className="user-sidebar-account" onClick={handleLogout}>
              <span className="user-sidebar-avatar">
                <i className="ri-user-line" />
              </span>
              <span>
                <strong>{user?.username || user?.name || "Cliente Aurea"}</strong>
                <small>Cerrar sesión</small>
              </span>
              <i className="ri-logout-box-r-line" />
            </button>
          </section>
        </div>
      </aside>

      <main className={`user-content ${contentClassName}`.trim()}>{children}</main>

      <a
        href="https://wa.me/50255551234"
        className="user-whatsapp"
        target="_blank"
        rel="noreferrer"
        aria-label="Contactar por WhatsApp"
      >
        <i className="ri-whatsapp-line" />
      </a>
    </div>
  );
};

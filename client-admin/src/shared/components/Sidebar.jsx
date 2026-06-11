import { NavLink } from "react-router-dom";

const items = [
  ["/dashboard", "ri-home-5-line", "Inicio"],
  ["/menu", "ri-restaurant-line", "Menu"],
  ["/orders", "ri-shopping-cart-line", "Pedidos"],
  ["/reservations", "ri-calendar-line", "Reservas"],
  ["/tables", "ri-table-line", "Mesas"],
  ["/clients", "ri-user-line", "Clientes"],
  ["/rewards", "ri-gift-line", "Recompensas"],
  ["/reports", "ri-bar-chart-line", "Reportes"],
  ["/settings", "ri-settings-3-line", "Configuracion"],
];

export const Sidebar = () => (
  <aside className="sidebar">
    <NavLink to="/dashboard" className="logo-box" aria-label="Aurea dashboard">
      <img src="/logo.png" alt="Aurea Restaurant" />
    </NavLink>

    <nav className="menu" aria-label="Navegacion administrativa">
      {items.map(([to, icon, label]) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `menu-link${isActive ? " active" : ""}`}
        >
          <i className={icon} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>

    <div className="sidebar-image">
      <img src="/vino.jpg" alt="" />
      <div className="overlay" />
      <div className="sidebar-decor"><i className="ri-goblet-line" /></div>
      <p>No es solo comida,<br />es una experiencia.</p>
    </div>
  </aside>
);

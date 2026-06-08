import { Link } from "react-router-dom";

export const Sidebar = () => {
    return (
        <aside className="sidebar">

            <div className="logo-box">
                <img src="/logo.png" alt="logo" />
            </div>

            <ul className="menu">

                <li>
                    <Link to="/dashboard" className="menu-link">
                        <i className="ri-home-5-line"></i>
                        Inicio
                    </Link>
                </li>

                <li>
                    <Link to="/menu" className="menu-link">
                        <i className="ri-restaurant-line"></i>
                        Menú
                    </Link>
                </li>

                <li>
                    <Link to="/orders" className="menu-link">
                        <i className="ri-shopping-cart-line"></i>
                        Pedidos
                    </Link>
                </li>

                <li>
                    <Link to="/reservations" className="menu-link">
                        <i className="ri-calendar-line"></i>
                        Reservas
                    </Link>
                </li>

                <li>
                    <Link to="/tables" className="menu-link">
                        <i className="ri-table-line"></i>
                        Mesas
                    </Link>
                </li>

                <li>
                    <Link to="/clients" className="menu-link">
                        <i className="ri-user-line"></i>
                        Clientes
                    </Link>
                </li>

                <li>
                    <Link to="/reports" className="menu-link">
                        <i className="ri-bar-chart-line"></i>
                        Reportes
                    </Link>
                </li>

                <li>
                    <Link to="/settings" className="menu-link">
                        <i className="ri-settings-3-line"></i>
                        Configuración
                    </Link>
                </li>

            </ul>

            <div className="sidebar-image">

                <img src="/vino.jpg" alt="vino" />

                <div className="overlay"></div>

                <div className="sidebar-decor">
                    <i className="ri-goblet-line"></i>
                </div>

                <p>
                    No es solo comida,
                    <br />
                    es una experiencia.
                </p>

            </div>

        </aside>
    );
};

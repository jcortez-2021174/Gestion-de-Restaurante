import { Link } from "react-router-dom";

import "../styles/clients.css";

export const ClientsPage = () => {

    const clientsData = [

        {
            initials: "JP",
            name: "Fernanda Mendez EL AMOR DE MI VIDA",
            email: "fernanda.mendez@email.com",
            phone: "+502 5555-1234",
            total: "Q4,850.00",
            lastVisit: "25/05/2025"
        },

        {
            initials: "ML",
            name: "María López",
            email: "maria.lopez@email.com",
            phone: "+502 5555-5678",
            total: "Q3,250.00",
            lastVisit: "22/05/2025"
        },

        {
            initials: "CA",
            name: "Carlos Álvarez",
            email: "carlos.alvarez@email.com",
            phone: "+502 5555-8765",
            total: "Q2,980.00",
            lastVisit: "20/05/2025"
        },

        {
            initials: "LG",
            name: "Lucía Gómez",
            email: "lucia.gomez@email.com",
            phone: "+502 5555-4321",
            total: "Q2,450.00",
            lastVisit: "18/05/2025"
        },

        {
            initials: "FM",
            name: "Fernando Morales",
            email: "fernando.morales@email.com",
            phone: "+502 5555-1122",
            total: "Q1,760.00",
            lastVisit: "15/05/2025"
        }

    ];

    return (

        <div className="container">

            {/* SIDEBAR */}
            <aside className="sidebar">

                <div className="logo-box">
                    <img src="/logo.png" alt="" />
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
                        <li className="active">
                            <i className="ri-user-line"></i>
                            Clientes
                        </li>
                    </Link>

                    <Link to="/reports" className="menu-link">
                        <li>
                            <i className="ri-bar-chart-line"></i>
                            Reportes
                        </li>
                    </Link>

                    <Link to="/settings" className="menu-link">
                        <li>
                            <i className="ri-settings-3-line"></i>
                            Configuración
                        </li>
                    </Link>

                </ul>

                <div className="sidebar-image">

                    <img src="/vino.jpg" alt="" />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">
                        <i className="ri-goblet-line"></i>
                    </div>

                    <p>
                        Tradición e innovación
                        <br />
                        en cada plato.
                    </p>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main">

                {/* HEADER */}
                <div className="header">

                    <div>

                        <h1>Clientes</h1>

                        <p>
                            Gestiona la información de tus clientes.
                        </p>

                    </div>

                    <div className="clients-header-actions">

                        <button className="btn-gold">
                            <i className="ri-add-line"></i>
                            Nuevo Cliente
                        </button>

                        <div className="search-box">

                            <i className="ri-search-line"></i>

                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                            />

                        </div>

                        <button className="btn-filter">
                            <i className="ri-filter-3-line"></i>
                        </button>

                    </div>

                </div>

                {/* LAYOUT */}
                <section className="clients-layout">

                    {/* LEFT */}
                    <div className="clients-content card">

                        <div className="clients-table-header">

                            <span>Cliente</span>
                            <span>Contacto</span>
                            <span>Total Compras</span>
                            <span>Última Visita</span>
                            <span>Acciones</span>

                        </div>

                        <div className="clients-table">

                            {
                                clientsData.map((client, index) => (

                                    <div
                                        className={`client-row ${index === 0 ? "selected" : ""}`}
                                        key={index}
                                    >

                                        <div className="client-info">

                                            <div className="client-avatar">
                                                {client.initials}
                                            </div>

                                            <div>

                                                <h4>
                                                    {client.name}
                                                </h4>

                                                <span>
                                                    {client.email}
                                                </span>

                                            </div>

                                        </div>

                                        <div className="client-contact">

                                            <i className="ri-phone-line"></i>

                                            <span>
                                                {client.phone}
                                            </span>

                                        </div>

                                        <div className="client-total">
                                            {client.total}
                                        </div>

                                        <div className="client-visit">
                                            {client.lastVisit}
                                        </div>

                                        <div className="client-actions">

                                            <button>
                                                <i className="ri-eye-line"></i>
                                            </button>

                                            <button>
                                                <i className="ri-pencil-line"></i>
                                            </button>

                                        </div>

                                    </div>

                                ))
                            }

                        </div>

                        {/* PAGINATION */}
                        <div className="pagination">

                            <button>
                                Anterior
                            </button>

                            <button className="active">
                                1
                            </button>

                            <button>
                                2
                            </button>

                            <button>
                                3
                            </button>

                            <span>...</span>

                            <button>
                                6
                            </button>

                            <button>
                                Siguiente
                            </button>

                        </div>

                        <small className="results-text">
                            Mostrando 1 a 8 de 45 clientes
                        </small>

                    </div>

                    {/* RIGHT */}
                    <aside className="client-details card">

                        <div className="client-profile">

                            <div className="profile-avatar">
                                JP
                            </div>

                            <div>

                                <h2>
                                    Juan Pérez
                                </h2>

                                <span className="vip-badge">
                                    Cliente Frecuente
                                </span>

                                <p>
                                    juan.perez@email.com
                                </p>

                                <p>
                                    +502 5555-1234
                                </p>

                            </div>

                        </div>

                        {/* INFO */}
                        <div className="detail-section">

                            <h3>
                                Información Personal
                            </h3>

                            <div className="detail-item">
                                <i className="ri-calendar-line"></i>
                                <span>Fecha de registro:</span>
                                <strong>10/03/2025</strong>
                            </div>

                            <div className="detail-item">
                                <i className="ri-cake-2-line"></i>
                                <span>Cumpleaños:</span>
                                <strong>15/07</strong>
                            </div>

                            <div className="detail-item">
                                <i className="ri-map-pin-line"></i>
                                <span>Dirección:</span>
                                <strong>Zona 10, Guatemala</strong>
                            </div>

                        </div>

                        {/* STATS */}
                        <div className="detail-section">

                            <h3>
                                Resumen de Actividad
                            </h3>

                            <div className="stats-grid">

                                <div className="stat-box">

                                    <i className="ri-wallet-3-line"></i>

                                    <div>
                                        <span>Total Compras</span>
                                        <strong>Q4,850.00</strong>
                                    </div>

                                </div>

                                <div className="stat-box">

                                    <i className="ri-shopping-bag-line"></i>

                                    <div>
                                        <span>Pedidos</span>
                                        <strong>12</strong>
                                    </div>

                                </div>

                                <div className="stat-box">

                                    <i className="ri-calendar-check-line"></i>

                                    <div>
                                        <span>Reservas</span>
                                        <strong>8</strong>
                                    </div>

                                </div>

                                <div className="stat-box">

                                    <i className="ri-time-line"></i>

                                    <div>
                                        <span>Última Visita</span>
                                        <strong>25/05/2025</strong>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* HISTORY */}
                        <div className="detail-section">

                            <h3>
                                Historial Reciente
                            </h3>

                            <div className="history-list">

                                <div className="history-item">

                                    <div>

                                        <h4>
                                            Pedido #PED1025
                                        </h4>

                                        <span>
                                            25/05/2025
                                        </span>

                                    </div>

                                    <strong>
                                        Q850.00
                                    </strong>

                                </div>

                                <div className="history-item">

                                    <div>

                                        <h4>
                                            Reserva #RES2056
                                        </h4>

                                        <span>
                                            Mesa 6 - 8:00 PM
                                        </span>

                                    </div>

                                    <strong>
                                        Confirmada
                                    </strong>

                                </div>

                            </div>

                            <button className="btn-gold full">
                                Ver historial completo
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

        </div>

    );

};
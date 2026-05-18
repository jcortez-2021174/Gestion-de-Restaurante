import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/mesas.css";

import {
    FaChair,
    FaPlus,
    FaSearch,
    FaMapMarkerAlt,
    FaUserTie,
    FaClock,
    FaUsers,
    FaLock,
    FaShoppingCart
} from "react-icons/fa";

export const MesasPage = () => {

    const terrazaTables = [

        {
            id: 1,
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 2,
            status: "available",
            type: "round",
            people: "2 Pers."
        },

        {
            id: 3,
            status: "reserved",
            type: "square",
            people: "4 Pers.",
            time: "19:00"
        },

        {
            id: 4,
            status: "occupied",
            type: "round",
            people: "6 Pers."
        },

        {
            id: 5,
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 6,
            status: "cleaning",
            type: "square",
            people: "4 Pers.",
            label: "Limpieza"
        }

    ];

    const salonTables = [

        {
            id: 7,
            status: "occupied",
            type: "round",
            people: "4 Pers."
        },

        {
            id: 8,
            status: "occupied",
            type: "square",
            people: "2 Pers."
        },

        {
            id: 9,
            status: "available",
            type: "round",
            people: "2 Pers."
        },

        {
            id: 10,
            status: "occupied active-table",
            type: "rect",
            people: "6 Pers."
        },

        {
            id: 11,
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 12,
            status: "reserved",
            type: "square",
            people: "4 Pers.",
            time: "20:00"
        },

        {
            id: 13,
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 14,
            status: "cleaning",
            type: "square",
            people: "4 Pers.",
            label: "Limpieza"
        },

        {
            id: 15,
            status: "occupied",
            type: "round",
            people: "4 Pers."
        },

        {
            id: 16,
            status: "available",
            type: "square",
            people: "2 Pers."
        },

        {
            id: 17,
            status: "occupied",
            type: "square",
            people: "2 Pers."
        },

        {
            id: 18,
            status: "available",
            type: "square",
            people: "4 Pers."
        }

    ];

    const privateTables = [

        {
            id: 19,
            status: "reserved",
            type: "rect",
            people: "8 Pers.",
            time: "18:30"
        },

        {
            id: 20,
            status: "occupied",
            type: "rect",
            people: "6 Pers."
        },

        {
            id: 21,
            status: "disabled",
            type: "rect",
            people: "10 Pers.",
            label: "Fuera de Servicio"
        },

        {
            id: 22,
            status: "available",
            type: "rect",
            people: "10 Pers."
        }

    ];

    const [selectedTable] = useState(salonTables[3]);

    const renderTable = (table) => (

        <div
            key={table.id}
            className={`table-card ${table.status} ${table.type}`}
        >

            {/* GLOW */}
            <div className="table-glow"></div>

            {/* CHAIRS */}
            <span className="chair top"></span>
            <span className="chair bottom"></span>
            <span className="chair left"></span>
            <span className="chair right"></span>

            {/* NUMBER */}
            <div className="table-number">
                Mesa {table.id}
            </div>

            {/* PEOPLE */}
            <div className="table-capacity">

                <FaUsers />

                <span>
                    {table.people}
                </span>

            </div>

            {/* TIME */}
            {
                table.time &&

                <div className="table-time">

                    <FaClock />

                    <span>
                        {table.time}
                    </span>

                </div>
            }

            {/* LABEL */}
            {
                table.label &&

                <div className="table-label">
                    {table.label}
                </div>
            }

        </div>

    );

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
                        <li className="active">
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
                        Elegancia y servicio
                        <br />
                        en cada mesa.
                    </p>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main">

                {/* HEADER */}
                <div className="header">

                    <div>

                        <h1>
                            Gestión de Mesas
                        </h1>

                        <p>
                            Visualiza el estado del restaurante en tiempo real.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">
                                5
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

                        </div>

                    </div>

                </div>

                {/* CONTENT */}
                <section className="tables-layout">

                    {/* LEFT */}
                    <div className="tables-content card">

                        {/* TOP */}
                        <div className="tables-top">

                            <div className="tables-title">

                                <h2>
                                    <FaChair />
                                    Mesas
                                </h2>

                            </div>

                            <button className="new-table-btn">

                                <FaPlus />

                                Nueva Mesa

                            </button>

                        </div>

                        {/* FILTERS */}
                        <div className="tables-filters">

                            <div className="tabs">

                                <button className="active">
                                    Todas
                                </button>

                                <button>
                                    Disponibles
                                </button>

                                <button>
                                    Ocupadas
                                </button>

                                <button>
                                    Reservadas
                                </button>

                                <button>
                                    Limpieza
                                </button>

                            </div>

                            <div className="search-box">

                                <input
                                    type="text"
                                    placeholder="Buscar mesa..."
                                />

                                <FaSearch />

                            </div>

                        </div>

                        {/* STATS */}
                        <div className="tables-stats">

                            <div className="stat-card available">

                                <div className="stat-icon">
                                    <FaChair />
                                </div>

                                <div>
                                    <h3>12</h3>
                                    <span>Disponibles</span>
                                </div>

                            </div>

                            <div className="stat-card occupied">

                                <div className="stat-icon">
                                    <FaUsers />
                                </div>

                                <div>
                                    <h3>5</h3>
                                    <span>Ocupadas</span>
                                </div>

                            </div>

                            <div className="stat-card reserved">

                                <div className="stat-icon">
                                    <FaClock />
                                </div>

                                <div>
                                    <h3>3</h3>
                                    <span>Reservadas</span>
                                </div>

                            </div>

                            <div className="stat-card cleaning">

                                <div className="stat-icon">
                                    <FaLock />
                                </div>

                                <div>
                                    <h3>2</h3>
                                    <span>Limpieza</span>
                                </div>

                            </div>

                        </div>

                        {/* RESTAURANT MAP */}
                        <div className="restaurant-map">

                            <div className="map-header">

                                <h3>
                                    Plano del Restaurante
                                </h3>

                            </div>

                            {/* TERRAZA */}
                            <div className="zone">

                                <div className="zone-title">
                                    TERRAZA
                                </div>

                                <div className="tables-grid terrace-grid">

                                    {
                                        terrazaTables.map(renderTable)
                                    }

                                </div>

                            </div>

                            {/* SALON */}
                            <div className="zone">

                                <div className="zone-title">
                                    SALÓN PRINCIPAL
                                </div>

                                <div className="tables-grid salon-grid">

                                    {
                                        salonTables.map(renderTable)
                                    }

                                </div>

                            </div>

                            {/* PRIVADO */}
                            <div className="zone">

                                <div className="zone-title">
                                    SALÓN PRIVADO
                                </div>

                                <div className="tables-grid private-grid">

                                    {
                                        privateTables.map(renderTable)
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <aside className="table-details card">

                        <h2>
                            DETALLE DE MESA
                        </h2>

                        <div className="detail-card">

                            <h3>
                                Mesa {selectedTable.id}
                            </h3>

                            <span className="badge occupied">
                                Ocupada
                            </span>

                            <div className="detail-list">

                                <div className="detail-item">

                                    <FaUsers />

                                    <div>

                                        <small>
                                            Capacidad
                                        </small>

                                        <p>
                                            6 personas
                                        </p>

                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaMapMarkerAlt />

                                    <div>

                                        <small>
                                            Ubicación
                                        </small>

                                        <p>
                                            Salón Principal
                                        </p>

                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaUserTie />

                                    <div>

                                        <small>
                                            Mesero Asignado
                                        </small>

                                        <p>
                                            Juan Pérez
                                        </p>

                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaClock />

                                    <div>

                                        <small>
                                            Tiempo en uso
                                        </small>

                                        <p>
                                            1h 35m
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                        {/* ORDER */}
                        <div className="current-order">

                            <h4>
                                Pedido Actual
                            </h4>

                            <div className="order-product">

                                <img
                                    src="/plato1.jpeg"
                                    alt=""
                                />

                                <div>

                                    <p>
                                        Costillas Premium
                                    </p>

                                    <small>
                                        x2
                                    </small>

                                </div>

                                <strong>
                                    Q330
                                </strong>

                            </div>

                            <div className="order-product">

                                <img
                                    src="/plato2.jpeg"
                                    alt=""
                                />

                                <div>

                                    <p>
                                        Vino Reserva
                                    </p>

                                    <small>
                                        x1
                                    </small>

                                </div>

                                <strong>
                                    Q180
                                </strong>

                            </div>

                            <div className="totals">

                                <div>
                                    <span>Subtotal</span>
                                    <strong>Q510</strong>
                                </div>

                                <div>
                                    <span>IVA</span>
                                    <strong>Q61</strong>
                                </div>

                                <div className="total-final">
                                    <span>Total</span>
                                    <strong>Q571</strong>
                                </div>

                            </div>

                        </div>

                        {/* BUTTONS */}
                        <div className="detail-buttons">

                            <button className="gold-btn">

                                <FaShoppingCart />

                                Ver Pedido

                            </button>

                            <button className="dark-btn">
                                Liberar Mesa
                            </button>

                            <button className="danger-btn">
                                Cerrar Mesa
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

        </div>

    );

};
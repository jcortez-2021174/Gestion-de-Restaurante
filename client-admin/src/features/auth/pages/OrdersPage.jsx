import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/orders.css";

export const OrdersPage = () => {

    const ordersData = [

        {
            id: "#AUREA1023",
            client: "Carlos Cortez",
            phone: "5555 1234",
            type: "Domicilio",
            address: "6a Avenida 12-34, Zona 10",
            status: "Nuevo",
            hour: "19:15",
            total: "Q320.00",
            image: "/plato1.jpeg"
        },

        {
            id: "#AUREA1022",
            client: "Ana López",
            phone: "5555 5678",
            type: "Domicilio",
            address: "Vista Hermosa III",
            status: "En Preparación",
            hour: "19:05",
            total: "Q285.00",
            image: "/plato2.jpeg"
        },

        {
            id: "#AUREA1021",
            client: "Luis Ramírez",
            phone: "5555 8765",
            type: "Para Llevar",
            address: "Recoger en restaurante",
            status: "En Camino",
            hour: "18:50",
            total: "Q140.00",
            image: "/plato3.jpeg"
        }

    ];

    const [selectedOrder, setSelectedOrder] = useState(ordersData[0]);

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

                        <h1>Bienvenido a Aurea</h1>

                        <p>
                            Gestión de pedidos en tiempo real.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">3</span>

                        </div>

                        <div className="divider"></div>

                        <div className="user">

                            <i className="ri-user-line"></i>

                            <div className="user-info">

                                <span>Administrador</span>

                                <small>
                                    admin@aurea.com
                                </small>

                            </div>

                        </div>

                    </div>

                </div>

                {/* LAYOUT */}
                <section className="orders-layout">

                    {/* LEFT */}
                    <div className="orders-content card">

                        <div className="orders-top">

                            <div className="tabs">

                                <button className="active">
                                    Todos
                                </button>

                                <button>
                                    Pendientes
                                </button>

                                <button>
                                    En Preparación
                                </button>

                                <button>
                                    En Camino
                                </button>

                                <button>
                                    Entregados
                                </button>

                            </div>

                            <div className="top-actions">

                                <button className="btn-outline">
                                    <i className="ri-refresh-line"></i>
                                    Actualizar
                                </button>

                                <input
                                    type="text"
                                    placeholder="Buscar pedido..."
                                />

                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="orders-table">

                            {
                                ordersData.map((order, index) => (

                                    <div
                                        className="order-row"
                                        key={index}
                                        onClick={() =>
                                            setSelectedOrder(order)
                                        }
                                    >

                                        <div className="order-id">

                                            <h4>
                                                {order.id}
                                            </h4>

                                            <span>
                                                24/05/2025
                                            </span>

                                        </div>

                                        <div className="order-client">

                                            <h4>
                                                {order.client}
                                            </h4>

                                            <span>
                                                {order.phone}
                                            </span>

                                        </div>

                                        <div className="order-type">

                                            <h4>
                                                {order.type}
                                            </h4>

                                            <span>
                                                {order.address}
                                            </span>

                                        </div>

                                        <div className={`status ${order.status}`}>

                                            {order.status}

                                        </div>

                                        <div className="order-hour">
                                            {order.hour}
                                        </div>

                                        <div className="order-total">
                                            {order.total}
                                        </div>

                                        <button className="btn-view">
                                            Ver
                                        </button>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                    {/* RIGHT */}
                    <aside className="order-details card">

                        <h2>
                            DETALLE DEL PEDIDO
                        </h2>

                        <div className="detail-top">

                            <span className="badge-new">
                                Nuevo
                            </span>

                            <h3>
                                {selectedOrder.id}
                            </h3>

                        </div>

                        <div className="detail-box">

                            <p>
                                <strong>Cliente:</strong>
                                <br />
                                {selectedOrder.client}
                            </p>

                            <p>
                                <strong>Teléfono:</strong>
                                <br />
                                {selectedOrder.phone}
                            </p>

                            <p>
                                <strong>Tipo:</strong>
                                <br />
                                {selectedOrder.type}
                            </p>

                            <p>
                                <strong>Dirección:</strong>
                                <br />
                                {selectedOrder.address}
                            </p>

                        </div>

                        <div className="products-list">

                            <div className="product-item">

                                <img
                                    src={selectedOrder.image}
                                    alt=""
                                />

                                <div>

                                    <h4>
                                        Costillas de Cordero
                                    </h4>

                                    <span>
                                        x1
                                    </span>

                                </div>

                                <strong>
                                    Q165.00
                                </strong>

                            </div>

                        </div>

                        <div className="totals">

                            <div>
                                <span>Subtotal</span>
                                <strong>Q425.00</strong>
                            </div>

                            <div>
                                <span>Envío</span>
                                <strong>Q15.00</strong>
                            </div>

                            <div className="total-final">
                                <span>Total</span>
                                <strong>Q440.00</strong>
                            </div>

                        </div>

                        <div className="actions">

                            <button className="btn-success">
                                Aceptar Pedido
                            </button>

                            <button className="btn-gold">
                                Iniciar Preparación
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

        </div>

    );
};
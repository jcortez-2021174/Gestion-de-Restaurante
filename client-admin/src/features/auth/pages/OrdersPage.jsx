import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import {
    useOrders
} from "../../../context/OrdersContext";

import "../styles/orders.css";

export const OrdersPage = () => {

    const {

        orders,

        updateOrderStatus,

        deleteOrder,

        rejectOrder

    } = useOrders();

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    useEffect(() => {

        if(
            orders.length > 0 &&
            !selectedOrder
        ){

            setSelectedOrder(
                orders[0]
            );
        }

    }, [orders]);

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

                            <span className="badge">

                                {
                                    orders.filter(
                                        (o) =>
                                            o.status !==
                                            "Entregado"
                                    ).length
                                }

                            </span>

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

                    <img
                        src="/vino.jpg"
                        alt=""
                    />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">

                        <i className="ri-restaurant-2-line"></i>

                    </div>

                    <p>

                        Cada pedido refleja
                        <br />
                        excelencia y detalle.

                    </p>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main">

                <div className="header">

                    <div>

                        <h1>
                            Bienvenido a Aurea
                        </h1>

                        <p>
                            Gestión de pedidos en tiempo real.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">

                                {
                                    orders.filter(
                                        (o) =>
                                            o.status !==
                                            "Entregado"
                                    ).length
                                }

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

                                <button className="btn-outline-small">

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
                                orders.length === 0 ? (

                                    <div
                                        className="empty-orders"
                                    >

                                        No hay pedidos.

                                    </div>

                                ) : (

                                    orders.map((order, index) => (

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
                                                    {
                                                        order.createdAt
                                                    }
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
                                )
                            }

                        </div>

                    </div>

                    {/* RIGHT */}
                    <aside className="order-details card">

                        {
                            selectedOrder ? (

                                <>

                                    <h2>
                                        DETALLE DEL PEDIDO
                                    </h2>

                                    <div className="detail-top">

                                        <span className="badge-new">

                                            {
                                                selectedOrder.status
                                            }

                                        </span>

                                        <h3>
                                            {
                                                selectedOrder.id
                                            }
                                        </h3>

                                    </div>

                                    <div className="detail-box">

                                        <p>

                                            <strong>
                                                Cliente:
                                            </strong>

                                            <br />

                                            {
                                                selectedOrder.client
                                            }

                                        </p>

                                        <p>

                                            <strong>
                                                Teléfono:
                                            </strong>

                                            <br />

                                            {
                                                selectedOrder.phone
                                            }

                                        </p>

                                        <p>

                                            <strong>
                                                Tipo:
                                            </strong>

                                            <br />

                                            {
                                                selectedOrder.type
                                            }

                                        </p>

                                        <p>

                                            <strong>
                                                Dirección:
                                            </strong>

                                            <br />

                                            {
                                                selectedOrder.address
                                            }

                                        </p>

                                    </div>

                                    <div className="products-list">

                                        {
                                            selectedOrder.products?.map(

                                                (
                                                    product,
                                                    index
                                                ) => (

                                                    <div
                                                        className="product-item"
                                                        key={index}
                                                    >

                                                        <img
                                                            src={product.imagen}
                                                            alt=""
                                                        />

                                                        <div>

                                                            <h4>
                                                                {
                                                                    product.nombre
                                                                }
                                                            </h4>

                                                            <span>

                                                                x{
                                                                    product.cantidad
                                                                }

                                                            </span>

                                                        </div>

                                                        <strong>

                                                            Q{
                                                                (
                                                                    product.precio *
                                                                    product.cantidad
                                                                ).toFixed(2)
                                                            }

                                                        </strong>

                                                    </div>
                                                )
                                            )
                                        }

                                    </div>

                                    <div className="totals">

                                        <div className="total-final">

                                            <span>
                                                Total
                                            </span>

                                            <strong>
                                                {
                                                    selectedOrder.total
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                    {/* ACTIONS */}
                                    <div className="actions">

                                        {
                                            selectedOrder.status ===
                                            "Nuevo" && (

                                                <>

                                                    <button
                                                        className="btn-success"
                                                        onClick={() => {

                                                            updateOrderStatus(
                                                                selectedOrder.id,
                                                                "En Preparación"
                                                            );

                                                            setSelectedOrder({

                                                                ...selectedOrder,

                                                                status:
                                                                    "En Preparación"

                                                            });

                                                        }}
                                                    >

                                                        Aceptar Pedido

                                                    </button>

                                                    <button
                                                        className="btn-danger"
                                                        onClick={() => {

                                                            rejectOrder(
                                                                selectedOrder.id
                                                            );

                                                            setSelectedOrder(
                                                                null
                                                            );

                                                        }}
                                                    >

                                                        Rechazar Pedido

                                                    </button>

                                                </>

                                            )
                                        }

                                        {
                                            selectedOrder.status ===
                                            "En Preparación" && (

                                                <button
                                                    className="btn-gold"
                                                    onClick={() => {

                                                        updateOrderStatus(
                                                            selectedOrder.id,
                                                            "En Camino"
                                                        );

                                                        setSelectedOrder({

                                                            ...selectedOrder,

                                                            status:
                                                                "En Camino"

                                                        });

                                                    }}
                                                >

                                                    Enviar Pedido

                                                </button>

                                            )
                                        }

                                        {
                                            selectedOrder.status ===
                                            "En Camino" && (

                                                <button
                                                    className="btn-outline-action"
                                                    onClick={() => {

                                                        updateOrderStatus(
                                                            selectedOrder.id,
                                                            "Entregado"
                                                        );

                                                        setSelectedOrder({

                                                            ...selectedOrder,

                                                            status:
                                                                "Entregado"

                                                        });

                                                    }}
                                                >

                                                    Marcar Entregado

                                                </button>

                                            )
                                        }

                                        {
                                            selectedOrder.status ===
                                            "Entregado" && (

                                                <button
                                                    className="btn-danger"
                                                    onClick={() => {

                                                        deleteOrder(
                                                            selectedOrder.id
                                                        );

                                                        setSelectedOrder(
                                                            null
                                                        );

                                                    }}
                                                >

                                                    Eliminar Pedido

                                                </button>

                                            )
                                        }

                                    </div>

                                </>

                            ) : (

                                <div
                                    className="empty-orders"
                                >

                                    Selecciona un pedido.

                                </div>

                            )
                        }

                    </aside>

                </section>

            </main>

        </div>

    );
};
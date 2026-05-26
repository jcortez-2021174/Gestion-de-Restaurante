import "../styles/reports.css";
import { Link } from "react-router-dom";

export const ReportsPage = () => {

    const metrics = [
        {
            title: "Ventas Totales",
            value: "Q44,580.00",
            growth: "+16%"
        },
        {
            title: "Pedidos Completados",
            value: "128",
            growth: "+11%"
        },
        {
            title: "Reservas Confirmadas",
            value: "56",
            growth: "+8%"
        },
        {
            title: "Clientes Atendidos",
            value: "342",
            growth: "+13%"
        }
    ];

    const products = [
        {
            image: "/plato1.jpeg",
            name: "Costillas de Cordero",
            category: "Plato Fuerte",
            sales: 48,
            income: "Q7,490.00"
        },
        {
            image: "/plato2.jpeg",
            name: "Cordero al Horno",
            category: "Especialidad",
            sales: 36,
            income: "Q5,100.00"
        },
        {
            image: "/plato3.jpeg",
            name: "Brochetas Gourmet",
            category: "Premium",
            sales: 30,
            income: "Q3,850.00"
        }
    ];

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

                    <Link to="/reports" className="menu-link active-link">
                        <li>
                            <i className="ri-bar-chart-box-line"></i>
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

                    <img src="/vino.jpg" alt="vino" />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">
                        <i className="ri-line-chart-line"></i>
                    </div>

                    <p>
                        Analiza cada detalle
                        <br />
                        y optimiza el negocio.
                    </p>

                </div>

            </aside>

            {/* MAIN */}
            <main className="main">

                {/* HEADER */}
                <div className="header">

                    <div>

                        <h2>
                            Reportes y Estadísticas
                        </h2>

                        <p>
                            Información estratégica y rendimiento del restaurante.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">
                                3
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

                {/* REPORTS */}
                <div className="reports-layout">

                    {/* LEFT */}
                    <div className="reports-content">

                        {/* TOP */}
                        <div className="reports-top">

                            <div>

                                <h3 className="section-title">

                                    <i className="ri-bar-chart-grouped-line"></i>

                                    Reportes Generales

                                </h3>

                                <div className="tabs">

                                    <button className="active">
                                        General
                                    </button>

                                    <button>
                                        Ventas
                                    </button>

                                    <button>
                                        Pedidos
                                    </button>

                                    <button>
                                        Reservas
                                    </button>

                                    <button>
                                        Clientes
                                    </button>

                                </div>

                            </div>

                            <div className="top-actions">

                                <input type="date" />

                                <button className="btn-export">

                                    <i className="ri-file-download-line"></i>

                                    Exportar Reporte

                                </button>

                            </div>

                        </div>

                        {/* METRICS */}
                        <div className="stats-grid">

                            {
                                metrics.map((metric, index) => (

                                    <div
                                        className="stat-card"
                                        key={index}
                                    >

                                        <span>
                                            {metric.title}
                                        </span>

                                        <h2>
                                            {metric.value}
                                        </h2>

                                        <p>
                                            {metric.growth} este mes
                                        </p>

                                    </div>

                                ))
                            }

                        </div>

                        {/* CHART */}
                        <div className="chart-box">

                            <div className="chart-header">

                                <h3>
                                    Rendimiento Semanal
                                </h3>

                                <button className="btn-mini">
                                    Últimos 7 días
                                </button>

                            </div>

                            <div className="chart-placeholder">

                                <div className="chart-line"></div>

                            </div>

                        </div>

                        {/* PRODUCTS */}
                        <div className="products-section">

                            <div className="section-header">

                                <h3>
                                    Productos Más Vendidos
                                </h3>

                            </div>

                            <div className="products-table">

                                {
                                    products.map((product, index) => (

                                        <div
                                            className="product-row"
                                            key={index}
                                        >

                                            <div className="product-info">

                                                <img
                                                    src={product.image}
                                                    alt=""
                                                />

                                                <div>

                                                    <h4>
                                                        {product.name}
                                                    </h4>

                                                    <span>
                                                        {product.category}
                                                    </span>

                                                </div>

                                            </div>

                                            <span>
                                                {product.sales} ventas
                                            </span>

                                            <strong>
                                                {product.income}
                                            </strong>

                                        </div>

                                    ))
                                }

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}
                    <div className="reports-sidebar">

                        {/* FINANCIAL */}
                        <div className="summary-box">

                            <h3>
                                Resumen Financiero
                            </h3>

                            <div className="summary-item">

                                <span>
                                    Ventas
                                </span>

                                <strong>
                                    Q44,580.00
                                </strong>

                            </div>

                            <div className="summary-item">

                                <span>
                                    Impuestos
                                </span>

                                <strong>
                                    Q5,349.60
                                </strong>

                            </div>

                            <div className="summary-item">

                                <span>
                                    Propinas
                                </span>

                                <strong>
                                    Q3,125.00
                                </strong>

                            </div>

                            <div className="summary-total">

                                <span>
                                    Total Neto
                                </span>

                                <h2>
                                    Q42,355.40
                                </h2>

                            </div>

                        </div>

                        {/* STATUS */}
                        <div className="summary-box">

                            <h3>
                                Pedidos por Estado
                            </h3>

                            <div className="status-item">

                                <span className="status-label">

                                    <i className="ri-checkbox-circle-fill completed"></i>

                                    Completados

                                </span>

                                <strong>
                                    128
                                </strong>

                            </div>

                            <div className="status-item">

                                <span className="status-label">

                                    <i className="ri-time-fill preparing"></i>

                                    En Preparación

                                </span>

                                <strong>
                                    32
                                </strong>

                            </div>

                            <div className="status-item">

                                <span className="status-label">

                                    <i className="ri-truck-fill delivery"></i>

                                    En Camino

                                </span>

                                <strong>
                                    20
                                </strong>

                            </div>

                            <div className="status-item">

                                <span className="status-label">

                                    <i className="ri-close-circle-fill cancelled"></i>

                                    Cancelados

                                </span>

                                <strong>
                                    8
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </main>

        </div>

    );

};
import { Link } from "react-router-dom";
import "../styles/reservations.css";

export const ReservationsPage = () => {

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
                        <li className="active">
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

            {/* MAIN */}
            <main className="main">

                {/* HEADER */}
                <div className="header">

                    <div>

                        <h2>Reservaciones</h2>

                        <p>
                            Gestión de reservaciones en tiempo real.
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

                                <span>Administrador</span>

                                <small>
                                    admin@aurea.com
                                </small>

                            </div>

                            <i className="ri-arrow-down-s-line"></i>

                        </div>

                    </div>

                </div>

                {/* CONTENT */}
                <div className="reservations-layout">

                    {/* LEFT */}
                    <section className="reservations-table">

                        <div className="section-header">

                            <h2>

                                <i className="ri-calendar-check-line"></i>

                                RESERVACIONES

                            </h2>

                            <button className="new-btn">

                                <i className="ri-add-line"></i>

                                Nueva Reserva

                            </button>

                        </div>

                        {/* FILTERS */}
                        <div className="filters">

                            <div className="tabs">

                                <button className="active">
                                    Todas
                                </button>

                                <button>Hoy</button>

                                <button>Mañana</button>

                                <button>Esta Semana</button>

                                <button>Confirmadas</button>

                                <button>Canceladas</button>

                            </div>

                            <div className="search-box">

                                <input
                                    type="text"
                                    placeholder="Buscar reserva..."
                                />

                                <i className="ri-search-line"></i>

                            </div>

                        </div>

                        {/* TABLE HEADER */}
                        <div className="table-header">

                            <span>ID</span>
                            <span>Cliente</span>
                            <span>Fecha</span>
                            <span>Hora</span>
                            <span>Personas</span>
                            <span>Mesa</span>
                            <span>Estado</span>
                            <span>Acciones</span>

                        </div>

                        {/* ROW 1 */}
                        <div className="reservation-row active-row">

                            <span>#RES1001</span>

                            <div>

                                <h4>Carlos Cortez</h4>

                                <small>5555 1234</small>

                            </div>

                            <span>24/05/2025</span>

                            <span>19:00</span>

                            <span>4</span>

                            <span>Mesa #5</span>

                            <span className="status confirmed">
                                Confirmada
                            </span>

                            <div className="actions">

                                <button>
                                    Ver
                                </button>

                                <button>
                                    <i className="ri-more-2-fill"></i>
                                </button>

                            </div>

                        </div>

                        {/* ROW 2 */}
                        <div className="reservation-row">

                            <span>#RES1002</span>

                            <div>

                                <h4>Ana López</h4>

                                <small>5555 5678</small>

                            </div>

                            <span>24/05/2025</span>

                            <span>20:00</span>

                            <span>2</span>

                            <span>Mesa #8</span>

                            <span className="status confirmed">
                                Confirmada
                            </span>

                            <div className="actions">

                                <button>
                                    Ver
                                </button>

                                <button>
                                    <i className="ri-more-2-fill"></i>
                                </button>

                            </div>

                        </div>

                        {/* ROW 3 */}
                        <div className="reservation-row">

                            <span>#RES1003</span>

                            <div>

                                <h4>Luis Ramírez</h4>

                                <small>5555 8765</small>

                            </div>

                            <span>25/05/2025</span>

                            <span>18:30</span>

                            <span>6</span>

                            <span>Mesa #12</span>

                            <span className="status pending">
                                Pendiente
                            </span>

                            <div className="actions">

                                <button>
                                    Ver
                                </button>

                                <button>
                                    <i className="ri-more-2-fill"></i>
                                </button>

                            </div>

                        </div>

                    </section>

                    {/* RIGHT */}
                    <aside className="details-card">

                        <h2>

                            <i className="ri-file-list-3-line"></i>

                            DETALLE

                        </h2>

                        <div className="badge-status">
                            Confirmada
                        </div>

                        <h3>#RES1001</h3>

                        <p className="reservation-date">
                            Reserva realizada el 22/05/2025
                        </p>

                        <div className="detail-item">

                            <i className="ri-user-line"></i>

                            <div>

                                <small>Cliente</small>

                                <p>Carlos Cortez</p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-calendar-line"></i>

                            <div>

                                <small>Fecha</small>

                                <p>24 Mayo 2025</p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-time-line"></i>

                            <div>

                                <small>Hora</small>

                                <p>19:00 PM</p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-group-line"></i>

                            <div>

                                <small>Personas</small>

                                <p>4 Personas</p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-table-line"></i>

                            <div>

                                <small>Mesa</small>

                                <p>Mesa #5</p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-message-2-line"></i>

                            <div>

                                <small>Notas</small>

                                <p>
                                    Celebración de aniversario.
                                </p>

                            </div>

                        </div>

                        <div className="detail-buttons">

                            <button className="edit-btn">
                                Editar Reserva
                            </button>

                            <button className="cancel-btn">
                                Cancelar Reserva
                            </button>

                            <button className="reminder-btn">
                                Enviar Recordatorio
                            </button>

                        </div>

                    </aside>

                </div>

            </main>

        </div>

    );

};
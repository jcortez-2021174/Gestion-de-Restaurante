import { useEffect, useMemo, useState } from "react";
import { obtenerDashboard } from "../../../services/clientes.service";
import { Link } from "react-router-dom";

import "../styles/clients.css";

export const ClientsPage = () => {

    const [clientsData, setClientsData] = useState([]);

    const [selectedClient, setSelectedClient] = useState(null);

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    /* =========================================
       GET CLIENTS
    ========================================= */

    useEffect(() => {

        getClientsDashboard();

    }, []);

    const getClientsDashboard = async () => {
        try {
            const response = await obtenerDashboard();
            // Handle both response formats: { data: [...] } or direct array
            const clients = response.data || response.clientes || response || [];
            setClientsData(clients);

            if (clients.length > 0) {
                setSelectedClient(clients[0]);
            }
        } catch (error) {
            console.error('Error loading clients:', error);
        } finally {
            setLoading(false);
        }
    };
    /* =========================================
       SEARCH
    ========================================= */

    const filteredClients = useMemo(() => {

        return clientsData.filter((client) =>

            client.name
                ?.toLowerCase()
                .includes(
                    search.toLowerCase()
                )

        );

    }, [search, clientsData]);

    return (

        <div className="container">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo-box">

                    <img
                        src="/logo.png"
                        alt=""
                    />

                </div>

                <ul className="menu">

                    <Link
                        to="/dashboard"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-home-5-line"></i>

                            Inicio

                        </li>

                    </Link>

                    <Link
                        to="/menu"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-restaurant-line"></i>

                            Menú

                        </li>

                    </Link>

                    <Link
                        to="/orders"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-shopping-cart-line"></i>

                            Pedidos

                        </li>

                    </Link>

                    <Link
                        to="/reservations"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-calendar-line"></i>

                            Reservas

                        </li>

                    </Link>

                    <Link
                        to="/tables"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-table-line"></i>

                            Mesas

                        </li>

                    </Link>

                    <Link
                        to="/clients"
                        className="menu-link"
                    >

                        <li className="active">

                            <i className="ri-user-line"></i>

                            Clientes

                        </li>

                    </Link>

                    <Link
                        to="/reports"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-bar-chart-line"></i>

                            Reportes

                        </li>

                    </Link>

                    <Link
                        to="/settings"
                        className="menu-link"
                    >

                        <li>

                            <i className="ri-settings-3-line"></i>

                            Configuración

                        </li>

                    </Link>

                </ul>

                {/* SIDEBAR IMAGE */}

                <div className="sidebar-image">

                    <img
                        src="/vino.jpg"
                        alt=""
                    />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">

                        <i className="ri-user-heart-line"></i>

                    </div>

                    <p>

                        Nuestros clientes son
                        <br />
                        el corazón del restaurante.

                    </p>

                </div>

            </aside>

            {/* MAIN */}

            <main className="main">

                {/* HEADER */}

                <div className="header">

                    <div>

                        <h1>
                            Clientes
                        </h1>

                        <p>
                            Gestiona la actividad en tiempo real.
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
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>

                        <button className="btn-filter">

                            <i className="ri-filter-3-line"></i>

                        </button>

                    </div>

                </div>

                {/* CONTENT */}

                <section className="clients-layout">

                    {/* LEFT */}

                    <div className="clients-content card">

                        {loading ? (
                            <div className="loading-state">
                                <p>Cargando clientes...</p>
                            </div>
                        ) : (
                            <>
                        <div className="clients-table-header">

                            <span>
                                Cliente
                            </span>

                            <span>
                                Contacto
                            </span>

                            <span>
                                Plato Favorito
                            </span>

                            <span>
                                Última Visita
                            </span>

                            <span>
                                Acciones
                            </span>

                        </div>

                        <div className="clients-table">

                            {
                                filteredClients.map((client) => (

                                    <div
                                        className={`client-row ${
                                            selectedClient?._id === client._id
                                                ? "selected"
                                                : ""
                                        }`}
                                        key={client._id}
                                        onClick={() =>
                                            setSelectedClient(client)
                                        }
                                    >

                                        {/* CLIENT */}

                                        <div className="client-info">

                                            <div className="client-avatar">

                                                {
                                                    client.initials
                                                }

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

                                        {/* CONTACT */}

                                        <div className="client-contact">

                                            <i className="ri-phone-line"></i>

                                            <span>
                                                {client.phone}
                                            </span>

                                        </div>

                                        {/* FAVORITE FOOD */}

                                        <div className="favorite-food">

                                            <img
                                                src={
                                                    client.favoriteImage ||
                                                    "/plato1.jpeg"
                                                }
                                                alt=""
                                            />

                                            <div>

                                                <small>
                                                    Favorito
                                                </small>

                                                <strong>
                                                    {
                                                        client.productoFavorito ||
                                                        "Sin datos"
                                                    }
                                                </strong>

                                            </div>

                                        </div>

                                        {/* VISIT */}

                                        <div className="client-visit">

                                            {
                                                client.ultimaVisita ||
                                                "Sin visitas"
                                            }

                                        </div>

                                        {/* ACTIONS */}

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

                            </>
                        )}

                    </div>

                    {/* RIGHT */}

                    <aside className="client-details card">

                        {
                            selectedClient && (

                                <>

                                    {/* PROFILE */}

                                    <div className="client-profile">

                                        <div className="profile-avatar">

                                            {
                                                selectedClient.initials
                                            }

                                        </div>

                                        <div>

                                            <h2>

                                                {
                                                    selectedClient.name
                                                }

                                            </h2>

                                            <span className="vip-badge">

                                                {
                                                    selectedClient.totalPedidos >= 10
                                                        ? "Cliente Frecuente"
                                                        : "Cliente"
                                                }

                                            </span>

                                            <p>

                                                {
                                                    selectedClient.email
                                                }

                                            </p>

                                            <p>

                                                {
                                                    selectedClient.phone
                                                }

                                            </p>

                                        </div>

                                    </div>

                                    {/* FAVORITE FOOD */}

                                    <div className="favorite-food-card">

                                        <img
                                            src={
                                                selectedClient.favoriteImage ||
                                                "/plato1.jpeg"
                                            }
                                            alt=""
                                        />

                                        <div>

                                            <small>
                                                Plato Favorito
                                            </small>

                                            <h3>

                                                {
                                                    selectedClient.productoFavorito ||
                                                    "Sin datos"
                                                }

                                            </h3>

                                            <p>

                                                Pedido más frecuente
                                                del cliente.

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

                                            <span>
                                                Registro:
                                            </span>

                                            <strong>

                                                {
                                                    selectedClient.fechaRegistro ||
                                                    "No disponible"
                                                }

                                            </strong>

                                        </div>

                                        <div className="detail-item">

                                            <i className="ri-map-pin-line"></i>

                                            <span>
                                                Dirección:
                                            </span>

                                            <strong>

                                                {
                                                    selectedClient.direccion ||
                                                    "No disponible"
                                                }

                                            </strong>

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

                                                    <span>
                                                        Compras
                                                    </span>

                                                    <strong>

                                                        Q{
                                                            selectedClient.totalCompras ||
                                                            0
                                                        }

                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="stat-box">

                                                <i className="ri-shopping-bag-line"></i>

                                                <div>

                                                    <span>
                                                        Pedidos
                                                    </span>

                                                    <strong>

                                                        {
                                                            selectedClient.totalPedidos ||
                                                            0
                                                        }

                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="stat-box">

                                                <i className="ri-restaurant-line"></i>

                                                <div>

                                                    <span>
                                                        Favorito
                                                    </span>

                                                    <strong>

                                                        {
                                                            selectedClient.productoFavorito ||
                                                            "-"
                                                        }

                                                    </strong>

                                                </div>

                                            </div>

                                            <div className="stat-box">

                                                <i className="ri-time-line"></i>

                                                <div>

                                                    <span>
                                                        Última Visita
                                                    </span>

                                                    <strong>

                                                        {
                                                            selectedClient.ultimaVisita ||
                                                            "-"
                                                        }

                                                    </strong>

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

                                            {
                                                selectedClient.historial?.length > 0
                                                    ? (

                                                        selectedClient.historial.map(
                                                            (pedido, index) => (

                                                                <div
                                                                    className="history-item"
                                                                    key={index}
                                                                >

                                                                    <div>

                                                                        <h4>

                                                                            Pedido #
                                                                            {
                                                                                pedido.codigo
                                                                            }

                                                                        </h4>

                                                                        <span>

                                                                            {
                                                                                pedido.fecha
                                                                            }

                                                                        </span>

                                                                    </div>

                                                                    <strong>

                                                                        Q{
                                                                            pedido.total
                                                                        }

                                                                    </strong>

                                                                </div>

                                                            )
                                                        )

                                                    )
                                                    : (

                                                        <div className="empty-history">

                                                            No hay historial reciente.

                                                        </div>

                                                    )
                                            }

                                        </div>

                                        <button className="btn-gold full">

                                            Ver historial completo

                                        </button>

                                    </div>

                                </>

                            )
                        }

                    </aside>

                </section>

            </main>

        </div>

    );

};
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ReceiptPrint from "../components/ReceiptPrint";

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

    const initialTables = [

        {
            id: 1,
            zone: "Terraza",
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 2,
            zone: "Terraza",
            status: "available",
            type: "round",
            people: "2 Pers."
        },

        {
            id: 3,
            zone: "Terraza",
            status: "reserved",
            type: "square",
            people: "4 Pers.",
            time: "19:00"
        },

        {
            id: 4,
            zone: "Terraza",
            status: "occupied",
            type: "round",
            people: "6 Pers."
        },

        {
            id: 5,
            zone: "Terraza",
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 6,
            zone: "Terraza",
            status: "cleaning",
            type: "square",
            people: "4 Pers.",
            label: "Limpieza"
        },

        {
            id: 7,
            zone: "Salón Principal",
            status: "occupied",
            type: "round",
            people: "4 Pers."
        },

        {
            id: 8,
            zone: "Salón Principal",
            status: "occupied",
            type: "square",
            people: "2 Pers."
        },

        {
            id: 9,
            zone: "Salón Principal",
            status: "available",
            type: "round",
            people: "2 Pers."
        },

        {
            id: 10,
            zone: "Salón Principal",
            status: "occupied",
            type: "rect",
            people: "6 Pers."
        },

        {
            id: 11,
            zone: "Salón Principal",
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 12,
            zone: "Salón Principal",
            status: "reserved",
            type: "square",
            people: "4 Pers.",
            time: "20:00"
        },

        {
            id: 13,
            zone: "Salón Principal",
            status: "available",
            type: "square",
            people: "4 Pers."
        },

        {
            id: 14,
            zone: "Salón Principal",
            status: "cleaning",
            type: "square",
            people: "4 Pers.",
            label: "Limpieza"
        },

        {
            id: 15,
            zone: "Salón Principal",
            status: "occupied",
            type: "round",
            people: "4 Pers."
        },

        {
            id: 16,
            zone: "Salón Principal",
            status: "available",
            type: "square",
            people: "2 Pers."
        }

    ];

    const [tables, setTables] = useState(initialTables);

    const [selectedTable, setSelectedTable] = useState(initialTables[9]);

    const [activeFilter, setActiveFilter] = useState("Todas");

    const [search, setSearch] = useState("");

    const [showOrderModal, setShowOrderModal] = useState(false);

    const filteredTables = useMemo(() => {

        return tables.filter((table) => {

            const matchesSearch =
                `Mesa ${table.id}`
                    .toLowerCase()
                    .includes(search.toLowerCase());

            if (activeFilter === "Todas") {
                return matchesSearch;
            }

            if (activeFilter === "Disponibles") {
                return matchesSearch && table.status === "available";
            }

            if (activeFilter === "Ocupadas") {
                return matchesSearch && table.status === "occupied";
            }

            if (activeFilter === "Reservadas") {
                return matchesSearch && table.status === "reserved";
            }

            if (activeFilter === "Limpieza") {
                return matchesSearch && table.status === "cleaning";
            }

            return matchesSearch;

        });

    }, [tables, activeFilter, search]);

    const availableCount =
        tables.filter(t => t.status === "available").length;

    const occupiedCount =
        tables.filter(t => t.status === "occupied").length;

    const reservedCount =
        tables.filter(t => t.status === "reserved").length;

    const cleaningCount =
        tables.filter(t => t.status === "cleaning").length;

    const createTable = () => {

        const newTable = {

            id: tables.length + 1,
            zone: "Salón Principal",
            status: "available",
            type: "square",
            people: "4 Pers."

        };

        setTables([...tables, newTable]);

    };

    const freeTable = () => {

        const updated = tables.map((table) =>

            table.id === selectedTable.id

                ? {
                    ...table,
                    status: "available"
                }

                : table

        );

        setTables(updated);

        setSelectedTable({
            ...selectedTable,
            status: "available"
        });

    };

    const closeTable = () => {

        const updated = tables.filter(
            table => table.id !== selectedTable.id
        );

        setTables(updated);

        if (updated.length > 0) {
            setSelectedTable(updated[0]);
        }

    };

    const renderTable = (table) => (

        <div
            key={table.id}
            className={`table-card ${table.status} ${table.type} ${selectedTable.id === table.id ? "active-table" : ""}`}
            onClick={() => setSelectedTable(table)}
        >

            <div className="table-glow"></div>

            <span className="chair top"></span>
            <span className="chair bottom"></span>
            <span className="chair left"></span>
            <span className="chair right"></span>

            <div className="table-number">
                Mesa {table.id}
            </div>

            <div className="table-capacity">

                <FaUsers />

                <span>
                    {table.people}
                </span>

            </div>

            {
                table.time &&

                <div className="table-time">

                    <FaClock />

                    <span>
                        {table.time}
                    </span>

                </div>
            }

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

            <aside className="sidebar">

                <div className="logo-box">
                    <img src="/logo.png" alt="" />
                </div>

                <ul className="menu">

                    <Link to="/dashboard" className="menu-link">
                        <li><i className="ri-home-5-line"></i>Inicio</li>
                    </Link>

                    <Link to="/menu" className="menu-link">
                        <li><i className="ri-restaurant-line"></i>Menú</li>
                    </Link>

                    <Link to="/orders" className="menu-link">
                        <li><i className="ri-shopping-cart-line"></i>Pedidos</li>
                    </Link>

                    <Link to="/reservations" className="menu-link">
                        <li><i className="ri-calendar-line"></i>Reservas</li>
                    </Link>

                    <Link to="/tables" className="menu-link">
                        <li className="active">
                            <i className="ri-table-line"></i>Mesas
                        </li>
                    </Link>

                    <Link to="/clients" className="menu-link">
                        <li><i className="ri-user-line"></i>Clientes</li>
                    </Link>

                    <Link to="/reports" className="menu-link">
                        <li><i className="ri-bar-chart-line"></i>Reportes</li>
                    </Link>

                    <Link to="/settings" className="menu-link">
                        <li><i className="ri-settings-3-line"></i>Configuración</li>
                    </Link>

                </ul>

               <div className="sidebar-image">

    <img
        src="/vino.jpg"
        alt=""
    />

    <div className="overlay"></div>

    <div className="sidebar-decor">

        <i className="ri-goblet-line"></i>

    </div>

    <p>
        Elegancia y servicio premium.
    </p>

</div>

            </aside>

            <main className="main">

                <section className="tables-layout">

                    <div className="tables-content card">

                        <div className="tables-top">

                            <div className="tables-title">

                                <h2>
                                    <FaChair />
                                    Mesas
                                </h2>

                            </div>

                            <button
                                className="new-table-btn"
                                onClick={createTable}
                            >

                                <FaPlus />

                                Nueva Mesa

                            </button>

                        </div>

                        <div className="tables-filters">

                            <div className="tabs">

                                {
                                    [
                                        "Todas",
                                        "Disponibles",
                                        "Ocupadas",
                                        "Reservadas",
                                        "Limpieza"
                                    ].map((tab) => (

                                        <button
                                            key={tab}
                                            className={
                                                activeFilter === tab
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveFilter(tab)
                                            }
                                        >
                                            {tab}
                                        </button>

                                    ))
                                }

                            </div>

                            <div className="search-box">

                                <input
                                    type="text"
                                    placeholder="Buscar mesa..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                                <FaSearch />

                            </div>

                        </div>

                        <div className="tables-stats">

                            <div className="stat-card available">

                                <div className="stat-icon">
                                    <FaChair />
                                </div>

                                <div>
                                    <h3>{availableCount}</h3>
                                    <span>Disponibles</span>
                                </div>

                            </div>

                            <div className="stat-card occupied">

                                <div className="stat-icon">
                                    <FaUsers />
                                </div>

                                <div>
                                    <h3>{occupiedCount}</h3>
                                    <span>Ocupadas</span>
                                </div>

                            </div>

                            <div className="stat-card reserved">

                                <div className="stat-icon">
                                    <FaClock />
                                </div>

                                <div>
                                    <h3>{reservedCount}</h3>
                                    <span>Reservadas</span>
                                </div>

                            </div>

                            <div className="stat-card cleaning">

                                <div className="stat-icon">
                                    <FaLock />
                                </div>

                                <div>
                                    <h3>{cleaningCount}</h3>
                                    <span>Limpieza</span>
                                </div>

                            </div>

                        </div>

                        <div className="restaurant-map">

                            <div className="map-header">
                                <h3>Plano del Restaurante</h3>
                            </div>

                            {/* TERRAZA */}

                            <div className="zone">

                                <h4 className="zone-title">
                                    TERRAZA
                                </h4>

                                <div className="tables-grid">

                                    {
                                        filteredTables
                                            .filter(table =>
                                                table.zone === "Terraza"
                                            )
                                            .map(renderTable)
                                    }

                                </div>

                            </div>

                            {/* SALÓN */}

                            <div className="zone">

                                <h4 className="zone-title">
                                    SALÓN PRINCIPAL
                                </h4>

                                <div className="tables-grid">

                                    {
                                        filteredTables
                                            .filter(table =>
                                                table.zone === "Salón Principal"
                                            )
                                            .map(renderTable)
                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                    <aside className="table-details card">

                        <h2>
                            DETALLE DE MESA
                        </h2>

                        <div className="detail-card">

                            <h3>
                                Mesa {selectedTable.id}
                            </h3>

                            <span className={`badge ${selectedTable.status}`}>
                                {
                                    selectedTable.status === "available"
                                        ? "Disponible"
                                        : selectedTable.status === "occupied"
                                            ? "Ocupada"
                                            : selectedTable.status === "reserved"
                                                ? "Reservada"
                                                : "Limpieza"
                                }
                            </span>

                            <div className="detail-list">

                                <div className="detail-item">

                                    <FaUsers />

                                    <div>
                                        <small>Capacidad</small>
                                        <p>{selectedTable.people}</p>
                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaMapMarkerAlt />

                                    <div>
                                        <small>Ubicación</small>
                                        <p>{selectedTable.zone}</p>
                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaUserTie />

                                    <div>
                                        <small>Mesero Asignado</small>
                                        <p>Juan Pérez</p>
                                    </div>

                                </div>

                                <div className="detail-item">

                                    <FaClock />

                                    <div>
                                        <small>Tiempo en uso</small>
                                        <p>1h 35m</p>
                                    </div>

                                </div>

                            </div>

                        </div>

                        {
                            selectedTable.status === "occupied" && (

                                <div className="current-order">

                                    <h4>
                                        Pedido Actual
                                    </h4>

                              <div className="order-product">

    <div className="order-product-left">

        <img
            src="/plato1.jpeg"
            alt=""
        />

        <div className="order-product-info">

            <p>
                Costillas Premium
            </p>

            <small>x2</small>

        </div>

    </div>

    <strong>Q330</strong>

</div>

<div className="order-product">

    <div className="order-product-left">

        <img
            src="/plato2.jpeg"
            alt=""
        />

        <div className="order-product-info">

            <p>
                Vino Reserva
            </p>

            <small>x1</small>

        </div>

    </div>

    <strong>Q180</strong>

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

                            )
                        }

                        <div className="detail-buttons">

                            <button
                                className="gold-btn"
                                onClick={() =>
                                    setShowOrderModal(true)
                                }
                            >

                                <FaShoppingCart />

                                Ver Pedido

                            </button>

                            <button
                                className="dark-btn"
                                onClick={freeTable}
                            >
                                Liberar Mesa
                            </button>

                            <button
                                className="danger-btn"
                                onClick={closeTable}
                            >
                                Cerrar Mesa
                            </button>

                        </div>

                    </aside>

                </section>

            </main>

            {
                showOrderModal && (

                    <div
                        className="order-modal-overlay"
                        onClick={() =>
                            setShowOrderModal(false)
                        }
                    >

                        <div
                            className="order-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="order-modal-header">

                                <h2>
                                    Pedido Mesa {selectedTable.id}
                                </h2>

                                <button
                                    className="close-modal-btn"
                                    onClick={() =>
                                        setShowOrderModal(false)
                                    }
                                >
                                    ✕
                                </button>

                            </div>

                            <div className="order-modal-products">

                                <div className="modal-product">

                                    <img
                                        src="/plato1.jpeg"
                                        alt=""
                                    />

                                    <div>

                                        <h4>
                                            Costillas Premium
                                        </h4>

                                        <p>x2</p>

                                    </div>

                                    <strong>Q330</strong>

                                </div>

                                <div className="modal-product">

                                    <img
                                        src="/plato2.jpeg"
                                        alt=""
                                    />

                                    <div>

                                        <h4>
                                            Vino Reserva
                                        </h4>

                                        <p>x1</p>

                                    </div>

                                    <strong>Q180</strong>

                                </div>

                            </div>

                            <div className="modal-totals">

                                <div>

                                    <span>Subtotal</span>

                                    <strong>Q510</strong>

                                </div>

                                <div>

                                    <span>IVA</span>

                                    <strong>Q61</strong>

                                </div>

                                <div className="modal-total-final">

                                    <span>Total</span>

                                    <strong>Q571</strong>

                                </div>

                            </div>

                            <div className="modal-buttons">

    <button
        className="gold-btn"
        onClick={() => {

            const printContent =
                document.getElementById(
                    "receipt-print"
                ).innerHTML;

            const printWindow =
                window.open(
                    "",
                    "",
                    "width=900,height=700"
                );

            printWindow.document.write(`

                <html>

                    <head>

                        <title>
                            Recibo Aurea
                        </title>

                        <link
                            rel="stylesheet"
                            href="/receipt.css"
                        />

                    </head>

                    <body>

                        ${printContent}

                    </body>

                </html>

            `);

            printWindow.document.close();

            printWindow.focus();

            setTimeout(() => {

                printWindow.print();

            },500);

        }}
    >
        Imprimir Recibo
    </button>

    <button
        className="dark-btn"
        onClick={() => {

            const content =
                document.getElementById(
                    "receipt-print"
                ).outerHTML;

            const blob =
                new Blob(
                    [content],
                    {
                        type:"text/html"
                    }
                );

            const link =
                document.createElement("a");

            link.href =
                URL.createObjectURL(blob);

            link.download =
                `recibo-mesa-${selectedTable.id}.html`;

            link.click();

        }}
    >
        Exportar Recibo
    </button>

</div>

                        </div>

                    </div>

                )
            }

            <div style={{ display:"none" }}>

                {
                    selectedTable && (

                        <ReceiptPrint
                            selectedTable={selectedTable}
                        />

                    )
                }

            </div>

        </div>

    );

};
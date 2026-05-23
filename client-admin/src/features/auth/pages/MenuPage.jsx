import { useState } from "react";
import { Link } from "react-router-dom";

import "../styles/menu.css";

export const MenuPage = () => {

    // =========================
    // DATA
    // =========================
    const dishesData = [

        {
            name: "Costillas de Cordero",
            category: "Platos Fuertes",
            price: "Q165.00",
            status: "Disponible",
            image: "/plato1.jpeg",
            description: "Jugosas costillas premium perfectamente asadas."
        },

        {
            name: "Cheesecake",
            category: "Postres",
            price: "Q65.00",
            status: "No disponible",
            image: "/plato4.jpeg",
            description: "Suave cheesecake artesanal con frutos rojos."
        },

        {
            name: "Vino Tinto",
            category: "Bebidas",
            price: "Q180.00",
            status: "Disponible",
            image: "/vino.jpg",
            description: "Selección premium de la casa."
        },

        {
            name: "Brochetas",
            category: "Entradas",
            price: "Q140.00",
            status: "Disponible",
            image: "/plato3.jpeg",
            description: "Brochetas gourmet con toque cítrico."
        }

    ];

    // =========================
    // STATES
    // =========================
    const [activeCategory, setActiveCategory] = useState("Todas");

    const [selectedDish, setSelectedDish] = useState(dishesData[0]);

    const [search, setSearch] = useState("");

    // =========================
    // FILTERS
    // =========================
    const filteredDishes = dishesData.filter((dish) => {

        const matchesCategory =
            activeCategory === "Todas"
                ? true
                : dish.category === activeCategory;

        const matchesSearch =
            dish.name
                .toLowerCase()
                .includes(search.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (

        <div className="container">

            {/* =========================
                SIDEBAR
            ========================= */}
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

                    <Link to="/menu" className="menu-link active-link">
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

            {/* =========================
                MAIN
            ========================= */}
            <main className="main">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="header">

                    <div>

                        <span className="header-tag">
                            RESTAURANT MANAGER
                        </span>

                        <h1>
                            Gestión del Menú
                        </h1>

                        <p>
                            Administra los platos y categorías
                            en tiempo real.
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

                        </div>

                    </div>

                </div>

                {/* =========================
                    HERO
                ========================= */}
                <section className="hero-banner">

                    <img
                        src="/hero-menu.jpg"
                        alt=""
                        className="hero-image"
                    />

                    <div className="hero-overlay"></div>

                    <div className="hero-content">

                        <span className="hero-subtitle">
                            MENÚ PREMIUM
                        </span>

                        <h2>
                            El Arte del
                            <br />
                            Cordero
                        </h2>

                        <p>
                            Gestión moderna y elegante del
                            menú gastronómico.
                        </p>

                        <div className="hero-actions">

                            <button className="btn-gold">
                                Ver Categorías
                            </button>

                            <button className="btn-outline">
                                Agregar Plato
                            </button>

                        </div>

                    </div>

                </section>

                {/* =========================
                    STATS
                ========================= */}
                <div className="stats-grid">

                    <div className="stat-card">
                        <h2>28</h2>
                        <p>Platos Totales</p>
                    </div>

                    <div className="stat-card">
                        <h2>6</h2>
                        <p>Categorías</p>
                    </div>

                    <div className="stat-card">
                        <h2>22</h2>
                        <p>Disponibles</p>
                    </div>

                    <div className="stat-card danger">
                        <h2>3</h2>
                        <p>No Disponibles</p>
                    </div>

                </div>

                {/* =========================
                    FILTERS
                ========================= */}
                <div className="menu-top">

                    {/* TABS */}
                    <div className="tabs">

                        <button
                            className={
                                activeCategory === "Todas"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveCategory("Todas")
                            }
                        >
                            Todas
                        </button>

                        <button
                            className={
                                activeCategory === "Entradas"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveCategory("Entradas")
                            }
                        >
                            Entradas
                        </button>

                        <button
                            className={
                                activeCategory === "Platos Fuertes"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveCategory("Platos Fuertes")
                            }
                        >
                            Platos Fuertes
                        </button>

                        <button
                            className={
                                activeCategory === "Bebidas"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setActiveCategory("Bebidas")
                            }
                        >
                            Bebidas
                        </button>

                    </div>

                    {/* SEARCH */}
                    <div className="top-actions">

                        <input
                            type="text"
                            placeholder="Buscar plato..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>

                {/* =========================
                    CONTENT
                ========================= */}
                <section className="menu-layout">

                    {/* LEFT */}
                    <div className="menu-grid">

                        {
                            filteredDishes.map((dish, index) => (

                                <div
                                    className="dish-card"
                                    key={index}
                                    onClick={() =>
                                        setSelectedDish(dish)
                                    }
                                >

                                    <div className="dish-image-container">

                                        <img
                                            src={dish.image}
                                            alt=""
                                        />

                                        <span
                                            className={
                                                dish.status === "Disponible"
                                                    ? "status available"
                                                    : "status unavailable"
                                            }
                                        >
                                            {dish.status}
                                        </span>

                                    </div>

                                    <div className="dish-content">

                                        <div className="dish-top">

                                            <h3>
                                                {dish.name}
                                            </h3>

                                            <span className="price">
                                                {dish.price}
                                            </span>

                                        </div>

                                        <p>
                                            {dish.description}
                                        </p>

                                        <div className="dish-footer">

                                            <span className="category-tag">
                                                {dish.category}
                                            </span>

                                            <button className="btn-small">
                                                Ver Más
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))
                        }

                    </div>

                    {/* RIGHT PANEL */}
                    <aside className="dish-details">

                        <h2>
                            Detalle del Plato
                        </h2>

                        <img
                            src={selectedDish.image}
                            alt=""
                            className="dish-banner"
                        />

                        <div className="detail-content">

                            <span className="detail-category">
                                {selectedDish.category}
                            </span>

                            <h3>
                                {selectedDish.name}
                            </h3>

                            <p>
                                {selectedDish.description}
                            </p>

                            <div className="detail-price">
                                {selectedDish.price}
                            </div>

                            <div className="actions">

                                <button className="btn-gold">
                                    Editar Plato
                                </button>

                                <button className="btn-danger">
                                    Eliminar
                                </button>

                            </div>

                        </div>

                    </aside>

                </section>

            </main>

        </div>

    );
};
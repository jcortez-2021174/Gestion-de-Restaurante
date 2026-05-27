import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useMenu
} from "../../../context/MenuContext";
import "../styles/menu.css";

export const MenuPage = () => {

    /* =========================
       STATES
    ========================= */

    const {
  dishes,
  addDish,
  editDish,
  deleteDish
} = useMenu();


    const [activeCategory, setActiveCategory] = useState("Todas");

    const [selectedDish, setSelectedDish] = useState(dishes[0]);

    const [search, setSearch] = useState("");

    const [showAddModal, setShowAddModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [newDish, setNewDish] = useState({
        name: "",
        category: "",
        price: "",
        status: "Disponible",
        image: "",
        description: ""
    });

    /* =========================
       FILTERS
    ========================= */

    const filteredDishes = dishes.filter((dish) => {

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

    /* =========================
       STATS
    ========================= */

    const totalDishes = dishes.length;

    const availableDishes =
        dishes.filter(
            (dish) =>
                dish.status === "Disponible"
        ).length;

    const unavailableDishes =
        dishes.filter(
            (dish) =>
                dish.status !== "Disponible"
        ).length;

    const categories =
        [...new Set(
            dishes.map(
                (dish) => dish.category
            )
        )];

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
                            Gestión del menú en tiempo real.
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

                {/* MENU LAYOUT */}
                <section className="menu-layout">

                    {/* LEFT */}
                    <div className="menu-content card">

                        {/* TOP */}
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

                                {
                                    categories.map((category, index) => (

                                        <button
                                            key={index}
                                            className={
                                                activeCategory === category
                                                    ? "active"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setActiveCategory(category)
                                            }
                                        >
                                            {category}
                                        </button>
                                    ))
                                }

                            </div>

                            {/* ACTIONS */}
                            <div className="top-actions">

                                <button
                                    className="btn-gold"
                                    onClick={() =>
                                        setShowAddModal(true)
                                    }
                                >
                                    + Agregar Plato
                                </button>

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

                        {/* STATS */}
                        <div className="stats-grid">

                            <div className="stat-card">
                                <h2>{totalDishes}</h2>
                                <p>Platos en total</p>
                            </div>

                            <div className="stat-card">
                                <h2>{categories.length}</h2>
                                <p>Categorías</p>
                            </div>

                            <div className="stat-card">
                                <h2>{availableDishes}</h2>
                                <p>Disponibles</p>
                            </div>

                            <div className="stat-card danger">
                                <h2>{unavailableDishes}</h2>
                                <p>No disponibles</p>
                            </div>

                        </div>

                        {/* TABLE */}
                        <div className="menu-table">

                            {
                                filteredDishes.map((dish) => (

                                    <div
                                        className="table-row"
                                        key={dish.id}
                                        onClick={() =>
                                            setSelectedDish(dish)
                                        }
                                    >

                                        <div className="dish-info">

                                            <img
                                                src={dish.image}
                                                alt=""
                                            />

                                            <div>

                                                <h3>
                                                    {dish.name}
                                                </h3>

                                                <p>
                                                    {dish.category}
                                                </p>

                                            </div>

                                        </div>

                                        <span>
  Q{dish.price}
</span>

                                        <span
                                            className={
                                                dish.status === "Disponible"
                                                    ? "available"
                                                    : "not-available"
                                            }
                                        >
                                            {dish.status}
                                        </span>

                                    </div>

                                ))
                            }

                        </div>

                    </div>

                    {/* RIGHT PANEL */}
                    <aside className="dish-details card">

                        {
                            selectedDish && (

                                <>

                                    <h2>Detalle del Plato</h2>

                                    <img
                                        src={selectedDish.image}
                                        alt=""
                                        className="dish-banner"
                                    />

                                    <h3>
                                        {selectedDish.name}
                                    </h3>

                                    <p>
                                        {selectedDish.description}
                                    </p>

                                    <div className="details-list">

                                        <div className="detail-item">

                                            <span>Categoría</span>

                                            <p>
                                                {selectedDish.category}
                                            </p>

                                        </div>

                                        <div className="detail-item">

                                            <span>Precio</span>

                                            <p>
                                                {selectedDish.price}
                                            </p>

                                        </div>

                                        <div className="detail-item">

                                            <span>Estado</span>

                                            <p>
                                                {selectedDish.status}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="actions">

                                        <button
                                            className="btn-gold"
                                            onClick={() =>
                                                setShowEditModal(true)
                                            }
                                        >
                                            Editar Plato
                                        </button>

                                        <button
                                            className="btn-danger"
                                            onClick={() =>
                                                setShowDeleteModal(true)
                                            }
                                        >
                                            Eliminar Plato
                                        </button>

                                    </div>

                                </>

                            )
                        }

                    </aside>

                </section>

/* =========================
   MODAL AGREGAR
========================= */

{
  showAddModal && (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          Agregar Plato
        </h2>

        <form className="modal-form">

          {/* NOMBRE */}
          <input
            type="text"
            placeholder="Nombre"
            value={newDish.name}
            onChange={(e) =>
              setNewDish({
                ...newDish,
                name: e.target.value
              })
            }
          />

          {/* CATEGORÍAS */}
          <select
            value={newDish.category}
            onChange={(e) =>
              setNewDish({
                ...newDish,
                category: e.target.value
              })
            }
          >

            <option value="">
              Seleccionar categoría
            </option>

            {
              categories.map((category, index) => (

                <option
                  key={index}
                  value={category}
                >
                  {category}
                </option>

              ))
            }

          </select>

          {/* PRECIO */}
          <input
            type="number"
            placeholder="Precio"
            value={newDish.price}
            onChange={(e) =>
              setNewDish({
                ...newDish,
                price: e.target.value
              })
            }
          />

          {/* DESCRIPCIÓN */}
          <textarea
            placeholder="Descripción"
            value={newDish.description}
            onChange={(e) =>
              setNewDish({
                ...newDish,
                description: e.target.value
              })
            }
          ></textarea>

          {/* IMAGEN */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file =
                e.target.files[0];

              if(file){

                const imageUrl =
                  URL.createObjectURL(file);

                setNewDish({
                  ...newDish,
                  image: imageUrl
                });
              }
            }}
          />

          {/* PREVIEW */}
          {
            newDish.image && (

              <img
                src={newDish.image}
                alt="preview"
                className="preview-image"
              />

            )
          }

          <div className="modal-actions">

            {/* CANCELAR */}
            <button
              type="button"
              className="modal-cancel"
              onClick={() => {

                setShowAddModal(false);

                setNewDish({

                  name: "",

                  category: "",

                  price: "",

                  status:
                    "Disponible",

                  image: "",

                  description: ""

                });

              }}
            >
              Cancelar
            </button>

            {/* GUARDAR */}
            <button
              type="button"
              className="modal-save"
              onClick={() => {

                if(
                  !newDish.name ||
                  !newDish.category ||
                  !newDish.price
                ){

                  alert(
                    "Completa todos los campos"
                  );

                  return;
                }

                addDish({

                  id: Date.now(),

                  name:
                    newDish.name,

                  category:
                    newDish.category,

                  price:
                    Number(
                      newDish.price
                    ).toFixed(2),

                  status:
                    "Disponible",

                  image:
                    newDish.image ||
                    "/plato1.jpeg",

                  description:
                    newDish.description

                });

                alert(
                  "Plato agregado correctamente"
                );

                setShowAddModal(false);

                setNewDish({

                  name: "",

                  category: "",

                  price: "",

                  status:
                    "Disponible",

                  image: "",

                  description: ""

                });

              }}
            >
              Guardar Plato
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}

{
  showEditModal && (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          Editar Plato
        </h2>

        <form className="modal-form">

          <input
            type="text"
            placeholder="Nombre"
            value={selectedDish.name}
            onChange={(e) =>
              setSelectedDish({
                ...selectedDish,
                name: e.target.value
              })
            }
          />

          {/* CATEGORÍAS */}
          <select
            value={selectedDish.category}
            onChange={(e) =>
              setSelectedDish({
                ...selectedDish,
                category: e.target.value
              })
            }
          >

            <option value="">
              Seleccionar categoría
            </option>

            {
              categories.map((category, index) => (

                <option
                  key={index}
                  value={category}
                >
                  {category}
                </option>

              ))
            }

          </select>

          <input
            type="number"
            placeholder="Precio"
            value={selectedDish.price}
            onChange={(e) =>
              setSelectedDish({
                ...selectedDish,
                price: e.target.value
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={selectedDish.description}
            onChange={(e) =>
              setSelectedDish({
                ...selectedDish,
                description:
                  e.target.value
              })
            }
          ></textarea>

          {/* INPUT IMAGEN */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {

              const file =
                e.target.files[0];

              if(file){

                const imageUrl =
                  URL.createObjectURL(file);

                setSelectedDish({
                  ...selectedDish,
                  image: imageUrl
                });
              }
            }}
          />

          {/* PREVIEW */}
          {
            selectedDish.image && (

              <img
                src={selectedDish.image}
                alt="preview"
                className="preview-image"
              />

            )
          }

          <div className="modal-actions">

            <button
              type="button"
              className="modal-cancel"
              onClick={() =>
                setShowEditModal(false)
              }
            >
              Cancelar
            </button>

            <button
              type="button"
              className="modal-save"
              onClick={() => {

                if(
                  !selectedDish.name ||
                  !selectedDish.price ||
                  !selectedDish.category
                ){

                  alert(
                    "Completa todos los campos"
                  );

                  return;
                }

                editDish({

                  ...selectedDish,

                  price:
                    Number(
                      selectedDish.price
                    ).toFixed(2)

                });

                alert(
                  "Plato actualizado"
                );

                setShowEditModal(false);

              }}
            >
              Guardar Cambios
            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


{
  showDeleteModal && (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>
          Confirmar Eliminación
        </h2>

        <p>
          ¿Seguro que deseas
          eliminar este plato?
        </p>

        <div className="modal-actions">

          <button
            type="button"
            className="modal-cancel"
            onClick={() =>
              setShowDeleteModal(false)
            }
          >
            Cancelar
          </button>

          <button
            type="button"
            className="modal-delete"
            onClick={() => {

              deleteDish(
                selectedDish.id
              );

              alert(
                "Plato eliminado"
              );

              setShowDeleteModal(false);

              setSelectedDish(null);

            }}
          >
            Eliminar
          </button>

        </div>

      </div>

    </div>
  )
}

            </main>

        </div>

    );
};
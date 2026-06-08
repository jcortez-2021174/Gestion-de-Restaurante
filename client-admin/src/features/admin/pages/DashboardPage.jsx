import "../styles/dashboard.css";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";

import { Link } from "react-router-dom";
import { useMenu } from "../../../context/MenuContext";
import { useEffect, useState } from "react";

import { obtenerEstadisticas } from "../../../services/dashboard.service";

export const DashboardPage = () => {

  const {
    dishes,
    addDish,
    editDish,
    deleteDish
  } = useMenu();

  const [stats, setStats] = useState({
    pedidosTotales: 0,
    reservasTotales: 0,
    mesasOcupadas: 0,
    clientesTotales: 0
  });

 const [newPlate, setNewPlate] = useState({
  name: "",
  price: "",
  description: "",
  image: ""
});

  const [showAddModal, setShowAddModal] = useState(false);

  const [showEditModal, setShowEditModal] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedPlate, setSelectedPlate] = useState(null);

  useEffect(() => {

    loadDashboardStats();

  }, []);

   const loadDashboardStats = async () => {

    try {

        const data = await obtenerEstadisticas();

        console.log("Dashboard Data:", data);

        setStats(data.stats || data);

    } catch (error) {

        console.error("Error Dashboard:", error);

    }

};

  return (

    <AdminLayout
    notificationCount={stats.pedidosTotales}
>

        {/* STATS */}
        <div className="stats-grid">

          <div className="stats-card">

            <h4>Pedidos Totales</h4>

            <h2>{stats.pedidosTotales}</h2>

          </div>

          <div className="stats-card">

            <h4>Reservas Totales</h4>

            <h2>{stats.reservasTotales}</h2>

          </div>

          <div className="stats-card">

            <h4>Mesas Ocupadas</h4>

            <h2>{stats.mesasOcupadas}</h2>

          </div>

          <div className="stats-card">

            <h4>Clientes Totales</h4>

            <h2>{stats.clientesTotales}</h2>

          </div>

        </div>

        {/* GRID */}
        <div className="grid">

          {/* MENU */}
          <div className="card menu-card-container">

            <div className="card-header">

              <h3>MENÚ DESTACADO</h3>

              <Link
                to="/menu"
                className="btn-mini"
              >

                <i className="ri-arrow-right-line"></i>

                Ver menú completo

              </Link>

            </div>

            <div className="menu-grid">

              {
                dishes.map((plate) => (

                  <div
                    key={plate.id}
                    className="menu-card"
                  >

                    <img
                      src={plate.image || `/plato${plate.id}.jpeg`}         
                                   alt=""
                    />

                    <div className="menu-card-content">

                      <h4>{plate.name}</h4>

                      <p>
                        Especialidad gourmet de la casa
                      </p>

                      <span>
                        Q{plate.price}
                      </span>

                    </div>

                  </div>
                ))
              }

            </div>

            <div className="actions">

              <button
                className="btn-gold"
                onClick={() => setShowAddModal(true)}
              >

                <i className="ri-add-line"></i>

                Agregar Plato

              </button>

              <button
                className="btn-outline"
                onClick={() => {
                  setSelectedPlate(null);
                  setShowEditModal(true);
                }}
              >

                <i className="ri-edit-line"></i>

                Editar Plato

              </button>

              <button
                className="btn-danger"
                onClick={() => {
                  setSelectedPlate(null);
                  setShowDeleteModal(true);
                }}
              >

                <i className="ri-delete-bin-line"></i>

                Eliminar Plato

              </button>

            </div>

          </div>

          {/* RESERVA */}
          <div className="card reserva">

            <div className="reserva-header">

              <i className="ri-calendar-check-line"></i>

              <span>Reservar mesa</span>

            </div>

            <div className="inputs">

              <div className="input-box">

                <i className="ri-calendar-line left-icon"></i>

                <input type="date" />

              </div>

              <div className="input-box">

                <i className="ri-time-line left-icon"></i>

                <input type="time" />

              </div>

            </div>

            <Link
              to="/reservations"
              className="btn-reserva"
            >

              <i className="ri-calendar-check-line"></i>

              Reservar Mesa

            </Link>

          </div>

          {/* PEDIDOS */}
          <div className="card pedidos">

            <h3>PEDIDOS</h3>

            <Link
              to="/orders"
              className="pedido-btn"
            >

              <i className="ri-motorbike-line"></i>

              Pedir a Domicilio

            </Link>

            <Link
              to="/orders"
              className="pedido-btn"
            >

              <i className="ri-shopping-bag-line"></i>

              Ordenar para Llevar

            </Link>

          </div>

          {/* ACCESO */}
          <div className="card acceso">

            <div className="card-header">

              <h3>Acceso rápido</h3>

            </div>

            <div className="quick-grid">

              <Link
                to="/orders"
                className="quick-link"
              >

                <div>

                  <i className="ri-file-list-3-line"></i>

                  <p>Gestión de pedidos</p>

                </div>

              </Link>

              <Link
                to="/tables"
                className="quick-link"
              >

                <div>

                  <i className="ri-restaurant-line"></i>

                  <p>Control de mesas</p>

                </div>

              </Link>

              <Link
                to="/reports"
                className="quick-link"
              >

                <div>

                  <i className="ri-bar-chart-grouped-line"></i>

                  <p>Historial de ventas</p>

                </div>

              </Link>

              <Link
                to="/clients"
                className="quick-link"
              >

                <div>

                  <i className="ri-user-line"></i>

                  <p>Usuarios</p>

                </div>

              </Link>

            </div>

          </div>

        </div>


  {/* MODAL AGREGAR */}
{
  showAddModal && (

    <div className="modal-overlay">

      <div className="modal-box">

        <h2>Agregar Plato</h2>

        <p>
          Completa la información del nuevo plato.
        </p>

        <form className="modal-form">

          <input
            type="text"
            placeholder="Nombre del plato"
            value={newPlate.name}
            onChange={(e) =>
              setNewPlate({
                ...newPlate,
                name: e.target.value
              })
            }
          />

          <input
            type="number"
            placeholder="Precio"
            value={newPlate.price}
            onChange={(e) =>
              setNewPlate({
                ...newPlate,
                price: e.target.value
              })
            }
          />

          <textarea
            placeholder="Descripción"
            value={newPlate.description}
            onChange={(e) =>
              setNewPlate({
                ...newPlate,
                description: e.target.value
              })
            }
          ></textarea>

          <input
  type="file"
  accept="image/*"
  onChange={(e) => {

    const file =
      e.target.files[0];

    if(file){

      const imageUrl =
        URL.createObjectURL(file);

      setNewPlate({
        ...newPlate,
        image: imageUrl
      });
    }
  }}
/>

{
  newPlate.image && (

    <img
      src={newPlate.image}
      alt="preview"
      className="preview-image"
    />

  )
}


          <div className="modal-actions">

            <button
              type="button"
              className="modal-cancel"
              onClick={() => {

                setNewPlate({
                  nombre: "",
                  precio: "",
                  descripcion: "",
                  imagen: ""
                });

                setShowAddModal(false);

              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              className="modal-save"
              onClick={() => {

             if(
  !newPlate.name ||
  !newPlate.price
){
  alert(
    "Completa todos los campos"
  );

  return;
}

addDish({

  id: Date.now(),

  name: newPlate.name,

  category: "Dashboard",

  price: Number(newPlate.price).toFixed(2),

  status: "Disponible",

  image:
    newPlate.image ||
    "/plato1.jpeg",

  description:
    newPlate.description

});

                alert(
                  "Plato agregado correctamente"
                );

     setNewPlate({
  name: "",
  price: "",
  description: "",
  image: ""
});

                setShowAddModal(false);

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

        <h2>Editar Plato</h2>

        <p>
          Selecciona el plato que deseas editar.
        </p>

        {
          !selectedPlate ? (

            <div className="plate-list">

              {
                dishes.map((plate) => (

                  <button
                    key={plate.id}
                    className="plate-option"
                    onClick={() =>
                      setSelectedPlate({
                        ...plate
                      })
                    }
                  >

                    <div>

                      <h4>{plate.name}</h4>

                      <span>
                        Q{plate.price}
                      </span>

                    </div>

                    <i className="ri-edit-line"></i>

                  </button>
                ))
              }

            </div>

          ) : (

            <form className="modal-form">

              <input
                type="text"
                value={selectedPlate.name}
                onChange={(e) =>
                  setSelectedPlate({
                    ...selectedPlate,
                    name: e.target.value
                  })
                }
              />

              <input
                type="number"
                value={selectedPlate.price}
                onChange={(e) =>
                  setSelectedPlate({
                    ...selectedPlate,
                    price: e.target.value
                  })
                }
              />

              <textarea
                value={selectedPlate.description}
                onChange={(e) =>
                  setSelectedPlate({
                    ...selectedPlate,
                    description: e.target.value
                  })
                }
              ></textarea>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {

                  const file =
                    e.target.files[0];

                  if(file){

                    const imageUrl =
                      URL.createObjectURL(file);

                    setSelectedPlate({
                      ...selectedPlate,
                      image: imageUrl
                    });
                  }
                }}
              />

              {
                selectedPlate.image && (

                  <img
                    src={selectedPlate.image}
                    alt="preview"
                    className="preview-image"
                  />

                )
              }

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {

                    setSelectedPlate(null);

                    setShowEditModal(false);

                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="modal-save"
                  onClick={() => {

                    editDish({
                      ...selectedPlate,

                      price:
                        Number(
                          selectedPlate.price
                        ).toFixed(2)
                    });

                    alert(
                      "Plato actualizado correctamente"
                    );

                    setSelectedPlate(null);

                    setShowEditModal(false);

                  }}
                >
                  Guardar Cambios
                </button>

              </div>

            </form>
          )
        }

      </div>

    </div>
  )
}


{
  showDeleteModal && (

    <div className="modal-overlay">

      <div className="modal-box">

        {
          !selectedPlate ? (

            <>

              <h2>
                Eliminar Plato
              </h2>

              <p>
                Selecciona el plato
                que deseas eliminar.
              </p>

              <div className="plate-list">

                {
                  dishes.map((plate) => (

                    <button
                      key={plate.id}
                      className="plate-option delete-option"
                      onClick={() =>
                        setSelectedPlate({
                          ...plate
                        })
                      }
                    >

                      <div>

                        <h4>
                          {plate.name}
                        </h4>

                        <span>
                          Q{plate.price}
                        </span>

                      </div>

                      <i className="ri-delete-bin-line"></i>

                    </button>

                  ))
                }

              </div>

            </>

          ) : (

            <>

              <h2>
                Confirmar Eliminación
              </h2>

              <p>
                ¿Seguro que deseas eliminar
                {" "}
                <strong>
                  {selectedPlate.name}
                </strong>
                ?
              </p>

              <div className="modal-actions">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() => {

                    setSelectedPlate(null);

                  }}
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  className="modal-delete"
                  onClick={() => {

                    deleteDish(
                      selectedPlate.id
                    );

                    alert(
                      "Plato eliminado"
                    );

                    setSelectedPlate(null);

                    setShowDeleteModal(false);

                  }}
                >
                  Eliminar
                </button>

              </div>

            </>

          )
        }

      </div>

    </div>

  )
}
      </AdminLayout>
  );
};
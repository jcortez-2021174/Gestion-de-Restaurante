import {
    useEffect,
    useMemo,
    useState
} from "react";

import { Link }
from "react-router-dom";

import {
    obtenerTodas,
    cambiarEstado,
    eliminar,
    crear
} from "../../../services/reservaciones.service";

import "../styles/reservations.css";

export const ReservationsPage = () => {

    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /* ===================================
       STATES
    =================================== */

    const [selectedReservation,
    setSelectedReservation] =
    useState(null);

    const [activeFilter,
    setActiveFilter] =
    useState("Todas");

    const [search,
    setSearch] =
    useState("");

    const [showModal,
    setShowModal] =
    useState(false);

    const [newReservation,
    setNewReservation] =
    useState({

        clienteId:"",
        mesaId:"",
        fecha:"",
        horaInicio:"",
        horaFin:"",
        personas:"",

    });

    /* ===================================
       LOAD DATA
    =================================== */

    useEffect(() => {
        loadReservations();
    }, []);

    const loadReservations = async () => {
        try {
            setLoading(true);
            const response = await obtenerTodas();
            const reservationsData = response.data || response || [];
            
            // Transform backend data to frontend format
            const transformedReservations = Array.isArray(reservationsData) ? reservationsData.map(res => ({
                id: res.id,
                client: res.clienteNombre || 'Cliente',
                phone: res.telefono || '',
                date: res.fecha || '',
                hour: res.horaInicio || '',
                people: res.personas || 0,
                table: res.mesaNumero ? `Mesa ${res.mesaNumero}` : 'Mesa',
                status: res.estado || 'RESERVADA',
                notes: res.notas || res.observaciones || '',
                createdAt: res.fechaCreacion ? new Date(res.fechaCreacion).toLocaleDateString() : ''
            })) : [];
            
            setReservations(transformedReservations);
            if (transformedReservations.length > 0 && !selectedReservation) {
                setSelectedReservation(transformedReservations[0]);
            }
        } catch (err) {
            setError(err.message || 'Error al cargar reservaciones');
            console.error('Error loading reservations:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateReservationStatus = async (reservationId, newStatus) => {
        try {
            await cambiarEstado(reservationId, newStatus);
            await loadReservations();
        } catch (err) {
            alert('Error al actualizar estado: ' + err.message);
            console.error('Error updating reservation status:', err);
        }
    };

    const deleteReservation = async (reservationId) => {
        try {
            await eliminar(reservationId);
            await loadReservations();
            setSelectedReservation(null);
        } catch (err) {
            alert('Error al eliminar reservación: ' + err.message);
            console.error('Error deleting reservation:', err);
        }
    };

    /* ===================================
       FILTERS
    =================================== */

    const filteredReservations =
    useMemo(() => {

        let filtered =
            [...reservations];

        if(activeFilter === "Confirmadas"){

            filtered =
                filtered.filter(
                    (r) =>
                        r.status ===
                        "RESERVADA"
                );
        }

        if(activeFilter === "Canceladas"){

            filtered =
                filtered.filter(
                    (r) =>
                        r.status ===
                        "CANCELADA"
                );
        }

        if(activeFilter === "Hoy"){

            const today =
                new Date()
                .toLocaleDateString();

            filtered =
                filtered.filter(
                    (r) =>
                        r.date === today
                );
        }

        filtered =
            filtered.filter((r) =>

                r.client
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                ) ||

                r.id
                .toLowerCase()
                .includes(
                    search.toLowerCase()
                )
            );

        return filtered;

    }, [
        reservations,
        activeFilter,
        search
    ]);

    /* ===================================
       ADD RESERVATION
    =================================== */

    const addReservation = async () => {

        if(

            !newReservation.clienteId ||

            !newReservation.mesaId ||

            !newReservation.fecha ||

            !newReservation.horaInicio ||

            !newReservation.horaFin ||

            !newReservation.personas

        ){

            alert(
                "Completa todos los campos"
            );

            return;
        }

        try {
            await crear(newReservation);
            await loadReservations();
            setShowModal(false);
            setNewReservation({
                clienteId:"",
                mesaId:"",
                fecha:"",
                horaInicio:"",
                horaFin:"",
                personas:"",
            });
        } catch (err) {
            alert('Error al crear reservacion: ' + (err.userMessage || err.message));
        }

    };

    return (

        <div className="container">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="logo-box">

                    <img
                        src="/logo.png"
                        alt="logo"
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
                        <li className="active">

                            <i className="ri-calendar-line"></i>

                            Reservas

                            <span className="badge">

                                {
                                    reservations.filter(
                                        (r) =>
                                            r.status !==
                                            "Finalizada"
                                    ).length
                                }

                            </span>

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
                        <li>

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

                <div className="sidebar-image reservations-sidebar">

                    <img
                        src="/vino.jpg"
                        alt=""
                    />

                    <div className="overlay"></div>

                    <div className="sidebar-decor">

                        <i className="ri-calendar-check-line"></i>

                    </div>

                    <p>

                        Las mejores experiencias
                        comienzan con una reserva.

                    </p>

                </div>

            </aside>

            {/* MAIN */}

            <main className="main">

                {/* HEADER */}

                <div className="header">

                    <div>

                        <h2>
                            RESERVACIONES
                        </h2>

                        <p>
                            Gestión premium de reservas.
                        </p>

                    </div>

                    <div className="user-box">

                        <div className="notification">

                            <i className="ri-notification-3-line"></i>

                            <span className="badge">

                                {
                                    reservations.filter(
                                        (r) =>
                                            r.status !==
                                            "Finalizada"
                                    ).length
                                }

                            </span>

                        </div>

                        

                    </div>

                </div>

                {/* CONTENT */}
<div className="reservations-layout">

    {/* LEFT */}

    <section className="reservations-table">

        {loading ? (
            <div className="loading-state">
                <p>Cargando reservaciones...</p>
            </div>
        ) : error ? (
            <div className="error-state">
                <p>Error: {error}</p>
                <button onClick={loadReservations}>Reintentar</button>
            </div>
        ) : (
            <>
        <div className="section-header">

            <h2>

                <i className="ri-calendar-check-line"></i>

                RESERVACIONES

            </h2>

            <button
                className="new-btn"
                onClick={() =>
                    setShowModal(true)
                }
            >

                <i className="ri-add-line"></i>

                Nueva Reserva

            </button>

        </div>

        {/* FILTERS */}

        <div className="filters">

            <div className="tabs">

                {
                    [
                        "Todas",
                        "Hoy",
                        "Confirmadas",
                        "Canceladas"
                    ].map((tab,index) => (

                        <button
                            key={index}
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
                    placeholder="Buscar reserva..."
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
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

        {/* SCROLL SOLO AQUÍ */}

        <div className="reservations-scroll">

            {
                filteredReservations.map(
                    (
                        reservation,
                        index
                    ) => (

                        <div
                            key={index}
                            className={`reservation-row ${
                                selectedReservation?.id ===
                                reservation.id
                                ? "active-row"
                                : ""
                            }`}
                            onClick={() =>
                                setSelectedReservation(
                                    reservation
                                )
                            }
                        >

                            <span>
                                {reservation.id}
                            </span>

                            <div>

                                <h4>
                                    {reservation.client}
                                </h4>

                                <small>
                                    {reservation.phone}
                                </small>

                            </div>

                            <span>
                                {reservation.date}
                            </span>

                            <span>
                                {reservation.hour}
                            </span>

                            <span>
                                {reservation.people}
                            </span>

                            <span>
                                {reservation.table}
                            </span>

                            <span
                                className={`status ${
                                    reservation.status ===
                                    "RESERVADA"

                                    ? "confirmed"

                                    : reservation.status ===
                                    "CANCELADA"

                                    ? "cancelled"

                                    : "pending"
                                }`}
                            >

                                {reservation.status}

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

                    )
                )
            }

        </div>

            </>
        )}

    </section>

    {/* RIGHT */}

    <aside className="details-card">

        <div className="details-content">

            {
                selectedReservation ? (

                    <>

                        <h2>

                            <i className="ri-file-list-3-line"></i>

                            DETALLE

                        </h2>

                        <div className="badge-status">

                            {
                                selectedReservation.status
                            }

                        </div>

                        <h3>

                            {
                                selectedReservation.client
                            }

                        </h3>

                        <p className="reservation-date">

                            Reserva realizada el{" "}

                            {
                                selectedReservation.createdAt
                            }

                        </p>

                      <div className="detail-item">

    <i className="ri-calendar-line"></i>

    <div className="detail-text">

        <small>Fecha</small>

        <p>{selectedReservation.date}</p>

    </div>

</div>

                        <div className="detail-item">

                            <i className="ri-time-line"></i>

                            <div className="detail-text">

                                <small>Hora</small>

                                <p>

                                    {
                                        selectedReservation.hour
                                    }

                                </p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-group-line"></i>

                            <div className="detail-text">

                                <small>Personas</small>

                                <p>

                                    {
                                        selectedReservation.people
                                    }

                                </p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-table-line"></i>

                            <div className="detail-text">

                                <small>Mesa</small>

                                <p>

                                    {
                                        selectedReservation.table
                                    }

                                </p>

                            </div>

                        </div>

                        <div className="detail-item">

                            <i className="ri-message-2-line"></i>

                            <div className="detail-text">

                                <small>Notas</small>

                                <p>

                                    {
                                        selectedReservation.notes
                                    }

                                </p>

                            </div>

                        </div>

                        {/* ACTIONS */}

                    <div className="detail-buttons">

    {
        selectedReservation.status ===
        "RESERVADA" && (

            <>

                <button
                    className="edit-btn"
                    onClick={() => {

                        updateReservationStatus(
                            selectedReservation.id,
                            "EXPIRADA"
                        );

                        setSelectedReservation({

                            ...selectedReservation,

                            status:"EXPIRADA"
                        });

                    }}
                >

                    Confirmar Reserva

                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {

                        updateReservationStatus(
                            selectedReservation.id,
                            "CANCELADA"
                        );

                        setSelectedReservation({

                            ...selectedReservation,

                            status:"CANCELADA"
                        });

                    }}
                >

                    Rechazar Reserva

                </button>

            </>

        )
    }

    {
        selectedReservation.status ===
        "EXPIRADA" && (

            <>

                <button
                    className="edit-btn"
                    onClick={() => {

                        updateReservationStatus(
                            selectedReservation.id,
                            "CANCELADA"
                        );

                        setSelectedReservation({

                            ...selectedReservation,

                            status:"CANCELADA"
                        });

                    }}
                >

                    Cliente Llegó

                </button>

                <button
                    className="cancel-btn"
                    onClick={() => {

                        updateReservationStatus(
                            selectedReservation.id,
                            "CANCELADA"
                        );

                        setSelectedReservation({

                            ...selectedReservation,

                            status:"CANCELADA"
                        });

                    }}
                >

                    Cancelar Reserva

                </button>

            </>

        )
    }

    {
        selectedReservation.status ===
        "CANCELADA" && (

            <button
                className="delete-btn"
                onClick={() => {

                    deleteReservation(
                        selectedReservation.id
                    );

                    setSelectedReservation(null);

                }}
            >

                Eliminar Reserva

            </button>

        )
    }

    {
        selectedReservation.status ===
        "EXPIRADA" && (

            <button
                className="delete-btn"
                onClick={() => {

                    deleteReservation(
                        selectedReservation.id
                    );

                    setSelectedReservation(null);

                }}
            >

                Finalizar Registro

            </button>

        )
    }

</div>

                    </>

                ) : (

                    <div className="empty-detail">

                        Selecciona una reserva

                    </div>

                )
            }

        </div>

    </aside>

</div>
</main>
{
    showModal && (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>Nueva Reserva</h2>
                <p>Ingresa los IDs reales de cliente y mesa.</p>

                <form className="modal-form">
                    <input
                        type="text"
                        placeholder="Cliente ID"
                        value={newReservation.clienteId}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            clienteId: e.target.value
                        })}
                    />
                    <input
                        type="text"
                        placeholder="Mesa ID"
                        value={newReservation.mesaId}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            mesaId: e.target.value
                        })}
                    />
                    <input
                        type="date"
                        value={newReservation.fecha}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            fecha: e.target.value
                        })}
                    />
                    <input
                        type="time"
                        value={newReservation.horaInicio}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            horaInicio: e.target.value
                        })}
                    />
                    <input
                        type="time"
                        value={newReservation.horaFin}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            horaFin: e.target.value
                        })}
                    />
                    <input
                        type="number"
                        min="1"
                        placeholder="Personas"
                        value={newReservation.personas}
                        onChange={(e) => setNewReservation({
                            ...newReservation,
                            personas: e.target.value
                        })}
                    />

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="modal-cancel"
                            onClick={() => setShowModal(false)}
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            className="modal-save"
                            onClick={addReservation}
                        >
                            Guardar Reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
       </div>     
    );
};

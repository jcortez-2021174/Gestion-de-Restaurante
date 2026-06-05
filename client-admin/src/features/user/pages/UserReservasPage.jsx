import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useCartStore } from "../store/carStore";
import "../styles/dashboard.css";
import "../styles/userreservas.css";

const RESERVAS_DEMO = [
  {
    id: "RES-2801",
    fecha: "2025-06-10",
    hora: "19:00",
    personas: 4,
    mesa: "Mesa #5",
    estado: "confirmada",
    notas: "Celebración de aniversario. Por favor decoración especial.",
    creadaEl: "2025-05-28",
  },
  {
    id: "RES-2734",
    fecha: "2025-05-30",
    hora: "20:30",
    personas: 2,
    mesa: "Mesa #3",
    estado: "pendiente",
    notas: "Ventana si es posible.",
    creadaEl: "2025-05-22",
  },
  {
    id: "RES-2601",
    fecha: "2025-05-15",
    hora: "13:00",
    personas: 6,
    mesa: "Mesa #12",
    estado: "completada",
    notas: "",
    creadaEl: "2025-05-10",
  },
  {
    id: "RES-2488",
    fecha: "2025-04-20",
    hora: "19:30",
    personas: 3,
    mesa: "Mesa #7",
    estado: "cancelada",
    notas: "Reagendada.",
    creadaEl: "2025-04-14",
  },
];

const ESTADO_CONFIG = {
  confirmada: { label: "Confirmada", className: "estado-confirmada", icon: "ri-checkbox-circle-line" },
  pendiente:  { label: "Pendiente",  className: "estado-pendiente",  icon: "ri-time-line" },
  completada: { label: "Completada", className: "estado-completada", icon: "ri-check-double-line" },
  cancelada:  { label: "Cancelada",  className: "estado-cancelada",  icon: "ri-close-circle-line" },
};

const HORAS = [
  "12:00", "12:30", "13:00", "13:30",
  "19:00", "19:30", "20:00", "20:30", "21:00",
];

export const UserReservasPage = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const carrito   = useCartStore((s) => s.carrito);
  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);

  const [reservas, setReservas] = useState(RESERVAS_DEMO);
  const [filtro,   setFiltro]   = useState("todas");
  const [seleccionada, setSeleccionada] = useState(RESERVAS_DEMO[0]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(null);

  // Formulario nueva reserva
  const [form, setForm] = useState({
    fecha: "",
    hora: HORAS[4],
    personas: 2,
    notas: "",
  });
  const [formError, setFormError] = useState("");
  const [formOk,    setFormOk]    = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const reservasFiltradas = reservas.filter((r) => {
    if (filtro === "todas") return true;
    return r.estado === filtro;
  });

  const handleSeleccionar = (r) => {
    setSeleccionada(r);
    setMostrarFormulario(false);
  };

  const handleNuevaReserva = () => {
    setMostrarFormulario(true);
    setSeleccionada(null);
    setFormOk(false);
    setFormError("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!form.fecha) { setFormError("Por favor selecciona una fecha."); return; }
    if (!form.hora)  { setFormError("Por favor selecciona una hora."); return; }
    if (form.personas < 1 || form.personas > 20) { setFormError("El número de personas debe ser entre 1 y 20."); return; }

    const nueva = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: form.fecha,
      hora: form.hora,
      personas: parseInt(form.personas),
      mesa: "Por asignar",
      estado: "pendiente",
      notas: form.notas,
      creadaEl: new Date().toISOString().slice(0, 10),
    };

    setReservas((prev) => [nueva, ...prev]);
    setSeleccionada(nueva);
    setMostrarFormulario(false);
    setFormOk(true);
    setForm({ fecha: "", hora: HORAS[4], personas: 2, notas: "" });
    setFormError("");
  };

  const handleCancelar = (id) => {
    setReservas((prev) =>
      prev.map((r) => r.id === id ? { ...r, estado: "cancelada" } : r)
    );
    if (seleccionada?.id === id) {
      setSeleccionada((prev) => ({ ...prev, estado: "cancelada" }));
    }
    setModalCancelar(null);
  };

  const formatFecha = (iso) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    const meses = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    return `${parseInt(d)} de ${meses[parseInt(m) - 1]} ${y}`;
  };

  const conteo = {
    confirmada: reservas.filter((r) => r.estado === "confirmada").length,
    pendiente:  reservas.filter((r) => r.estado === "pendiente").length,
  };

  return (
    <div className="container">

      {/* ─── SIDEBAR ─── */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>
        <ul className="menu">
          <Link to="/home" className="menu-link"><li><i className="ri-home-4-line"></i> Inicio</li></Link>
          <Link to="/user/menu" className="menu-link"><li><i className="ri-restaurant-line"></i> Menú</li></Link>
          <Link to="/user/reservations" className="menu-link">
            <li className="active"><i className="ri-calendar-line"></i> Reservas</li>
          </Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line"></i> Pedidos
              {totalItems > 0 && <span className="menu-badge">{totalItems}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link"><li><i className="ri-group-line"></i> Sobre Nosotros</li></Link>
          <Link to="/user/contacto" className="menu-link"><li><i className="ri-contacts-book-line"></i> Contacto</li></Link>
          <Link to="/user/puntos" className="menu-link"><li><i className="ri-star-line"></i> Puntos Aurea</li></Link>
        </ul>
        <div className="sidebar-contact">
          <p className="sidebar-contact-title">CONTÁCTANOS</p>
          <div className="sidebar-contact-item"><i className="ri-phone-line"></i><span>+502 1234 5678</span></div>
          <div className="sidebar-contact-item"><i className="ri-mail-line"></i><span>hola@aurea.com</span></div>
          <div className="sidebar-contact-item"><i className="ri-map-pin-line"></i><span>5ta avenida 12-34, Zona 10, Guatemala</span></div>
        </div>
        <div className="sidebar-social">
          <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
          <a href="#" className="social-icon"><i className="ri-instagram-line"></i></a>
          <a href="#" className="social-icon"><i className="ri-whatsapp-line"></i></a>
        </div>
      </aside>

      {/* ─── MAIN ─── */}
      <main className="main ur-main">

        {/* TOPBAR */}
        <div className="ur-topbar">
          <div className="ur-topbar-left">
            <h1 className="ur-page-title">Mis Reservas</h1>
            <p className="ur-page-sub">Gestiona y crea tus reservaciones en Aurea.</p>
          </div>
          <div className="ur-topbar-right">
            <div className="ur-user-pill">
              <i className="ri-user-line" style={{ color: "var(--gold)" }}></i>
              <div>
                <span className="ur-user-name">Hola, {user?.name || "josecortez178"}</span>
                <small className="ur-user-role">Cliente Premium</small>
              </div>
              <button onClick={handleLogout} className="ur-logout-btn" title="Cerrar sesión">
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="ur-stats">
          <div className="ur-stat-card">
            <i className="ri-calendar-check-line"></i>
            <div>
              <span className="ur-stat-num">{conteo.confirmada}</span>
              <small>Confirmadas</small>
            </div>
          </div>
          <div className="ur-stat-card">
            <i className="ri-time-line"></i>
            <div>
              <span className="ur-stat-num">{conteo.pendiente}</span>
              <small>Pendientes</small>
            </div>
          </div>
          <div className="ur-stat-card ur-stat-cta" onClick={handleNuevaReserva}>
            <i className="ri-add-circle-line"></i>
            <div>
              <span className="ur-stat-num">Nueva</span>
              <small>Hacer reserva</small>
            </div>
          </div>
        </div>

        {/* LAYOUT PRINCIPAL */}
        <div className="ur-layout">

          {/* ─── LISTA ─── */}
          <section className="ur-lista-panel">

            <div className="ur-lista-header">
              <h2><i className="ri-list-check-2"></i> Historial</h2>
              <button className="ur-nueva-btn" onClick={handleNuevaReserva}>
                <i className="ri-add-line"></i> Nueva Reserva
              </button>
            </div>

            {/* FILTROS */}
            <div className="ur-filtros">
              {["todas","confirmada","pendiente","completada","cancelada"].map((f) => (
                <button
                  key={f}
                  className={`ur-filtro-btn${filtro === f ? " activo" : ""}`}
                  onClick={() => setFiltro(f)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            {/* LISTA */}
            <div className="ur-lista">
              {reservasFiltradas.length === 0 && (
                <div className="ur-empty">
                  <i className="ri-calendar-close-line"></i>
                  <p>No hay reservas en esta categoría.</p>
                </div>
              )}
              {reservasFiltradas.map((r) => {
                const cfg = ESTADO_CONFIG[r.estado];
                const activa = seleccionada?.id === r.id && !mostrarFormulario;
                return (
                  <div
                    key={r.id}
                    className={`ur-reserva-card${activa ? " activa" : ""}`}
                    onClick={() => handleSeleccionar(r)}
                  >
                    <div className="ur-card-top">
                      <span className="ur-card-id">{r.id}</span>
                      <span className={`ur-estado-badge ${cfg.className}`}>
                        <i className={cfg.icon}></i> {cfg.label}
                      </span>
                    </div>
                    <div className="ur-card-info">
                      <div className="ur-card-dato">
                        <i className="ri-calendar-line"></i>
                        <span>{formatFecha(r.fecha)}</span>
                      </div>
                      <div className="ur-card-dato">
                        <i className="ri-time-line"></i>
                        <span>{r.hora}</span>
                      </div>
                      <div className="ur-card-dato">
                        <i className="ri-group-line"></i>
                        <span>{r.personas} {r.personas === 1 ? "persona" : "personas"}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </section>

          {/* ─── DETALLE / FORMULARIO ─── */}
          <aside className="ur-detalle-panel">

            {/* FORMULARIO NUEVA RESERVA */}
            {mostrarFormulario && (
              <div className="ur-form-wrap">
                <h2><i className="ri-calendar-add-line"></i> Nueva Reserva</h2>
                <p className="ur-form-sub">Completa los datos y te confirmaremos a la brevedad.</p>

                {formError && (
                  <div className="ur-form-error">
                    <i className="ri-error-warning-line"></i> {formError}
                  </div>
                )}

                <div className="ur-form-group">
                  <label>Fecha <span>*</span></label>
                  <input
                    type="date"
                    name="fecha"
                    value={form.fecha}
                    min={new Date().toISOString().slice(0, 10)}
                    onChange={handleFormChange}
                    className="ur-input"
                  />
                </div>

                <div className="ur-form-group">
                  <label>Hora <span>*</span></label>
                  <select name="hora" value={form.hora} onChange={handleFormChange} className="ur-input">
                    {HORAS.map((h) => <option key={h} value={h}>{h}</option>)}
                  </select>
                </div>

                <div className="ur-form-group">
                  <label>Número de personas <span>*</span></label>
                  <div className="ur-personas-control">
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, personas: Math.max(1, p.personas - 1) }))}
                    >
                      <i className="ri-subtract-line"></i>
                    </button>
                    <span>{form.personas}</span>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, personas: Math.min(20, p.personas + 1) }))}
                    >
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>

                <div className="ur-form-group">
                  <label>Notas especiales</label>
                  <textarea
                    name="notas"
                    value={form.notas}
                    onChange={handleFormChange}
                    className="ur-input ur-textarea"
                    placeholder="Ej: Celebración de cumpleaños, alergias, preferencia de mesa..."
                    rows={3}
                  />
                </div>

                <div className="ur-form-actions">
                  <button className="ur-confirmar-btn" onClick={handleSubmit}>
                    <i className="ri-send-plane-line"></i> Solicitar Reserva
                  </button>
                  <button className="ur-cancelar-form-btn" onClick={() => { setMostrarFormulario(false); setSeleccionada(reservas[0]); }}>
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* DETALLE DE RESERVA SELECCIONADA */}
            {!mostrarFormulario && seleccionada && (() => {
              const cfg = ESTADO_CONFIG[seleccionada.estado];
              return (
                <div className="ur-detalle-wrap">

                  <div className="ur-detalle-top">
                    <h2><i className="ri-file-list-3-line"></i> Detalle</h2>
                    <span className={`ur-estado-badge ${cfg.className}`}>
                      <i className={cfg.icon}></i> {cfg.label}
                    </span>
                  </div>

                  <p className="ur-detalle-id">{seleccionada.id}</p>
                  <p className="ur-detalle-creada">Solicitud realizada el {formatFecha(seleccionada.creadaEl)}</p>

                  <div className="ur-detalle-items">
                    <div className="ur-detalle-item">
                      <i className="ri-calendar-event-line"></i>
                      <div>
                        <small>Fecha</small>
                        <p>{formatFecha(seleccionada.fecha)}</p>
                      </div>
                    </div>
                    <div className="ur-detalle-item">
                      <i className="ri-time-line"></i>
                      <div>
                        <small>Hora</small>
                        <p>{seleccionada.hora} hrs</p>
                      </div>
                    </div>
                    <div className="ur-detalle-item">
                      <i className="ri-group-line"></i>
                      <div>
                        <small>Personas</small>
                        <p>{seleccionada.personas} {seleccionada.personas === 1 ? "persona" : "personas"}</p>
                      </div>
                    </div>
                    <div className="ur-detalle-item">
                      <i className="ri-table-line"></i>
                      <div>
                        <small>Mesa asignada</small>
                        <p>{seleccionada.mesa}</p>
                      </div>
                    </div>
                    {seleccionada.notas && (
                      <div className="ur-detalle-item">
                        <i className="ri-message-2-line"></i>
                        <div>
                          <small>Notas</small>
                          <p>{seleccionada.notas}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* INFORMACIÓN DEL RESTAURANTE */}
                  <div className="ur-info-restaurante">
                    <p className="ur-info-titulo">Información del restaurante</p>
                    <div className="ur-info-item"><i className="ri-map-pin-2-line"></i><span>5ta Avenida 12-34, Zona 10, Guatemala</span></div>
                    <div className="ur-info-item"><i className="ri-phone-line"></i><span>+502 1234 5678</span></div>
                    <div className="ur-info-item"><i className="ri-time-line"></i><span>Lun–Dom: 12:00 – 22:00</span></div>
                  </div>

                  {/* ACCIONES */}
                  <div className="ur-detalle-acciones">
                    {(seleccionada.estado === "confirmada" || seleccionada.estado === "pendiente") && (
                      <button
                        className="ur-cancelar-reserva-btn"
                        onClick={() => setModalCancelar(seleccionada.id)}
                      >
                        <i className="ri-close-circle-line"></i> Cancelar Reserva
                      </button>
                    )}
                    <button className="ur-nueva-desde-detalle-btn" onClick={handleNuevaReserva}>
                      <i className="ri-add-line"></i> Nueva Reserva
                    </button>
                  </div>

                </div>
              );
            })()}

            {/* EMPTY STATE */}
            {!mostrarFormulario && !seleccionada && (
              <div className="ur-detalle-empty">
                <i className="ri-calendar-line"></i>
                <p>Selecciona una reserva para ver los detalles.</p>
                <button className="ur-nueva-btn" onClick={handleNuevaReserva}>
                  <i className="ri-add-line"></i> Hacer una reserva
                </button>
              </div>
            )}

          </aside>

        </div>

      </main>

      {/* ─── MODAL CONFIRMAR CANCELACIÓN ─── */}
      {modalCancelar && (
        <div className="ur-modal-overlay" onClick={() => setModalCancelar(null)}>
          <div className="ur-modal" onClick={(e) => e.stopPropagation()}>
            <i className="ri-alert-line ur-modal-icon"></i>
            <h3>¿Cancelar reserva?</h3>
            <p>Esta acción no se puede deshacer. ¿Deseas continuar?</p>
            <div className="ur-modal-btns">
              <button className="ur-modal-confirmar" onClick={() => handleCancelar(modalCancelar)}>
                Sí, cancelar
              </button>
              <button className="ur-modal-volver" onClick={() => setModalCancelar(null)}>
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOAST ÉXITO ─── */}
      {formOk && (
        <div className="ur-toast" onAnimationEnd={() => setTimeout(() => setFormOk(false), 3000)}>
          <i className="ri-checkbox-circle-line"></i>
          Reserva solicitada con éxito. Te confirmaremos pronto.
        </div>
      )}

    </div>
  );
};

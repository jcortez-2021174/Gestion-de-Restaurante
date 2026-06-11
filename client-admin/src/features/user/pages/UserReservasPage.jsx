import { useState } from "react";
import { UserShell } from "../components/UserShell";
import {
  EmptyState,
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
} from "../components/UserUi";
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

const STATUS = {
  confirmada: { label: "Confirmada", className: "estado-confirmada", icon: "ri-checkbox-circle-line" },
  pendiente: { label: "Pendiente", className: "estado-pendiente", icon: "ri-time-line" },
  completada: { label: "Completada", className: "estado-completada", icon: "ri-check-double-line" },
  cancelada: { label: "Cancelada", className: "estado-cancelada", icon: "ri-close-circle-line" },
};

const HOURS = ["12:00", "12:30", "13:00", "13:30", "19:00", "19:30", "20:00", "20:30", "21:00"];
const FILTERS = ["todas", "confirmada", "pendiente", "completada", "cancelada"];

const formatDate = (iso) => {
  if (!iso) return "";
  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${iso}T00:00:00Z`));
};

export const UserReservasPage = () => {
  const [reservas, setReservas] = useState(RESERVAS_DEMO);
  const [filtro, setFiltro] = useState("todas");
  const [seleccionada, setSeleccionada] = useState(RESERVAS_DEMO[0]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [modalCancelar, setModalCancelar] = useState(null);
  const [form, setForm] = useState({ fecha: "", hora: HOURS[4], personas: 2, notas: "" });
  const [formError, setFormError] = useState("");
  const [formOk, setFormOk] = useState(false);

  const reservasFiltradas = reservas.filter((reservation) => (
    filtro === "todas" || reservation.estado === filtro
  ));

  const handleNuevaReserva = () => {
    setMostrarFormulario(true);
    setSeleccionada(null);
    setFormOk(false);
    setFormError("");
  };

  const handleSubmit = () => {
    if (!form.fecha) {
      setFormError("Selecciona una fecha para continuar.");
      return;
    }
    if (form.personas < 1 || form.personas > 20) {
      setFormError("El número de personas debe estar entre 1 y 20.");
      return;
    }

    const nueva = {
      id: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      fecha: form.fecha,
      hora: form.hora,
      personas: Number(form.personas),
      mesa: "Por asignar",
      estado: "pendiente",
      notas: form.notas,
      creadaEl: new Date().toISOString().slice(0, 10),
    };

    setReservas((current) => [nueva, ...current]);
    setSeleccionada(nueva);
    setMostrarFormulario(false);
    setFormOk(true);
    setForm({ fecha: "", hora: HOURS[4], personas: 2, notas: "" });
    setFormError("");
  };

  const handleCancelar = (id) => {
    setReservas((current) => current.map((item) => (
      item.id === id ? { ...item, estado: "cancelada" } : item
    )));
    setSeleccionada((current) => (
      current?.id === id ? { ...current, estado: "cancelada" } : current
    ));
    setModalCancelar(null);
  };

  const confirmed = reservas.filter((item) => item.estado === "confirmada").length;
  const pending = reservas.filter((item) => item.estado === "pendiente").length;

  return (
    <UserShell contentClassName="ur-main">
      <SectionHeader
        eyebrow="Reservaciones Aurea"
        title="Mis Reservas"
        description="Gestiona y crea tus reservaciones en un solo lugar."
        action={<PrimaryButton icon="ri-calendar-add-line" onClick={handleNuevaReserva}>Nueva reserva</PrimaryButton>}
      />

      <div className="ur-stats">
        <article className="ur-stat-card">
          <i className="ri-calendar-check-line" />
          <div><span className="ur-stat-num">{confirmed}</span><small>Confirmadas</small></div>
        </article>
        <article className="ur-stat-card">
          <i className="ri-time-line" />
          <div><span className="ur-stat-num">{pending}</span><small>Pendientes</small></div>
        </article>
        <button type="button" className="ur-stat-card ur-stat-cta" onClick={handleNuevaReserva}>
          <i className="ri-add-circle-line" />
          <div><span className="ur-stat-num">Nueva</span><small>Hacer reserva</small></div>
        </button>
      </div>

      <div className="ur-layout">
        <section className="ur-lista-panel">
          <div className="ur-lista-header">
            <h2><i className="ri-list-check-2" /> Historial</h2>
            <SecondaryButton icon="ri-add-line" onClick={handleNuevaReserva}>Nueva reserva</SecondaryButton>
          </div>

          <div className="ur-filtros" role="tablist" aria-label="Filtrar reservaciones">
            {FILTERS.map((filter) => (
              <button
                type="button"
                key={filter}
                className={`ur-filtro-btn${filtro === filter ? " activo" : ""}`}
                onClick={() => setFiltro(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className="ur-lista">
            {reservasFiltradas.length === 0 ? (
              <EmptyState
                icon="ri-calendar-close-line"
                title="No hay reservas"
                description="No encontramos reservaciones con este estado."
              />
            ) : reservasFiltradas.map((reservation) => {
              const status = STATUS[reservation.estado];
              return (
                <button
                  type="button"
                  key={reservation.id}
                  className={`ur-reserva-card${seleccionada?.id === reservation.id && !mostrarFormulario ? " activa" : ""}`}
                  onClick={() => {
                    setSeleccionada(reservation);
                    setMostrarFormulario(false);
                  }}
                >
                  <div className="ur-card-top">
                    <span className="ur-card-id">{reservation.id}</span>
                    <span className={`ur-estado-badge ${status.className}`}>
                      <i className={status.icon} /> {status.label}
                    </span>
                  </div>
                  <div className="ur-card-info">
                    <span className="ur-card-dato"><i className="ri-calendar-line" />{formatDate(reservation.fecha)}</span>
                    <span className="ur-card-dato"><i className="ri-time-line" />{reservation.hora}</span>
                    <span className="ur-card-dato"><i className="ri-group-line" />{reservation.personas} personas</span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <aside className="ur-detalle-panel">
          {mostrarFormulario ? (
            <div className="ur-form-wrap">
              <h2><i className="ri-calendar-add-line" /> Nueva Reserva</h2>
              <p className="ur-form-sub">Completa los datos y te confirmaremos a la brevedad.</p>
              {formError && <div className="ur-form-error"><i className="ri-error-warning-line" />{formError}</div>}

              <label className="ur-form-group">
                <span>Fecha *</span>
                <input
                  type="date"
                  value={form.fecha}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(event) => setForm((current) => ({ ...current, fecha: event.target.value }))}
                  className="ur-input"
                />
              </label>
              <label className="ur-form-group">
                <span>Hora *</span>
                <select
                  value={form.hora}
                  onChange={(event) => setForm((current) => ({ ...current, hora: event.target.value }))}
                  className="ur-input"
                >
                  {HOURS.map((hour) => <option key={hour}>{hour}</option>)}
                </select>
              </label>
              <div className="ur-form-group">
                <span>Número de personas *</span>
                <div className="ur-personas-control">
                  <button type="button" onClick={() => setForm((current) => ({ ...current, personas: Math.max(1, current.personas - 1) }))}>−</button>
                  <span>{form.personas}</span>
                  <button type="button" onClick={() => setForm((current) => ({ ...current, personas: Math.min(20, current.personas + 1) }))}>+</button>
                </div>
              </div>
              <label className="ur-form-group">
                <span>Notas especiales</span>
                <textarea
                  value={form.notas}
                  onChange={(event) => setForm((current) => ({ ...current, notas: event.target.value }))}
                  className="ur-input ur-textarea"
                  placeholder="Celebración, alergias o preferencia de mesa..."
                  rows={4}
                />
              </label>
              <div className="ur-form-actions">
                <PrimaryButton icon="ri-send-plane-line" onClick={handleSubmit}>Solicitar reserva</PrimaryButton>
                <SecondaryButton onClick={() => {
                  setMostrarFormulario(false);
                  setSeleccionada(reservas[0] || null);
                }}>Cancelar</SecondaryButton>
              </div>
            </div>
          ) : seleccionada ? (
            <ReservationDetail
              reservation={seleccionada}
              onNew={handleNuevaReserva}
              onCancel={() => setModalCancelar(seleccionada.id)}
            />
          ) : (
            <EmptyState
              icon="ri-calendar-line"
              title="Selecciona una reserva"
              description="El detalle completo aparecerá en este panel."
              action={<PrimaryButton onClick={handleNuevaReserva}>Hacer una reserva</PrimaryButton>}
            />
          )}
        </aside>
      </div>

      {modalCancelar && (
        <div className="ur-modal-overlay" onClick={() => setModalCancelar(null)}>
          <div className="ur-modal" onClick={(event) => event.stopPropagation()}>
            <i className="ri-alert-line ur-modal-icon" />
            <h3>¿Cancelar reserva?</h3>
            <p>Esta acción no se puede deshacer. ¿Deseas continuar?</p>
            <div className="ur-modal-btns">
              <button type="button" className="ur-modal-confirmar" onClick={() => handleCancelar(modalCancelar)}>
                Sí, cancelar
              </button>
              <button type="button" className="ur-modal-volver" onClick={() => setModalCancelar(null)}>
                No, volver
              </button>
            </div>
          </div>
        </div>
      )}

      {formOk && (
        <div className="ur-toast">
          <i className="ri-checkbox-circle-line" />
          Reserva solicitada con éxito.
          <button type="button" onClick={() => setFormOk(false)} aria-label="Cerrar"><i className="ri-close-line" /></button>
        </div>
      )}
    </UserShell>
  );
};

const ReservationDetail = ({ reservation, onNew, onCancel }) => {
  const status = STATUS[reservation.estado];
  return (
    <div className="ur-detalle-wrap">
      <div className="ur-detalle-top">
        <h2><i className="ri-file-list-3-line" /> Detalle</h2>
        <span className={`ur-estado-badge ${status.className}`}><i className={status.icon} />{status.label}</span>
      </div>
      <p className="ur-detalle-id">{reservation.id}</p>
      <p className="ur-detalle-creada">Solicitud realizada el {formatDate(reservation.creadaEl)}</p>
      <div className="ur-detalle-items">
        <DetailItem icon="ri-calendar-event-line" label="Fecha" value={formatDate(reservation.fecha)} />
        <DetailItem icon="ri-time-line" label="Hora" value={`${reservation.hora} hrs`} />
        <DetailItem icon="ri-group-line" label="Personas" value={`${reservation.personas} personas`} />
        <DetailItem icon="ri-table-line" label="Mesa asignada" value={reservation.mesa} />
        {reservation.notas && <DetailItem icon="ri-message-2-line" label="Notas" value={reservation.notas} />}
      </div>
      <div className="ur-info-restaurante">
        <p className="ur-info-titulo">Información del restaurante</p>
        <div className="ur-info-item"><i className="ri-map-pin-2-line" /><span>5ta Avenida 12-34, Zona 10, Guatemala</span></div>
        <div className="ur-info-item"><i className="ri-phone-line" /><span>+502 1234 5678</span></div>
        <div className="ur-info-item"><i className="ri-time-line" /><span>Lun–Dom: 12:00 – 22:00</span></div>
      </div>
      <div className="ur-detalle-acciones">
        {["confirmada", "pendiente"].includes(reservation.estado) && (
          <button type="button" className="ur-cancelar-reserva-btn" onClick={onCancel}>
            <i className="ri-close-circle-line" /> Cancelar Reserva
          </button>
        )}
        <PrimaryButton icon="ri-add-line" onClick={onNew}>Nueva Reserva</PrimaryButton>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="ur-detalle-item">
    <i className={icon} />
    <div><small>{label}</small><p>{value}</p></div>
  </div>
);

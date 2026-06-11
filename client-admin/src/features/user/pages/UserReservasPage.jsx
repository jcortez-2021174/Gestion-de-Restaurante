import { useCallback, useMemo, useState } from "react";
import { obtenerDisponibles } from "../../../services/mesas.service";
import {
  cancelarMiReservacion,
  crearMiReservacion,
  obtenerMisReservaciones,
} from "../../../services/reservaciones.service";
import { UserShell } from "../components/UserShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
} from "../components/UserUi";
import "../styles/userreservas.css";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";

const STATUS = {
  PENDIENTE: { label: "Pendiente", className: "estado-pendiente", icon: "ri-time-line" },
  CONFIRMADA: { label: "Confirmada", className: "estado-confirmada", icon: "ri-checkbox-circle-line" },
  COMPLETADA: { label: "Completada", className: "estado-completada", icon: "ri-check-double-line" },
  CANCELADA: { label: "Cancelada", className: "estado-cancelada", icon: "ri-close-circle-line" },
};

const FILTERS = ["TODAS", ...Object.keys(STATUS)];
const initialForm = {
  mesaId: "",
  fecha: "",
  horaInicio: "19:00",
  horaFin: "20:30",
  personas: 2,
  notas: "",
};

const formatDate = (iso) => new Intl.DateTimeFormat("es-GT", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${iso}T00:00:00Z`));

export const UserReservasPage = () => {
  const [reservas, setReservas] = useState([]);
  const [mesas, setMesas] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [seleccionada, setSeleccionada] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [reservationData, tableData] = await Promise.all([
        obtenerMisReservaciones(),
        obtenerDisponibles(),
      ]);
      setReservas(reservationData);
      setMesas(tableData);
      setSeleccionada((current) => (
        reservationData.find((item) => item.id === current?.id) || reservationData[0] || null
      ));
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(loadData, 30000);

  const filtered = useMemo(
    () => reservas.filter((item) => filtro === "TODAS" || item.estado === filtro),
    [reservas, filtro]
  );

  const submit = async () => {
    if (!form.mesaId || !form.fecha || !form.horaInicio || !form.horaFin) {
      setError("Completa mesa, fecha y horario.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      const created = await crearMiReservacion(form);
      setSuccess("Reservacion creada y enviada al administrador.");
      setForm(initialForm);
      setMostrarFormulario(false);
      setSeleccionada(created);
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (reservation) => {
    if (!window.confirm("Cancelar esta reservacion?")) return;
    try {
      await cancelarMiReservacion(reservation.id);
      setSuccess("Reservacion cancelada.");
      await loadData();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    }
  };

  return (
    <UserShell contentClassName="ur-main">
      <SectionHeader
        eyebrow="Reservaciones Aurea"
        title="Mis Reservas"
        description="Tus cambios se sincronizan con el equipo del restaurante."
        action={<PrimaryButton icon="ri-calendar-add-line" onClick={() => setMostrarFormulario(true)}>Nueva reserva</PrimaryButton>}
      />

      {error && <ErrorState description={error} onRetry={loadData} />}
      {success && <div className="ur-toast"><i className="ri-checkbox-circle-line" />{success}<button onClick={() => setSuccess("")}><i className="ri-close-line" /></button></div>}

      <div className="ur-stats">
        <article className="ur-stat-card"><i className="ri-calendar-check-line" /><div><span className="ur-stat-num">{reservas.filter((item) => item.estado === "CONFIRMADA").length}</span><small>Confirmadas</small></div></article>
        <article className="ur-stat-card"><i className="ri-time-line" /><div><span className="ur-stat-num">{reservas.filter((item) => item.estado === "PENDIENTE").length}</span><small>Pendientes</small></div></article>
        <button className="ur-stat-card ur-stat-cta" onClick={() => setMostrarFormulario(true)}><i className="ri-add-circle-line" /><div><span className="ur-stat-num">Nueva</span><small>Hacer reserva</small></div></button>
      </div>

      <div className="ur-layout">
        <section className="ur-lista-panel">
          <div className="ur-lista-header"><h2><i className="ri-list-check-2" /> Historial</h2><SecondaryButton onClick={loadData}>Actualizar</SecondaryButton></div>
          <div className="ur-filtros">
            {FILTERS.map((filter) => <button key={filter} className={`ur-filtro-btn${filtro === filter ? " activo" : ""}`} onClick={() => setFiltro(filter)}>{filter === "TODAS" ? "Todas" : STATUS[filter].label}</button>)}
          </div>
          {loading ? <LoadingState title="Cargando reservas" /> : (
            <div className="ur-lista">
              {filtered.map((reservation) => {
                const status = STATUS[reservation.estado];
                return (
                  <button key={reservation.id} className={`ur-reserva-card${seleccionada?.id === reservation.id ? " activa" : ""}`} onClick={() => { setSeleccionada(reservation); setMostrarFormulario(false); }}>
                    <div className="ur-card-top"><span className="ur-card-id">#{reservation.id.slice(-8)}</span><span className={`ur-estado-badge ${status.className}`}><i className={status.icon} />{status.label}</span></div>
                    <div className="ur-card-info"><span><i className="ri-calendar-line" />{formatDate(reservation.fecha)}</span><span><i className="ri-time-line" />{reservation.horaInicio}</span><span><i className="ri-group-line" />{reservation.personas}</span></div>
                  </button>
                );
              })}
              {!filtered.length && <EmptyState title="No hay reservas" description="No encontramos reservaciones con este estado." />}
            </div>
          )}
        </section>

        <aside className="ur-detalle-panel">
          {mostrarFormulario ? (
            <div className="ur-form-wrap">
              <h2>Nueva reservacion</h2>
              <label className="ur-form-group"><span>Mesa</span><select className="ur-input" value={form.mesaId} onChange={(event) => setForm({ ...form, mesaId: event.target.value })}><option value="">Selecciona mesa</option>{mesas.filter((mesa) => mesa.capacidad >= form.personas).map((mesa) => <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero} - {mesa.capacidad} personas</option>)}</select></label>
              <label className="ur-form-group"><span>Fecha</span><input className="ur-input" type="date" min={new Date().toISOString().slice(0, 10)} value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} /></label>
              <label className="ur-form-group"><span>Inicio</span><input className="ur-input" type="time" value={form.horaInicio} onChange={(event) => setForm({ ...form, horaInicio: event.target.value })} /></label>
              <label className="ur-form-group"><span>Fin</span><input className="ur-input" type="time" value={form.horaFin} onChange={(event) => setForm({ ...form, horaFin: event.target.value })} /></label>
              <label className="ur-form-group"><span>Personas</span><input className="ur-input" type="number" min="1" max="50" value={form.personas} onChange={(event) => setForm({ ...form, personas: Number(event.target.value) })} /></label>
              <label className="ur-form-group"><span>Notas</span><textarea className="ur-input ur-textarea" value={form.notas} onChange={(event) => setForm({ ...form, notas: event.target.value })} /></label>
              <div className="ur-form-actions"><PrimaryButton disabled={saving} onClick={submit}>{saving ? "Guardando..." : "Reservar"}</PrimaryButton><SecondaryButton onClick={() => setMostrarFormulario(false)}>Cancelar</SecondaryButton></div>
            </div>
          ) : seleccionada ? (
            <div className="ur-detalle-wrap">
              <div className="ur-detalle-top"><h2>Detalle</h2><span className={`ur-estado-badge ${STATUS[seleccionada.estado].className}`}>{STATUS[seleccionada.estado].label}</span></div>
              <div className="ur-detalle-items">
                <Detail icon="ri-calendar-event-line" label="Fecha" value={formatDate(seleccionada.fecha)} />
                <Detail icon="ri-time-line" label="Horario" value={`${seleccionada.horaInicio} - ${seleccionada.horaFin}`} />
                <Detail icon="ri-group-line" label="Personas" value={seleccionada.personas} />
                <Detail icon="ri-table-line" label="Mesa" value={`Mesa ${seleccionada.mesaNumero || "por asignar"}`} />
                {seleccionada.notas && <Detail icon="ri-message-2-line" label="Notas" value={seleccionada.notas} />}
              </div>
              {["PENDIENTE", "CONFIRMADA"].includes(seleccionada.estado) && <button className="ur-cancelar-reserva-btn" onClick={() => cancel(seleccionada)}>Cancelar reservacion</button>}
            </div>
          ) : <EmptyState title="Selecciona una reserva" description="El detalle aparecera en este panel." />}
        </aside>
      </div>
    </UserShell>
  );
};

const Detail = ({ icon, label, value }) => (
  <div className="ur-detalle-item"><i className={icon} /><div><small>{label}</small><p>{value}</p></div></div>
);

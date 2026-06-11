import { useCallback, useMemo, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { listarClientes } from "../../../services/clientes.service";
import { obtenerTodas as obtenerMesas } from "../../../services/mesas.service";
import {
  actualizar,
  cambiarEstado,
  crear,
  obtenerTodas,
} from "../../../services/reservaciones.service";
import "../styles/reservations.css";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import { ExportButtons } from "../../../shared/components/ExportButtons";
import { printReservationVoucher } from "../../../shared/utils/exports";

const initialForm = {
  id: null,
  clienteId: "",
  mesaId: "",
  fecha: "",
  horaInicio: "19:00",
  horaFin: "20:30",
  personas: 2,
  estado: "PENDIENTE",
  notas: "",
};

const nextActions = {
  PENDIENTE: [
    { estado: "CONFIRMADA", label: "Confirmar" },
    { estado: "CANCELADA", label: "Cancelar" },
  ],
  CONFIRMADA: [
    { estado: "COMPLETADA", label: "Completar" },
    { estado: "CANCELADA", label: "Cancelar" },
  ],
};

export const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [clients, setClients] = useState([]);
  const [tables, setTables] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [reservationResponse, clientResponse, tableResponse] = await Promise.all([
        obtenerTodas(),
        listarClientes(),
        obtenerMesas(),
      ]);
      setReservations(reservationResponse.data || []);
      setClients(clientResponse.data || clientResponse || []);
      setTables(tableResponse || []);
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(load, 30000);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return reservations.filter((reservation) => (
      (!filter || reservation.estado === filter)
      && (!term || reservation.clienteNombre.toLowerCase().includes(term))
    ));
  }, [reservations, filter, search]);

  const save = async () => {
    try {
      setSaving(true);
      if (form.id) await actualizar(form.id, form);
      else await crear(form);
      setForm(null);
      await load();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const transition = async (reservation, estado) => {
    try {
      await cambiarEstado(reservation.id, estado);
      await load();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    }
  };

  return (
    <AdminLayout notificationCount={reservations.filter((item) => item.estado === "PENDIENTE").length}>
      <header className="admin-module-header">
        <div><span className="admin-eyebrow">Operacion en tiempo real</span><h1>Reservaciones</h1><p>Solicitudes del cliente y control de ocupacion.</p></div>
        <div className="admin-header-actions">
          <ExportButtons
            basename={`reservaciones-aurea-${new Date().toISOString().slice(0, 10)}`}
            title="Reporte de reservaciones"
            columns={[
              { key: "id", label: "ID" },
              { key: "clienteNombre", label: "Cliente" },
              { key: "mesaNumero", label: "Mesa" },
              { key: "fecha", label: "Fecha" },
              { key: "horaInicio", label: "Inicio" },
              { key: "horaFin", label: "Fin" },
              { key: "personas", label: "Personas" },
              { key: "estado", label: "Estado" },
            ]}
            rows={filtered}
            summary={`${filtered.length} reservaciones`}
          />
          <button className="btn-gold" onClick={() => setForm({ ...initialForm })}>Nueva reservacion</button>
        </div>
      </header>

      {error && <div className="admin-feedback error">{error}</div>}

      <section className="reservation-live-stats">
        {["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"].map((status) => (
          <article key={status}><strong>{reservations.filter((item) => item.estado === status).length}</strong><span>{status}</span></article>
        ))}
      </section>

      <section className="card reservation-live-card">
        <div className="menu-admin-toolbar">
          <input placeholder="Buscar cliente..." value={search} onChange={(event) => setSearch(event.target.value)} />
          <select value={filter} onChange={(event) => setFilter(event.target.value)}>
            <option value="">Todos los estados</option>
            {["PENDIENTE", "CONFIRMADA", "COMPLETADA", "CANCELADA"].map((status) => <option key={status}>{status}</option>)}
          </select>
          <button className="btn-outline" onClick={load}>Actualizar</button>
        </div>

        {loading ? <div className="loading-state">Cargando reservaciones...</div> : (
          <div className="reservation-live-list">
            {filtered.map((reservation) => (
              <article className="reservation-live-row" key={reservation.id}>
                <div><strong>{reservation.clienteNombre}</strong><span>#{reservation.id.slice(-8)}</span></div>
                <div><strong>{reservation.fecha}</strong><span>{reservation.horaInicio} - {reservation.horaFin}</span></div>
                <div><strong>Mesa {reservation.mesaNumero}</strong><span>{reservation.personas} personas</span></div>
                <span className={`reservation-status ${reservation.estado}`}>{reservation.estado}</span>
                <div className="reservation-actions">
                  <button onClick={() => printReservationVoucher(reservation)}><i className="ri-printer-line" /></button>
                  <button onClick={() => setForm({ ...reservation })}><i className="ri-edit-line" /></button>
                  {(nextActions[reservation.estado] || []).map((action) => (
                    <button key={action.estado} onClick={() => transition(reservation, action.estado)}>{action.label}</button>
                  ))}
                </div>
              </article>
            ))}
            {!filtered.length && <div className="empty-state">No hay reservaciones para este filtro.</div>}
          </div>
        )}
      </section>

      {form && (
        <div className="modal-overlay" onClick={() => setForm(null)}>
          <div className="modal-box" onClick={(event) => event.stopPropagation()}>
            <h2>{form.id ? "Editar reservacion" : "Nueva reservacion"}</h2>
            <div className="modal-form">
              <select value={form.clienteId} onChange={(event) => setForm({ ...form, clienteId: event.target.value })}>
                <option value="">Selecciona cliente</option>
                {clients.map((client) => <option key={client._id} value={client._id}>{client.nombre} {client.apellido}</option>)}
              </select>
              <select value={form.mesaId} onChange={(event) => setForm({ ...form, mesaId: event.target.value })}>
                <option value="">Selecciona mesa</option>
                {tables.filter((table) => table.capacidad >= form.personas).map((table) => <option key={table.id} value={table.id}>Mesa {table.numero} - {table.capacidad}</option>)}
              </select>
              <input type="date" value={form.fecha} onChange={(event) => setForm({ ...form, fecha: event.target.value })} />
              <input type="time" value={form.horaInicio} onChange={(event) => setForm({ ...form, horaInicio: event.target.value })} />
              <input type="time" value={form.horaFin} onChange={(event) => setForm({ ...form, horaFin: event.target.value })} />
              <input type="number" min="1" max="50" value={form.personas} onChange={(event) => setForm({ ...form, personas: Number(event.target.value) })} />
              <textarea placeholder="Notas" value={form.notas || ""} onChange={(event) => setForm({ ...form, notas: event.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="modal-cancel" onClick={() => setForm(null)}>Cancelar</button>
              <button className="modal-save" disabled={saving} onClick={save}>{saving ? "Guardando..." : "Guardar"}</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

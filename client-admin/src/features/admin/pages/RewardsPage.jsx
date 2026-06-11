import { useCallback, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import {
  crearRecompensa,
  editarRecompensa,
  eliminarRecompensa,
  listarRecompensasAdmin,
} from "../../../services/puntos.service";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import "../styles/puntos.css";

const empty = { id: null, nombre: "", descripcion: "", imagen: "", puntosRequeridos: 500, activa: true };

export const RewardsPage = () => {
  const [rewards, setRewards] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setRewards(await listarRecompensasAdmin());
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    }
  }, []);

  useSmartPolling(load, 30000);

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        nombre: form.nombre,
        descripcion: form.descripcion,
        imagen: form.imagen,
        puntosRequeridos: Number(form.puntosRequeridos),
        activa: form.activa,
      };
      if (form.id) await editarRecompensa(form.id, payload);
      else await crearRecompensa(payload);
      setForm(null);
      await load();
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <header className="admin-module-header">
        <div><span className="admin-eyebrow">Programa de fidelidad</span><h1>Recompensas Aurea</h1><p>Catálogo canjeable con puntos reales.</p></div>
        <button className="btn-gold" onClick={() => setForm({ ...empty })}>Nueva recompensa</button>
      </header>
      {error && <div className="admin-feedback error">{error}</div>}
      <section className="reward-admin-grid">
        {rewards.map((reward) => (
          <article className="card reward-admin-card" key={reward.id}>
            <img src={reward.imagen || "/plato1.jpeg"} alt={reward.nombre} />
            <div><h3>{reward.nombre}</h3><p>{reward.descripcion}</p><strong>{reward.puntosRequeridos} puntos</strong><span>{reward.activa ? "Activa" : "Inactiva"}</span></div>
            <div className="row-actions">
              <button onClick={() => setForm({ ...reward })}><i className="ri-edit-line" /></button>
              <button className="danger" onClick={async () => { await eliminarRecompensa(reward.id); await load(); }}><i className="ri-delete-bin-line" /></button>
            </div>
          </article>
        ))}
      </section>
      {form && <div className="modal-overlay" onClick={() => setForm(null)}>
        <div className="modal-box" onClick={(event) => event.stopPropagation()}>
          <h2>{form.id ? "Editar recompensa" : "Nueva recompensa"}</h2>
          <div className="modal-form">
            <input value={form.nombre} placeholder="Nombre" onChange={(event) => setForm({ ...form, nombre: event.target.value })} />
            <textarea value={form.descripcion} placeholder="Descripción" onChange={(event) => setForm({ ...form, descripcion: event.target.value })} />
            <input value={form.imagen} placeholder="URL de imagen" onChange={(event) => setForm({ ...form, imagen: event.target.value })} />
            <input type="number" min="1" value={form.puntosRequeridos} onChange={(event) => setForm({ ...form, puntosRequeridos: event.target.value })} />
            <label className="reward-active-field"><input type="checkbox" checked={form.activa} onChange={(event) => setForm({ ...form, activa: event.target.checked })} /> Recompensa activa</label>
          </div>
          <div className="modal-actions"><button className="modal-cancel" onClick={() => setForm(null)}>Cancelar</button><button className="modal-save" disabled={saving} onClick={save}>Guardar</button></div>
        </div>
      </div>}
    </AdminLayout>
  );
};

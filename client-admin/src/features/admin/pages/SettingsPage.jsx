import { useEffect, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { guardarConfiguracion, obtenerConfiguracion } from "../../../services/restaurante.service";
import "../styles/settings.css";

const initial = {
  nombre: "",
  telefono: "",
  correo: "",
  direccion: "",
  logo: "",
  banner: "",
  redesSociales: { facebook: "", instagram: "", whatsapp: "" },
};

const readImage = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = () => resolve(reader.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
});

export const SettingsPage = () => {
  const [form, setForm] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    obtenerConfiguracion()
      .then((data) => setForm({
        ...initial,
        ...data,
        redesSociales: { ...initial.redesSociales, ...data.redesSociales },
      }))
      .catch((requestError) => setError(requestError.userMessage || requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    try {
      setSaving(true);
      setError("");
      setForm(await guardarConfiguracion(form));
      setSuccess("Configuracion guardada correctamente.");
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const setSocial = (field, value) => setForm({
    ...form,
    redesSociales: { ...form.redesSociales, [field]: value },
  });

  return (
    <AdminLayout notificationCount={0}>
      <header className="admin-module-header">
        <div><span className="admin-eyebrow">Identidad del restaurante</span><h1>Configuracion</h1><p>Informacion persistida y utilizada por Aurea.</p></div>
        <button className="btn-gold" disabled={saving || loading} onClick={save}>{saving ? "Guardando..." : "Guardar cambios"}</button>
      </header>

      {error && <div className="admin-feedback error">{error}</div>}
      {success && <div className="admin-feedback success">{success}</div>}
      {loading ? <div className="loading-state">Cargando configuracion...</div> : (
        <section className="settings-live-grid">
          <div className="card settings-live-form">
            <h2>Datos generales</h2>
            <label><span>Nombre</span><input value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} /></label>
            <label><span>Telefono</span><input value={form.telefono} onChange={(event) => setForm({ ...form, telefono: event.target.value })} /></label>
            <label><span>Correo</span><input type="email" value={form.correo} onChange={(event) => setForm({ ...form, correo: event.target.value })} /></label>
            <label><span>Direccion</span><textarea value={form.direccion} onChange={(event) => setForm({ ...form, direccion: event.target.value })} /></label>
            <h2>Redes sociales</h2>
            <label><span>Facebook</span><input value={form.redesSociales.facebook} onChange={(event) => setSocial("facebook", event.target.value)} /></label>
            <label><span>Instagram</span><input value={form.redesSociales.instagram} onChange={(event) => setSocial("instagram", event.target.value)} /></label>
            <label><span>WhatsApp</span><input value={form.redesSociales.whatsapp} onChange={(event) => setSocial("whatsapp", event.target.value)} /></label>
          </div>

          <aside className="settings-live-assets">
            <AssetEditor title="Logo" value={form.logo} fallback="/logo.png" onChange={(logo) => setForm({ ...form, logo })} />
            <AssetEditor title="Banner principal" value={form.banner} fallback="/Plato5.png" onChange={(banner) => setForm({ ...form, banner })} />
          </aside>
        </section>
      )}
    </AdminLayout>
  );
};

const AssetEditor = ({ title, value, fallback, onChange }) => (
  <div className="card settings-asset-card">
    <h2>{title}</h2>
    <img src={value || fallback} alt={title} />
    <input type="file" accept="image/*" onChange={async (event) => {
      const file = event.target.files?.[0];
      if (file) onChange(await readImage(file));
    }} />
  </div>
);

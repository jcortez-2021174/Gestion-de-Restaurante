import { useCallback, useMemo, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { obtenerDashboard } from "../../../services/clientes.service";
import { ExportButtons } from "../../../shared/components/ExportButtons";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import "../styles/clients.css";

export const ClientsPage = () => {
  const [clientsData, setClientsData] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getClientsDashboard = useCallback(async () => {
    try {
      setError("");
      const response = await obtenerDashboard();
      const clients = response.data || response.clientes || response || [];
      setClientsData(clients);
      setSelectedClient((current) => (
        clients.find((client) => client._id === current?._id) || clients[0] || null
      ));
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || "No se pudieron cargar los clientes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(getClientsDashboard, 30000);

  const filteredClients = useMemo(() => {
    const term = search.trim().toLowerCase();
    return clientsData.filter((client) => (
      !term
      || client.name?.toLowerCase().includes(term)
      || client.email?.toLowerCase().includes(term)
      || client.phone?.toLowerCase().includes(term)
    ));
  }, [search, clientsData]);

  return (
    <AdminLayout>
      <header className="admin-module-header">
        <div>
          <span className="admin-eyebrow">Relacion con clientes</span>
          <h1>Clientes</h1>
          <p>Actividad, preferencias e historial consolidado de cada cliente.</p>
        </div>
        <div className="clients-header-actions">
          <ExportButtons
            basename={`clientes-aurea-${new Date().toISOString().slice(0, 10)}`}
            title="Reporte de clientes"
            columns={[
              { key: "_id", label: "ID" },
              { key: "name", label: "Cliente" },
              { key: "email", label: "Correo" },
              { key: "phone", label: "Telefono" },
              { key: "totalPedidos", label: "Pedidos" },
            ]}
            rows={filteredClients}
            summary={`${filteredClients.length} clientes`}
          />
          <label className="search-box">
            <i className="ri-search-line" />
            <input
              type="search"
              placeholder="Buscar cliente..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>
      </header>

      {error && <div className="admin-feedback error">{error}</div>}

      <section className="clients-layout">
        <div className="clients-content card">
          <div className="clients-table-header">
            <span>Cliente</span><span>Contacto</span><span>Favorito</span><span>Ultima visita</span><span>Pedidos</span>
          </div>
          <div className="clients-table">
            {loading ? (
              <div className="loading-state">Cargando clientes...</div>
            ) : filteredClients.length === 0 ? (
              <div className="empty-history">No hay clientes para esta busqueda.</div>
            ) : filteredClients.map((client) => (
              <button
                type="button"
                className={`client-row${selectedClient?._id === client._id ? " selected" : ""}`}
                key={client._id}
                onClick={() => setSelectedClient(client)}
              >
                <div className="client-info">
                  <div className="client-avatar">{client.initials}</div>
                  <div><h4>{client.name}</h4><span>{client.email}</span></div>
                </div>
                <div className="client-contact"><i className="ri-phone-line" /><span>{client.phone || "Sin telefono"}</span></div>
                <div className="favorite-food">
                  <img src={client.favoriteImage || "/plato1.jpeg"} alt="" />
                  <div><small>Favorito</small><strong>{client.productoFavorito || "Sin datos"}</strong></div>
                </div>
                <div className="client-visit">{client.ultimaVisita || "Sin visitas"}</div>
                <strong className="client-order-count">{client.totalPedidos || 0}</strong>
              </button>
            ))}
          </div>
        </div>

        <aside className="client-details card">
          {selectedClient ? (
            <>
              <div className="client-profile">
                <div className="profile-avatar">{selectedClient.initials}</div>
                <div>
                  <h2>{selectedClient.name}</h2>
                  <span className="vip-badge">{selectedClient.totalPedidos >= 10 ? "Cliente Frecuente" : "Cliente Aurea"}</span>
                  <p>{selectedClient.email}</p>
                  <p>{selectedClient.phone}</p>
                </div>
              </div>

              <div className="favorite-food-card">
                <img src={selectedClient.favoriteImage || "/plato1.jpeg"} alt="" />
                <div><small>Plato favorito</small><h3>{selectedClient.productoFavorito || "Sin datos"}</h3><p>Preferencia calculada desde pedidos reales.</p></div>
              </div>

              <div className="detail-section">
                <h3>Resumen de actividad</h3>
                <div className="stats-grid">
                  <div className="stat-box"><i className="ri-wallet-3-line" /><div><span>Compras</span><strong>Q{selectedClient.totalCompras || 0}</strong></div></div>
                  <div className="stat-box"><i className="ri-shopping-bag-line" /><div><span>Pedidos</span><strong>{selectedClient.totalPedidos || 0}</strong></div></div>
                  <div className="stat-box"><i className="ri-calendar-check-line" /><div><span>Registro</span><strong>{selectedClient.fechaRegistro || "-"}</strong></div></div>
                  <div className="stat-box"><i className="ri-time-line" /><div><span>Ultima visita</span><strong>{selectedClient.ultimaVisita || "-"}</strong></div></div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Historial reciente</h3>
                <div className="history-list">
                  {selectedClient.historial?.length > 0 ? selectedClient.historial.map((pedido) => (
                    <div className="history-item" key={pedido.codigo}>
                      <div><h4>Pedido #{pedido.codigo}</h4><span>{pedido.fecha}</span></div>
                      <strong>Q{pedido.total}</strong>
                    </div>
                  )) : <div className="empty-history">No hay historial reciente.</div>}
                </div>
              </div>
            </>
          ) : (
            <div className="empty-history">Selecciona un cliente para ver su perfil.</div>
          )}
        </aside>
      </section>
    </AdminLayout>
  );
};

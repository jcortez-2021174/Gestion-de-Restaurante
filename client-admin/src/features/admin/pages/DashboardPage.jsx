import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { obtenerEstadisticas } from "../../../services/dashboard.service";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import "../styles/dashboard.css";

const money = (value) => `Q${Number(value || 0).toFixed(2)}`;
const date = (value) => new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

export const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setStats(await obtenerEstadisticas());
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(load, 30000);

  const metrics = stats ? [
    ["Ventas del dia", money(stats.ventasDia), "ri-money-dollar-circle-line"],
    ["Ventas del mes", money(stats.ventasMes), "ri-line-chart-line"],
    ["Pedidos del dia", stats.pedidosDia, "ri-shopping-basket-line"],
    ["Pedidos activos", stats.pedidosActivos, "ri-shopping-bag-3-line"],
    ["Reservas activas", stats.reservasActivas, "ri-calendar-check-line"],
    ["Clientes", stats.clientesTotales, "ri-user-heart-line"],
    ["Productos disponibles", stats.productosDisponibles, "ri-restaurant-line"],
    ["Productos agotados", stats.productosAgotados, "ri-alert-line"],
  ] : [];

  return (
    <AdminLayout notificationCount={stats?.pedidosActivos || 0}>
      <header className="admin-module-header">
        <div><span className="admin-eyebrow">Centro de operaciones</span><h1>Dashboard</h1><p>Actividad real del restaurante, actualizada de forma inteligente.</p></div>
        <button className="btn-outline" onClick={load}>Actualizar</button>
      </header>
      {error && <div className="admin-feedback error">{error}</div>}
      {loading && !stats ? <div className="loading-state">Cargando indicadores...</div> : (
        <>
          <section className="dashboard-live-metrics">
            {metrics.map(([label, value, icon]) => (
              <article key={label}><i className={icon} /><div><span>{label}</span><strong>{value}</strong></div></article>
            ))}
          </section>

          <section className="dashboard-live-grid">
            <div className="card dashboard-live-panel dashboard-chart-panel">
              <div className="section-header"><h2>Ingresos ultimos 7 dias</h2><span>Pedidos entregados</span></div>
              <div className="dashboard-bars">
                {(stats?.ventasSemana || []).map((item) => {
                  const max = Math.max(...stats.ventasSemana.map((day) => day.total), 1);
                  return (
                    <div className="dashboard-bar-column" key={item._id}>
                      <strong>{money(item.total)}</strong>
                      <span style={{ height: `${Math.max(8, (item.total / max) * 100)}%` }} />
                      <small>{item._id.slice(5)}</small>
                    </div>
                  );
                })}
                {!stats?.ventasSemana?.length && <div className="empty-state">Aun no hay ventas entregadas esta semana.</div>}
              </div>
            </div>

            <div className="card dashboard-live-panel">
              <div className="section-header"><h2>Pedidos por estado</h2></div>
              {(stats?.pedidosPorEstado || []).map((item) => (
                <div className="dashboard-live-row" key={item._id}>
                  <span className={`live-status ${item._id}`}>{item._id}</span>
                  <strong>{item.total}</strong>
                </div>
              ))}
            </div>

            <div className="card dashboard-live-panel">
              <div className="section-header"><h2>Top productos</h2><Link to="/reports">Ver reportes</Link></div>
              {(stats?.topProductos || []).map((product, index) => (
                <div className="dashboard-live-row" key={product._id || product.nombre}>
                  <span className="dashboard-rank">{index + 1}</span>
                  <div><strong>{product.nombre}</strong><span>{product.cantidad} unidades</span></div>
                  <strong>{money(product.ingresos)}</strong>
                </div>
              ))}
              {!stats?.topProductos?.length && <div className="empty-state">Aun no hay ventas registradas.</div>}
            </div>

            <div className="card dashboard-live-panel">
              <div className="section-header"><h2>Ultimos pedidos</h2><Link to="/orders">Abrir pedidos</Link></div>
              {(stats?.ultimosPedidos || []).map((order) => (
                <div className="dashboard-live-row" key={order.id}>
                  <div><strong>{order.cliente}</strong><span>{date(order.fecha)}</span></div>
                  <span className={`live-status ${order.estado}`}>{order.estado}</span>
                  <strong>{money(order.total)}</strong>
                </div>
              ))}
              {!stats?.ultimosPedidos?.length && <div className="empty-state">No hay pedidos recientes.</div>}
            </div>

            <div className="card dashboard-live-panel">
              <div className="section-header"><h2>Ultimas reservaciones</h2><Link to="/reservations">Abrir reservas</Link></div>
              {(stats?.ultimasReservaciones || []).map((reservation) => (
                <div className="dashboard-live-row" key={reservation.id}>
                  <div><strong>{reservation.cliente}</strong><span>{String(reservation.fecha).slice(0, 10)}</span></div>
                  <span>Mesa {reservation.mesa || "-"}</span>
                  <span className={`live-status ${reservation.estado}`}>{reservation.estado}</span>
                </div>
              ))}
              {!stats?.ultimasReservaciones?.length && <div className="empty-state">No hay reservaciones recientes.</div>}
            </div>
          </section>
        </>
      )}
    </AdminLayout>
  );
};

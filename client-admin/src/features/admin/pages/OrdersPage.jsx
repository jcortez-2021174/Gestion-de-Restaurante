import { useCallback, useMemo, useState } from "react";
import { AdminLayout } from "../../../shared/layouts/AdminLayout";
import { cambiarEstado, obtenerTodos } from "../../../services/pedidos.service";
import { listarProductos } from "../../../services/productos.service";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";
import { ExportButtons } from "../../../shared/components/ExportButtons";
import { printOrderTicket } from "../../../shared/utils/exports";
import "../styles/orders.css";

const STATUS_FILTERS = [
  { value: "Todos", label: "Todos" },
  { value: "Pendiente", label: "Pendientes" },
  { value: "EnPreparacion", label: "En preparacion" },
  { value: "Listo", label: "Listos" },
  { value: "Entregado", label: "Entregados" },
  { value: "Cancelado", label: "Cancelados" },
];

const NEXT_ACTIONS = {
  Pendiente: [
    { estado: "EnPreparacion", label: "Aceptar pedido", className: "btn-success" },
    { estado: "Cancelado", label: "Cancelar", className: "btn-danger" },
  ],
  EnPreparacion: [
    { estado: "Listo", label: "Marcar listo", className: "btn-gold" },
    { estado: "Cancelado", label: "Cancelar", className: "btn-danger" },
  ],
  Listo: [
    { estado: "Entregado", label: "Marcar entregado", className: "btn-outline-action" },
    { estado: "Cancelado", label: "Cancelar", className: "btn-danger" },
  ],
  Entregado: [],
  Cancelado: [],
};

const formatMoney = (value) => `Q${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => new Intl.DateTimeFormat("es-GT", {
  dateStyle: "short",
  timeStyle: "short",
}).format(new Date(value));

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [orderData, productResponse] = await Promise.all([
        obtenerTodos(),
        listarProductos(),
      ]);
      const products = productResponse?.data || [];
      setOrders(orderData);
      setProductImages(Object.fromEntries(products.map((product) => [
        String(product._id || product.id),
        product.imagen || "/plato1.jpeg",
      ])));
      setSelectedOrder((current) => {
        if (!current) return orderData[0] || null;
        return orderData.find((order) => order.id === current.id) || orderData[0] || null;
      });
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || "No se pudieron cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(loadOrders, 20000);

  const visibleOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === "Todos" || order.estado === filter;
      const matchesSearch = !normalizedSearch
        || order.id.toLowerCase().includes(normalizedSearch)
        || order.clienteNombre.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const activeCount = orders.filter((order) => !["Entregado", "Cancelado"].includes(order.estado)).length;

  const updateOrderStatus = async (estado) => {
    if (!selectedOrder) return;
    try {
      setUpdating(true);
      setError("");
      const updated = await cambiarEstado(selectedOrder.id, estado);
      setOrders((current) => current.map((order) => order.id === updated.id ? updated : order));
      setSelectedOrder(updated);
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || "No se pudo actualizar el estado.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout notificationCount={activeCount}>
      <header className="admin-module-header">
        <div>
          <span className="admin-eyebrow">Operacion de cocina</span>
          <h1>Pedidos Aurea</h1>
          <p>Control POS de pedidos, productos y estados en tiempo real.</p>
        </div>
        <div className="admin-header-actions">
          <ExportButtons
            basename={`pedidos-aurea-${new Date().toISOString().slice(0, 10)}`}
            title="Reporte de pedidos"
            columns={[
              { key: "id", label: "ID" },
              { key: "clienteNombre", label: "Cliente" },
              { key: "estado", label: "Estado" },
              { key: "total", label: "Total" },
              { key: "fechaCreacion", label: "Fecha" },
            ]}
            rows={visibleOrders}
            summary={`${visibleOrders.length} pedidos`}
          />
          <button className="btn-outline-small" type="button" onClick={loadOrders}>
            <i className="ri-refresh-line" /> Actualizar
          </button>
        </div>
      </header>

      {error && <div className="admin-feedback error">{error}</div>}

      <section className="orders-layout">
        <div className="orders-content card">
          <div className="orders-top">
            <div className="tabs">
              {STATUS_FILTERS.map((status) => (
                <button
                  type="button"
                  key={status.value}
                  className={filter === status.value ? "active" : ""}
                  onClick={() => setFilter(status.value)}
                >
                  {status.label}
                </button>
              ))}
            </div>
            <div className="top-actions">
              <label className="orders-search">
                <i className="ri-search-line" />
                <input
                  type="search"
                  placeholder="Buscar pedido o cliente..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="orders-table">
            {loading ? (
              <div className="loading-state">Cargando pedidos...</div>
            ) : visibleOrders.length === 0 ? (
              <div className="empty-orders">No hay pedidos para este filtro.</div>
            ) : visibleOrders.map((order) => (
              <button
                type="button"
                className={`order-row${selectedOrder?.id === order.id ? " is-selected" : ""}`}
                key={order.id}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="order-id">
                  <h4>#{order.id.slice(-8)}</h4>
                  <span>{formatDate(order.fechaCreacion)}</span>
                </div>
                <div className="order-client">
                  <h4>{order.clienteNombre}</h4>
                  <span>{order.productos.length} productos</span>
                </div>
                <div className="order-type">
                  <h4>{order.mesaId ? "Restaurante" : "Sin mesa"}</h4>
                  <span>{order.mesaId || "Pedido cliente"}</span>
                </div>
                <div className={`status ${order.estado}`}>{order.estado}</div>
                <div className="order-total">{formatMoney(order.total)}</div>
                <span className="btn-view">Ver</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="order-details card">
          {selectedOrder ? (
            <>
              <div className="order-detail-heading">
                <div><span className="admin-eyebrow">Detalle POS</span><h2>Pedido #{selectedOrder.id.slice(-8)}</h2></div>
                <span className={`status ${selectedOrder.estado}`}>{selectedOrder.estado}</span>
              </div>

              <div className="detail-box">
                <p><strong>Cliente</strong><span>{selectedOrder.clienteNombre}</span></p>
                <p><strong>Fecha</strong><span>{formatDate(selectedOrder.fechaCreacion)}</span></p>
                <p><strong>Mesa</strong><span>{selectedOrder.mesaId || "Sin mesa asignada"}</span></p>
              </div>

              <div className="products-list">
                {selectedOrder.productos.map((product) => (
                  <div className="product-item" key={product.productoId}>
                    <img src={productImages[product.productoId] || "/plato1.jpeg"} alt={product.nombre} />
                    <div>
                      <h4>{product.nombre}</h4>
                      <span>{product.cantidad} x {formatMoney(product.precioUnitario)}</span>
                    </div>
                    <strong>{formatMoney(product.totalLinea)}</strong>
                  </div>
                ))}
              </div>

              <div className="totals">
                <div><span>Subtotal</span><strong>{formatMoney(selectedOrder.subtotal)}</strong></div>
                <div className="total-final"><span>Total</span><strong>{formatMoney(selectedOrder.total)}</strong></div>
              </div>

              <div className="actions order-detail-actions">
                <button className="btn-outline-action" type="button" onClick={() => printOrderTicket(selectedOrder, { productImages })}>
                  <i className="ri-printer-line" /> Imprimir ticket
                </button>
                {(NEXT_ACTIONS[selectedOrder.estado] || []).map((action) => (
                  <button
                    type="button"
                    key={action.estado}
                    className={action.className}
                    disabled={updating}
                    onClick={() => updateOrderStatus(action.estado)}
                  >
                    {updating ? "Actualizando..." : action.label}
                  </button>
                ))}
                {NEXT_ACTIONS[selectedOrder.estado]?.length === 0 && (
                  <p className="order-terminal-message">Este pedido no tiene mas transiciones.</p>
                )}
              </div>
            </>
          ) : (
            <div className="empty-orders">Selecciona un pedido.</div>
          )}
        </aside>
      </section>
    </AdminLayout>
  );
};

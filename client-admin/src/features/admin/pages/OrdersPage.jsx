import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  cambiarEstado,
  obtenerTodos,
} from '../../../services/pedidos.service';
import '../styles/orders.css';
import { useSmartPolling } from '../../../shared/hooks/useSmartPolling';
import { ExportButtons } from '../../../shared/components/ExportButtons';
import { printAureaDocument } from '../../../shared/utils/exports';

const STATUS_FILTERS = [
  { value: 'Todos', label: 'Todos' },
  { value: 'Pendiente', label: 'Pendientes' },
  { value: 'EnPreparacion', label: 'En preparacion' },
  { value: 'Listo', label: 'Listos' },
  { value: 'Entregado', label: 'Entregados' },
  { value: 'Cancelado', label: 'Cancelados' },
];

const NEXT_ACTIONS = {
  Pendiente: [
    { estado: 'EnPreparacion', label: 'Aceptar pedido', className: 'btn-success' },
    { estado: 'Cancelado', label: 'Cancelar', className: 'btn-danger' },
  ],
  EnPreparacion: [
    { estado: 'Listo', label: 'Marcar listo', className: 'btn-gold' },
    { estado: 'Cancelado', label: 'Cancelar', className: 'btn-danger' },
  ],
  Listo: [
    { estado: 'Entregado', label: 'Marcar entregado', className: 'btn-outline-action' },
    { estado: 'Cancelado', label: 'Cancelar', className: 'btn-danger' },
  ],
  Entregado: [],
  Cancelado: [],
};

const formatMoney = (value) => `Q${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => new Intl.DateTimeFormat('es-GT', {
  dateStyle: 'short',
  timeStyle: 'short',
}).format(new Date(value));

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const data = await obtenerTodos();
      setOrders(data);
      setSelectedOrder((current) => {
        if (!current) return data[0] || null;
        return data.find((order) => order.id === current.id) || data[0] || null;
      });
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || 'No se pudieron cargar los pedidos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useSmartPolling(loadOrders, 20000);

  const visibleOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesFilter = filter === 'Todos' || order.estado === filter;
      const matchesSearch =
        !normalizedSearch ||
        order.id.toLowerCase().includes(normalizedSearch) ||
        order.clienteNombre.toLowerCase().includes(normalizedSearch);
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, search]);

  const activeCount = orders.filter(
    (order) => !['Entregado', 'Cancelado'].includes(order.estado)
  ).length;

  const updateOrderStatus = async (estado) => {
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      setError('');
      const updated = await cambiarEstado(selectedOrder.id, estado);
      setOrders((current) => current.map((order) => (
        order.id === updated.id ? updated : order
      )));
      setSelectedOrder(updated);
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || 'No se pudo actualizar el estado.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea" />
        </div>
        <ul className="menu">
          <Link to="/dashboard" className="menu-link"><li><i className="ri-home-5-line" /> Inicio</li></Link>
          <Link to="/menu" className="menu-link"><li><i className="ri-restaurant-line" /> Menu</li></Link>
          <Link to="/orders" className="menu-link">
            <li className="active">
              <i className="ri-shopping-cart-line" /> Pedidos
              <span className="badge">{activeCount}</span>
            </li>
          </Link>
          <Link to="/reservations" className="menu-link"><li><i className="ri-calendar-line" /> Reservas</li></Link>
          <Link to="/tables" className="menu-link"><li><i className="ri-table-line" /> Mesas</li></Link>
          <Link to="/clients" className="menu-link"><li><i className="ri-user-line" /> Clientes</li></Link>
          <Link to="/reports" className="menu-link"><li><i className="ri-bar-chart-line" /> Reportes</li></Link>
          <Link to="/settings" className="menu-link"><li><i className="ri-settings-3-line" /> Configuracion</li></Link>
        </ul>
      </aside>

      <main className="main">
        <div className="header">
          <div>
            <h1>Pedidos Aurea</h1>
            <p>Gestion de pedidos persistidos en MongoDB.</p>
          </div>
          <div className="user-box">
            <div className="notification">
              <i className="ri-notification-3-line" />
              <span className="badge">{activeCount}</span>
            </div>
            <div className="divider" />
            <div className="user">
              <i className="ri-user-line" />
              <div className="user-info">
                <span>Administrador</span>
                <small>ADMIN_ROLE</small>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-state" style={{ marginBottom: '16px' }}>
            <p>{error}</p>
          </div>
        )}

        <section className="orders-layout">
          <div className="orders-content card">
            <div className="orders-top">
              <div className="tabs">
                {STATUS_FILTERS.map((status) => (
                  <button
                    key={status.value}
                    className={filter === status.value ? 'active' : ''}
                    onClick={() => setFilter(status.value)}
                  >
                    {status.label}
                  </button>
                ))}
              </div>
              <div className="top-actions">
                <ExportButtons
                  basename={`pedidos-aurea-${new Date().toISOString().slice(0, 10)}`}
                  title="Reporte de pedidos"
                  columns={[
                    { key: 'id', label: 'ID' },
                    { key: 'clienteNombre', label: 'Cliente' },
                    { key: 'estado', label: 'Estado' },
                    { key: 'total', label: 'Total' },
                    { key: 'fechaCreacion', label: 'Fecha' },
                  ]}
                  rows={visibleOrders}
                  summary={`${visibleOrders.length} pedidos`}
                />
                <button className="btn-outline-small" onClick={loadOrders}>
                  <i className="ri-refresh-line" /> Actualizar
                </button>
                <input
                  type="search"
                  placeholder="Buscar pedido o cliente..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
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
                  className="order-row"
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
                    <h4>{order.mesaId ? 'Restaurante' : 'Sin mesa'}</h4>
                    <span>{order.mesaId || 'Pedido cliente'}</span>
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
                <h2>DETALLE DEL PEDIDO</h2>
                <div className="detail-top">
                  <span className="badge-new">{selectedOrder.estado}</span>
                  <h3>#{selectedOrder.id.slice(-8)}</h3>
                </div>

                <div className="detail-box">
                  <p><strong>Cliente:</strong><br />{selectedOrder.clienteNombre}</p>
                  <p><strong>Fecha:</strong><br />{formatDate(selectedOrder.fechaCreacion)}</p>
                  <p><strong>Mesa:</strong><br />{selectedOrder.mesaId || 'Sin mesa asignada'}</p>
                </div>

                <div className="products-list">
                  {selectedOrder.productos.map((product) => (
                    <div className="product-item" key={product.productoId}>
                      <div>
                        <h4>{product.nombre}</h4>
                        <span>{product.cantidad} x {formatMoney(product.precioUnitario)}</span>
                      </div>
                      <strong>{formatMoney(product.totalLinea)}</strong>
                    </div>
                  ))}
                </div>

                <div className="totals">
                  <div className="total-final">
                    <span>Subtotal</span>
                    <strong>{formatMoney(selectedOrder.subtotal)}</strong>
                  </div>
                  <div className="total-final">
                    <span>Total</span>
                    <strong>{formatMoney(selectedOrder.total)}</strong>
                  </div>
                </div>

                <div className="actions">
                  <button className="btn-outline-action" onClick={() => printAureaDocument({
                    title: `Ticket pedido #${selectedOrder.id.slice(-8)}`,
                    subtitle: `${selectedOrder.clienteNombre} · ${formatDate(selectedOrder.fechaCreacion)}`,
                    content: `<table><thead><tr><th>Producto</th><th>Cantidad</th><th>Total</th></tr></thead><tbody>${selectedOrder.productos.map((product) => `<tr><td>${product.nombre}</td><td>${product.cantidad}</td><td>${formatMoney(product.totalLinea)}</td></tr>`).join("")}</tbody></table><p class="total">Total: ${formatMoney(selectedOrder.total)}</p>`,
                  })}>Imprimir ticket</button>
                  {(NEXT_ACTIONS[selectedOrder.estado] || []).map((action) => (
                    <button
                      key={action.estado}
                      className={action.className}
                      disabled={updating}
                      onClick={() => updateOrderStatus(action.estado)}
                    >
                      {updating ? 'Actualizando...' : action.label}
                    </button>
                  ))}
                  {NEXT_ACTIONS[selectedOrder.estado]?.length === 0 && (
                    <p style={{ color: '#888' }}>Este pedido no tiene mas transiciones.</p>
                  )}
                </div>
              </>
            ) : (
              <div className="empty-orders">Selecciona un pedido.</div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
};

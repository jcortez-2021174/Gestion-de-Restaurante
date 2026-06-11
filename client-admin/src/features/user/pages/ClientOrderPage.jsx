import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useCartStore } from '../store/carStore';
import { crear, obtenerMisPedidos } from '../../../services/pedidos.service';
import '../styles/client-orders.css';

const formatMoney = (value) => `Q${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => new Intl.DateTimeFormat('es-GT', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

export const ClientOrderPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const carrito = useCartStore((state) => state.carrito);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const eliminarItem = useCartStore((state) => state.eliminarItem);
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito);
  const navigate = useNavigate();

  const [pedidos, setPedidos] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadHistory = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setHistoryLoading(true);
      setHistoryError('');
      setPedidos(await obtenerMisPedidos());
    } catch (error) {
      setHistoryError(error.userMessage || error.message || 'No se pudo cargar el historial.');
    } finally {
      if (!silent) setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
    const interval = window.setInterval(() => loadHistory({ silent: true }), 15000);
    return () => window.clearInterval(interval);
  }, [loadHistory]);

  const estimatedTotal = useMemo(
    () => carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [carrito]
  );

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError('');
      setSuccessMessage('');
      const pedido = await crear(carrito);
      vaciarCarrito();
      setSuccessMessage(`Pedido ${pedido.id} creado correctamente.`);
      await loadHistory();
    } catch (error) {
      setCheckoutError(error.userMessage || error.message || 'No se pudo crear el pedido.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container client-orders-page">
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>
        <ul className="menu">
          <Link to="/home" className="menu-link"><li><i className="ri-home-4-line" /> Inicio</li></Link>
          <Link to="/user/menu" className="menu-link"><li><i className="ri-restaurant-line" /> Menu</li></Link>
          <Link to="/user/orders" className="menu-link">
            <li className="active">
              <i className="ri-motorbike-line" /> Pedidos
              {carrito.length > 0 && <span className="menu-badge">{carrito.length}</span>}
            </li>
          </Link>
          <Link to="/user/reservations" className="menu-link"><li><i className="ri-calendar-line" /> Reservas</li></Link>
          <Link to="/user/nosotros" className="menu-link"><li><i className="ri-group-line" /> Sobre Nosotros</li></Link>
        </ul>
      </aside>

      <main className="main client-orders-main">
        <div className="client-orders-header">
          <div>
            <h1>Mis pedidos</h1>
            <p>Confirma tu carrito y consulta el estado actualizado de cada orden.</p>
          </div>
          <div className="menu-user-pill">
            <i className="ri-user-line" />
            <div>
              <span className="menu-user-name">{user?.username || 'Cliente'}</span>
              <small className="menu-user-role">Cliente Aurea</small>
            </div>
            <button onClick={handleLogout} className="btn-mini" aria-label="Cerrar sesion">
              <i className="ri-logout-box-line" />
            </button>
          </div>
        </div>

        <div className="client-orders-grid">
          <section className="client-orders-card">
            <div className="client-section-title">
              <h2>Checkout</h2>
              <Link to="/user/menu">Agregar productos</Link>
            </div>

            {carrito.length === 0 ? (
              <div className="client-empty-state">
                <i className="ri-shopping-bag-line" />
                <h3>Tu carrito esta vacio</h3>
                <p>Selecciona productos reales desde el menu.</p>
              </div>
            ) : (
              <>
                <div className="client-cart-list">
                  {carrito.map((item) => (
                    <article className="client-cart-item" key={item.id}>
                      <img src={item.imagen} alt={item.nombre} />
                      <div className="client-cart-copy">
                        <h3>{item.nombre}</h3>
                        <span>{formatMoney(item.precio)} por unidad</span>
                      </div>
                      <div className="client-quantity">
                        <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                        <strong>{item.cantidad}</strong>
                        <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                      </div>
                      <strong>{formatMoney(item.precio * item.cantidad)}</strong>
                      <button
                        className="client-remove"
                        onClick={() => eliminarItem(item.id)}
                        aria-label={`Eliminar ${item.nombre}`}
                      >
                        <i className="ri-delete-bin-line" />
                      </button>
                    </article>
                  ))}
                </div>

                <div className="client-checkout-summary">
                  <div>
                    <span>Total estimado</span>
                    <strong>{formatMoney(estimatedTotal)}</strong>
                  </div>
                  <small>El backend valida disponibilidad y recalcula el precio final.</small>
                </div>

                {checkoutError && <div className="client-message error">{checkoutError}</div>}
                {successMessage && <div className="client-message success">{successMessage}</div>}

                <button
                  className="btn-gold client-checkout-button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? 'Confirmando pedido...' : 'Confirmar y pagar'}
                </button>
              </>
            )}
          </section>

          <section className="client-orders-card">
            <div className="client-section-title">
              <h2>Historial</h2>
              <button onClick={() => loadHistory()} disabled={historyLoading}>
                <i className="ri-refresh-line" /> Actualizar
              </button>
            </div>

            {historyLoading && <p className="client-history-state">Cargando pedidos...</p>}
            {historyError && <div className="client-message error">{historyError}</div>}
            {!historyLoading && !historyError && pedidos.length === 0 && (
              <p className="client-history-state">Aun no tienes pedidos.</p>
            )}

            <div className="client-history-list">
              {pedidos.map((pedido) => (
                <article className="client-history-order" key={pedido.id}>
                  <div className="client-history-top">
                    <div>
                      <strong>#{pedido.id.slice(-8)}</strong>
                      <span>{formatDate(pedido.fechaCreacion)}</span>
                    </div>
                    <span className={`client-order-status ${pedido.estado}`}>
                      {pedido.estado}
                    </span>
                  </div>
                  <div className="client-history-products">
                    {pedido.productos.map((product) => (
                      <span key={product.productoId}>
                        {product.cantidad}x {product.nombre}
                      </span>
                    ))}
                  </div>
                  <div className="client-history-total">
                    <span>Total</span>
                    <strong>{formatMoney(pedido.total)}</strong>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

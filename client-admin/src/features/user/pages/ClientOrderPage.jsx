import { useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { crear, obtenerMisPedidos } from "../../../services/pedidos.service";
import { useAuthStore } from "../../auth/store/authStore";
import { UserShell } from "../components/UserShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  PrimaryButton,
  SectionHeader,
  UserProfileCard,
} from "../components/UserUi";
import { useCartStore } from "../store/carStore";
import "../styles/client-orders.css";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";

const formatMoney = (value) => `Q${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => new Intl.DateTimeFormat("es-GT", {
  dateStyle: "medium",
  timeStyle: "short",
}).format(new Date(value));

export const ClientOrderPage = () => {
  const user = useAuthStore((state) => state.user);
  const carrito = useCartStore((state) => state.carrito);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const eliminarItem = useCartStore((state) => state.eliminarItem);
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito);

  const [pedidos, setPedidos] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadHistory = useCallback(async ({ silent = false } = {}) => {
    try {
      if (!silent) setHistoryLoading(true);
      setHistoryError("");
      setPedidos(await obtenerMisPedidos());
    } catch (error) {
      setHistoryError(error.userMessage || error.message || "No se pudo cargar el historial.");
    } finally {
      if (!silent) setHistoryLoading(false);
    }
  }, []);

  useSmartPolling(() => loadHistory({ silent: pedidos.length > 0 }), 20000);

  const estimatedTotal = useMemo(
    () => carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0),
    [carrito]
  );

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      setCheckoutError("");
      setSuccessMessage("");
      const pedido = await crear(carrito);
      vaciarCarrito();
      setSuccessMessage(`Pedido ${pedido.id} creado correctamente.`);
      await loadHistory();
    } catch (error) {
      setCheckoutError(error.userMessage || error.message || "No se pudo crear el pedido.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  return (
    <UserShell contentClassName="client-orders-main">
      <div className="client-orders-header">
        <SectionHeader
          eyebrow="Pedidos Aurea"
          title="Mis pedidos"
          description="Confirma tu carrito y consulta el estado actualizado de cada orden."
        />
        <UserProfileCard user={user} compact />
      </div>

      <div className="client-orders-grid">
        <section className="client-orders-card">
          <div className="client-section-title">
            <h2>Checkout</h2>
            <Link to="/user/menu">Agregar productos</Link>
          </div>

          {carrito.length === 0 ? (
            <EmptyState
              icon="ri-shopping-bag-line"
              title="Tu carrito está vacío"
              description="Selecciona productos del menú para preparar tu pedido."
              action={<PrimaryButton to="/user/menu" icon="ri-restaurant-line">Ver menú</PrimaryButton>}
            />
          ) : (
            <>
              <div className="client-cart-list">
                {carrito.map((item) => (
                  <article className="client-cart-item" key={item.id}>
                    <img src={item.imagen || item.img} alt={item.nombre} />
                    <div className="client-cart-copy">
                      <h3>{item.nombre}</h3>
                      <span>{formatMoney(item.precio)} por unidad</span>
                    </div>
                    <div className="client-quantity">
                      <button type="button" onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                      <strong>{item.cantidad}</strong>
                      <button type="button" onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                    </div>
                    <strong>{formatMoney(item.precio * item.cantidad)}</strong>
                    <button
                      type="button"
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
                <small>El restaurante valida disponibilidad y recalcula el precio final.</small>
              </div>

              {checkoutError && <div className="client-message error">{checkoutError}</div>}
              {successMessage && <div className="client-message success">{successMessage}</div>}

              <PrimaryButton
                className="client-checkout-button"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? "Confirmando pedido..." : "Confirmar y pagar"}
              </PrimaryButton>
            </>
          )}
        </section>

        <section className="client-orders-card">
          <div className="client-section-title">
            <h2>Historial</h2>
            <button type="button" onClick={() => loadHistory()} disabled={historyLoading}>
              <i className="ri-refresh-line" /> Actualizar
            </button>
          </div>

          {historyLoading && (
            <LoadingState title="Cargando historial" description="Consultando tus pedidos más recientes." />
          )}
          {historyError && <ErrorState description={historyError} onRetry={() => loadHistory()} />}
          {!historyLoading && !historyError && pedidos.length === 0 && (
            <EmptyState
              icon="ri-file-list-3-line"
              title="Aún no tienes pedidos"
              description="Tus órdenes aparecerán aquí después de confirmar el checkout."
            />
          )}

          <div className="client-history-list">
            {pedidos.map((pedido) => (
              <article className="client-history-order" key={pedido.id}>
                <div className="client-history-top">
                  <div>
                    <strong>#{pedido.id.slice(-8)}</strong>
                    <span>{formatDate(pedido.fechaCreacion)}</span>
                  </div>
                  <span className={`client-order-status ${pedido.estado}`}>{pedido.estado}</span>
                </div>
                <div className="client-history-products">
                  {pedido.productos.map((product) => (
                    <span key={product.productoId}>{product.cantidad}x {product.nombre}</span>
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
    </UserShell>
  );
};

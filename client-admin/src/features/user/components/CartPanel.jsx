import { useNavigate } from "react-router-dom";
import { useCartStore } from "../store/carStore";
import { EmptyState, PrimaryButton } from "./UserUi";

const imageFor = (item) => item.imagen || item.img || "/plato1.jpeg";

export const CartPanel = ({ title = "Mi pedido", compact = false, showClear = true }) => {
  const carrito = useCartStore((state) => state.carrito);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const eliminarItem = useCartStore((state) => state.eliminarItem);
  const vaciarCarrito = useCartStore((state) => state.vaciarCarrito);
  const navigate = useNavigate();
  const subtotal = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <aside className={`user-cart-panel${compact ? " is-compact" : ""}`}>
      <div className="user-cart-header">
        <div>
          <i className="ri-shopping-bag-line" />
          <strong>{title}</strong>
          <span>{totalItems}</span>
        </div>
        {showClear && carrito.length > 0 && (
          <button type="button" onClick={vaciarCarrito}>Vaciar</button>
        )}
      </div>

      <div className="user-cart-items">
        {carrito.length === 0 ? (
          <EmptyState
            icon="ri-shopping-bag-line"
            title="Tu carrito está vacío"
            description="Agrega productos del menú para comenzar."
          />
        ) : carrito.map((item) => (
          <article className="user-cart-item" key={item.id}>
            <img src={imageFor(item)} alt={item.nombre} />
            <div className="user-cart-item-copy">
              <strong>{item.nombre}</strong>
              <span>Q{Number(item.precio).toFixed(2)}</span>
              <div className="user-quantity-control">
                <button type="button" onClick={() => cambiarCantidad(item.id, -1)} aria-label="Disminuir cantidad">−</button>
                <b>{item.cantidad}</b>
                <button type="button" onClick={() => cambiarCantidad(item.id, 1)} aria-label="Aumentar cantidad">+</button>
              </div>
            </div>
            <button
              type="button"
              className="user-cart-remove"
              onClick={() => eliminarItem(item.id)}
              aria-label={`Eliminar ${item.nombre}`}
            >
              <i className="ri-delete-bin-line" />
            </button>
          </article>
        ))}
      </div>

      <div className="user-cart-total">
        <span>Total estimado</span>
        <strong>Q{subtotal.toFixed(2)}</strong>
      </div>
      <PrimaryButton
        className="user-cart-checkout"
        icon="ri-arrow-right-line"
        disabled={carrito.length === 0}
        onClick={() => navigate("/user/orders")}
      >
        Ir al checkout
      </PrimaryButton>
    </aside>
  );
};

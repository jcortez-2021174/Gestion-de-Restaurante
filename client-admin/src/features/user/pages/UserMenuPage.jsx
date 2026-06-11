import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarProductos } from "../../../services/productos.service";
import { obtenerTodas as listarCategorias } from "../../../services/categorias.service";
import { useAuthStore } from "../../auth/store/authStore";
import { CartPanel } from "../components/CartPanel";
import { UserShell } from "../components/UserShell";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SectionHeader,
  UserProfileCard,
} from "../components/UserUi";
import { mapVisibleMenuProducts } from "../menu.products";
import { useCartStore } from "../store/carStore";
import "../styles/usermenu.css";
import { useSmartPolling } from "../../../shared/hooks/useSmartPolling";

export const UserMenuPage = () => {
  const user = useAuthStore((state) => state.user);
  const carrito = useCartStore((state) => state.carrito);
  const agregarItem = useCartStore((state) => state.agregarItem);
  const sincronizarCatalogo = useCartStore((state) => state.sincronizarCatalogo);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categoriasCatalogo, setCategoriasCatalogo] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const [response, categoryResponse] = await Promise.all([
        listarProductos(),
        listarCategorias(),
      ]);
      const products = mapVisibleMenuProducts(response);
      setProductos(products);
      setCategoriasCatalogo((categoryResponse.data || categoryResponse || []).map((category) => ({
        id: String(category._id || category.id),
        label: category.nombre,
      })));
      sincronizarCatalogo(products);
      setCategoriaActiva("todos");
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || "No se pudo cargar el menú.");
    } finally {
      setLoading(false);
    }
  }, [sincronizarCatalogo]);

  useSmartPolling(loadProducts, 45000);

  const categorias = useMemo(() => {
    return [{ id: "todos", label: "Todos" }, ...categoriasCatalogo];
  }, [categoriasCatalogo]);

  const productosFiltrados = useMemo(() => {
    const search = busqueda.trim().toLowerCase();
    return productos.filter((product) => {
      const matchesCategory = categoriaActiva === "todos" || product.categoriaId === categoriaActiva;
      const matchesSearch =
        !search ||
        product.nombre.toLowerCase().includes(search) ||
        product.descripcion.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [productos, categoriaActiva, busqueda]);

  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  return (
    <UserShell contentClassName="user-menu-page">
      <div className="menu-topbar">
        <SectionHeader
          eyebrow="Cocina Aurea"
          title="Nuestro Menú"
          description="Explora los productos disponibles y crea tu pedido."
        />
        <div className="menu-topbar-right">
          <label className="menu-search-box">
            <i className="ri-search-line" />
            <input
              type="search"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
            />
          </label>
          <button
            className="menu-cart-btn"
            type="button"
            onClick={() => navigate("/user/orders")}
            aria-label="Abrir carrito"
          >
            <i className="ri-shopping-cart-line" />
            {totalItems > 0 && <span className="menu-cart-count">{totalItems}</span>}
          </button>
          <UserProfileCard user={user} compact />
        </div>
      </div>

      <div className="menu-layout">
        <section className="menu-content-col">
          <div className="menu-cats">
            {categorias.map((category) => (
              <button
                type="button"
                key={category.id}
                className={`menu-cat-btn${categoriaActiva === category.id ? " activa" : ""}`}
                onClick={() => setCategoriaActiva(category.id)}
              >
                <i className="ri-restaurant-2-line" /> {category.label}
              </button>
            ))}
          </div>

          <h2 className="menu-section-title">
            <span className="menu-section-line" />
            Productos disponibles
          </h2>

          {loading && (
            <LoadingState
              title="Preparando el menú"
              description="Estamos consultando los productos disponibles."
            />
          )}
          {error && <ErrorState description={error} onRetry={loadProducts} />}

          {!loading && !error && (
            <div className="menu-platos-grid">
              {productosFiltrados.length === 0 ? (
                <EmptyState
                  icon="ri-restaurant-line"
                  title="No encontramos productos"
                  description={productos.length === 0
                    ? "El catálogo no tiene productos disponibles en este momento."
                    : "Prueba con otra categoría o cambia el término de búsqueda."}
                />
              ) : productosFiltrados.map((product) => (
                <article className="plato-card" key={product.id}>
                  <div className="plato-card-img-wrap">
                    <img src={product.imagen} alt={product.nombre} />
                    <button
                      type="button"
                      className={`plato-fav-btn${favoritos.includes(product.id) ? " activo" : ""}`}
                      onClick={() => setFavoritos((current) => (
                        current.includes(product.id)
                          ? current.filter((id) => id !== product.id)
                          : [...current, product.id]
                      ))}
                      aria-label="Marcar favorito"
                    >
                      <i className={favoritos.includes(product.id) ? "ri-heart-fill" : "ri-heart-line"} />
                    </button>
                  </div>
                  <div className="plato-card-body">
                    <h3>{product.nombre}</h3>
                    <p>{product.descripcion}</p>
                    <div className="plato-meta">
                      <span><i className="ri-price-tag-3-line" /> {product.categoriaNombre}</span>
                    </div>
                    <div className="plato-card-footer">
                      <span className="plato-precio">Q{product.precio.toFixed(2)}</span>
                      <button
                        type="button"
                        className="btn-add-cart"
                        onClick={() => agregarItem(product)}
                        aria-label={`Agregar ${product.nombre}`}
                      >
                        <i className="ri-shopping-cart-line" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <CartPanel title="Mi carrito" />
      </div>
    </UserShell>
  );
};

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../auth/store/authStore';
import { useCartStore } from '../store/carStore';
import { listarProductos } from '../../../services/productos.service';
import { mapMenuProduct } from '../order.contract';
import '../styles/usermenu.css';

export const UserMenuPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const carrito = useCartStore((state) => state.carrito);
  const agregarItem = useCartStore((state) => state.agregarItem);
  const cambiarCantidad = useCartStore((state) => state.cambiarCantidad);
  const eliminarItem = useCartStore((state) => state.eliminarItem);
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [busqueda, setBusqueda] = useState('');
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listarProductos();
      const products = (response.data || [])
        .filter((product) => product.disponibilidad === 'Disponible')
        .map(mapMenuProduct);
      setProductos(products);
    } catch (requestError) {
      setError(requestError.userMessage || requestError.message || 'No se pudo cargar el menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const categorias = useMemo(() => {
    const unique = new Map();
    productos.forEach((product) => {
      unique.set(product.categoriaId, product.categoriaNombre);
    });
    return [{ id: 'todos', label: 'Todos' }, ...[...unique].map(([id, label]) => ({ id, label }))];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    const search = busqueda.trim().toLowerCase();
    return productos.filter((product) => {
      const matchesCategory =
        categoriaActiva === 'todos' || product.categoriaId === categoriaActiva;
      const matchesSearch =
        !search ||
        product.nombre.toLowerCase().includes(search) ||
        product.descripcion.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [productos, categoriaActiva, busqueda]);

  const subtotal = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>
        <ul className="menu">
          <Link to="/home" className="menu-link"><li><i className="ri-home-4-line" /> Inicio</li></Link>
          <Link to="/user/menu" className="menu-link"><li className="active"><i className="ri-restaurant-line" /> Menu</li></Link>
          <Link to="/user/reservations" className="menu-link"><li><i className="ri-calendar-line" /> Reservas</li></Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line" /> Pedidos
              {totalItems > 0 && <span className="menu-badge">{totalItems}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link"><li><i className="ri-group-line" /> Sobre Nosotros</li></Link>
        </ul>
      </aside>

      <main className="main" style={{ padding: '28px', position: 'relative' }}>
        <div className="menu-topbar">
          <div>
            <h1 className="menu-page-title">Nuestro Menu</h1>
            <p className="menu-page-sub">Productos disponibles directamente desde Aurea.</p>
          </div>
          <div className="menu-topbar-right">
            <div className="menu-search-box">
              <i className="ri-search-line" />
              <input
                type="search"
                placeholder="Buscar productos..."
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
              />
            </div>
            <button
              className="menu-cart-btn"
              onClick={() => navigate('/user/orders')}
              aria-label="Abrir carrito"
            >
              <i className="ri-shopping-cart-line" />
              {totalItems > 0 && <span className="menu-cart-count">{totalItems}</span>}
            </button>
            <div className="menu-user-pill">
              <i className="ri-user-line" style={{ color: 'var(--gold)' }} />
              <div>
                <span className="menu-user-name">Hola, {user?.username || 'Cliente'}</span>
                <small className="menu-user-role">Cliente Aurea</small>
              </div>
              <button onClick={handleLogout} className="btn-mini" aria-label="Cerrar sesion">
                <i className="ri-logout-box-line" />
              </button>
            </div>
          </div>
        </div>

        <div className="menu-layout">
          <section className="menu-content-col">
            <div className="menu-cats">
              {categorias.map((category) => (
                <button
                  key={category.id}
                  className={`menu-cat-btn${categoriaActiva === category.id ? ' activa' : ''}`}
                  onClick={() => setCategoriaActiva(category.id)}
                >
                  <i className="ri-restaurant-2-line" /> {category.label}
                </button>
              ))}
            </div>

            <div className="menu-section-title">
              <span className="menu-section-line" />
              Productos disponibles
            </div>

            {loading && <p style={{ color: '#aaa', padding: '40px 0' }}>Cargando productos...</p>}
            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={loadProducts}>Reintentar</button>
              </div>
            )}

            {!loading && !error && (
              <div className="menu-platos-grid">
                {productosFiltrados.length === 0 ? (
                  <p style={{ color: '#888', gridColumn: '1/-1', padding: '40px 0' }}>
                    No hay productos disponibles para este filtro.
                  </p>
                ) : productosFiltrados.map((product) => (
                  <article className="plato-card" key={product.id}>
                    <div className="plato-card-img-wrap">
                      <img src={product.imagen} alt={product.nombre} />
                      <button
                        className={`plato-fav-btn${favoritos.includes(product.id) ? ' activo' : ''}`}
                        onClick={() => setFavoritos((current) => (
                          current.includes(product.id)
                            ? current.filter((id) => id !== product.id)
                            : [...current, product.id]
                        ))}
                        aria-label="Marcar favorito"
                      >
                        <i className={favoritos.includes(product.id) ? 'ri-heart-fill' : 'ri-heart-line'} />
                      </button>
                    </div>
                    <div className="plato-card-body">
                      <h4>{product.nombre}</h4>
                      <p>{product.descripcion}</p>
                      <div className="plato-meta">
                        <span><i className="ri-price-tag-3-line" /> {product.categoriaNombre}</span>
                      </div>
                      <div className="plato-card-footer">
                        <span className="plato-precio">Q{product.precio.toFixed(2)}</span>
                        <button className="btn-add-cart" onClick={() => agregarItem(product)}>
                          <i className="ri-shopping-cart-line" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="panel-pedido menu-carrito-panel">
            <div className="panel-pedido-header">
              <div className="panel-pedido-title">
                <i className="ri-shopping-cart-line" />
                <span>Mi carrito</span>
              </div>
              <span style={{ color: 'var(--gold)', fontSize: '13px' }}>{totalItems} productos</span>
            </div>

            <div className="panel-pedido-items">
              {carrito.length === 0 ? (
                <p className="panel-pedido-vacio">Tu carrito esta vacio</p>
              ) : carrito.map((item) => (
                <div className="pedido-item" key={item.id}>
                  <img src={item.imagen} alt={item.nombre} className="pedido-item-img" />
                  <div className="pedido-item-info">
                    <span className="pedido-item-nombre">{item.nombre}</span>
                    <span className="pedido-item-precio">Q{item.precio.toFixed(2)}</span>
                    <div className="pedido-item-qty">
                      <button onClick={() => cambiarCantidad(item.id, -1)}>-</button>
                      <span>{item.cantidad}</span>
                      <button onClick={() => cambiarCantidad(item.id, 1)}>+</button>
                    </div>
                  </div>
                  <button className="pedido-item-del" onClick={() => eliminarItem(item.id)}>
                    <i className="ri-delete-bin-line" />
                  </button>
                </div>
              ))}
            </div>

            <div className="panel-pedido-totales">
              <div className="total-row total-final">
                <span>Total estimado</span>
                <span className="total-monto">Q{subtotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              className="btn-finalizar"
              disabled={carrito.length === 0}
              onClick={() => navigate('/user/orders')}
            >
              Ir al checkout <i className="ri-arrow-right-line" />
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
};

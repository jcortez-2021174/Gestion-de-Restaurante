import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useOrders } from "../../../context/OrdersContext";

import "../styles/dashboard.css";
import "../styles/usermenu.css";

const CATEGORIAS = [
  { id: "entradas",   label: "Entradas",   icon: "ri-bowl-line" },
  { id: "almuerzos",  label: "Almuerzos",  icon: "ri-restaurant-2-line" },
  { id: "cenas",      label: "Cenas",      icon: "ri-moon-line" },
  { id: "bebidas",    label: "Bebidas",    icon: "ri-goblet-line" },
  { id: "postres",    label: "Postres",    icon: "ri-cake-line" },
  { id: "combos",     label: "Combos",     icon: "ri-gift-line" },
];

const PLATOS = [
  { id: 1,  cat: "entradas",  nombre: "Bruschetta Clásica",    desc: "Tomate, albahaca, ajo, aceite de oliva y queso parmesano.",                precio: 49,  tiempo: 15, img: "/plato1.jpeg" },
  { id: 2,  cat: "entradas",  nombre: "Champiñones Rellenos",  desc: "Champiñones rellenos de queso de cabra, espinacas y finas hierbas.",      precio: 59,  tiempo: 20, img: "/plato2.jpeg" },
  { id: 3,  cat: "entradas",  nombre: "Tartar de Atún",        desc: "Atún fresco, aguacate, sésamo, salsa de soya y aceite de oliva.",         precio: 69,  tiempo: 20, img: "/plato3.jpeg" },
  { id: 4,  cat: "entradas",  nombre: "Carpaccio de Res",      desc: "Finas láminas de res, rúcula, parmesano y reducción balsámica.",          precio: 65,  tiempo: 15, img: "/plato4.jpeg" },
  { id: 5,  cat: "almuerzos", nombre: "Salmón a la Parrilla",  desc: "Salmón fresco con vegetales salteados y puré de papas.",                  precio: 129, tiempo: 25, img: "/plato6.png" },
  { id: 6,  cat: "almuerzos", nombre: "Pasta Alfredo",         desc: "Pasta en salsa alfredo con pollo y queso parmesano.",                     precio: 99,  tiempo: 25, img: "/plato2.jpeg" },
  { id: 7,  cat: "almuerzos", nombre: "Risotto de Hongos",     desc: "Arroz arborio con mezcla de hongos, queso parmesano y trufa.",            precio: 110, tiempo: 30, img: "/plato3.jpeg" },
  { id: 8,  cat: "almuerzos", nombre: "Filete de Res",         desc: "Filete de res con vegetales asados y salsa de vino tinto.",               precio: 159, tiempo: 30, img: "/plato4.jpeg" },
  { id: 9,  cat: "cenas",     nombre: "Cordero a las Brasas",  desc: "Costillas de cordero marinadas con hierbas provenzales y chimichurri.",   precio: 185, tiempo: 35, img: "/plato1.jpeg" },
  { id: 10, cat: "cenas",     nombre: "Lubina al Horno",       desc: "Lubina entera al horno con limón, alcaparras y tomates cherry.",          precio: 149, tiempo: 30, img: "/plato2.jpeg" },
  { id: 11, cat: "bebidas",   nombre: "Limonada Natural",      desc: "Jugo de limón fresco con menta y agua mineral.",                         precio: 25,  tiempo: 5,  img: "/plato3.jpeg" },
  { id: 12, cat: "bebidas",   nombre: "Agua de Jamaica",       desc: "Flor de jamaica, azúcar de caña y hielo.",                               precio: 20,  tiempo: 5,  img: "/aguajamica.jpg" },
  { id: 13, cat: "postres",   nombre: "Tiramisú Artesanal",    desc: "Capas de bizcocho, mascarpone y café espresso.",                         precio: 55,  tiempo: 10, img: "/Postre2.png" },
  { id: 14, cat: "postres",   nombre: "Tarta de Chocolate",    desc: "Bizcocho húmedo con ganache de chocolate amargo y frambuesas.",           precio: 60,  tiempo: 10, img: "/Postre1.png" },
  { id: 15, cat: "combos",    nombre: "Combo Pareja",          desc: "2 entradas + 2 platos principales + 2 postres + 2 bebidas.",              precio: 299, tiempo: 40, img: "/plato3.jpeg" },
  { id: 16, cat: "combos",    nombre: "Combo Familiar",        desc: "4 entradas + 4 platos principales + bebidas ilimitadas.",                 precio: 549, tiempo: 45, img: "/plato4.jpeg" },
];

export const UserMenuPage = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const [catActiva,       setCatActiva]       = useState("entradas");
  const [busqueda,        setBusqueda]        = useState("");
  const [favoritos,       setFavoritos]       = useState([]);
  const [carrito,         setCarrito]         = useState([]);
  const [mostrarCarrito,  setMostrarCarrito]  = useState(false);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const toggleFav = (id) =>
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const agregarCarrito = (plato) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === plato.id);
      if (existe) return prev.map((i) => i.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { ...plato, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id, delta) =>
    setCarrito((prev) =>
      prev.map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
          .filter((i) => i.cantidad > 0)
    );

  const eliminarItem = (id) => setCarrito((prev) => prev.filter((i) => i.id !== id));

  const platosFiltrados = PLATOS.filter(
    (p) =>
      p.cat === catActiva &&
      (busqueda === "" ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.desc.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const subtotal   = carrito.reduce((a, i) => a + i.precio * i.cantidad, 0);
  const impuestos  = +(subtotal * 0.12).toFixed(2);
  const total      = +(subtotal + impuestos).toFixed(2);
  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);

  const groupedPlatos = PLATOS.filter((p) =>
    busqueda === "" ? true :
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.desc.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderPlatos = busqueda !== "" ? groupedPlatos : platosFiltrados;

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>

        <ul className="menu">
          <Link to="/home" className="menu-link">
            <li><i className="ri-home-4-line"></i> Inicio</li>
          </Link>
          <Link to="/user/menu" className="menu-link">
            <li className="active"><i className="ri-restaurant-line"></i> Menú</li>
          </Link>
          <Link to="/user/reservations" className="menu-link">
            <li><i className="ri-calendar-line"></i> Reservas</li>
          </Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line"></i> Pedidos
              {carrito.length > 0 && <span className="menu-badge">{totalItems}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link">
            <li><i className="ri-group-line"></i> Sobre Nosotros</li>
          </Link>
          <Link to="/user/contacto" className="menu-link">
            <li><i className="ri-contacts-book-line"></i> Contacto</li>
          </Link>
        </ul>

        <div className="sidebar-contact">
          <p className="sidebar-contact-title">CONTÁCTANOS</p>
          <div className="sidebar-contact-item"><i className="ri-phone-line"></i><span>+502 1234 5678</span></div>
          <div className="sidebar-contact-item"><i className="ri-mail-line"></i><span>hola@aurea.com</span></div>
          <div className="sidebar-contact-item"><i className="ri-map-pin-line"></i><span>5ta avenida 12-34, Zona 10, Guatemala</span></div>
        </div>

        <div className="sidebar-social">
          <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
          <a href="#" className="social-icon"><i className="ri-instagram-line"></i></a>
          <a href="#" className="social-icon"><i className="ri-whatsapp-line"></i></a>
        </div>
      </aside>

      <main className="main" style={{ padding: "28px", position: "relative" }}>

        <div className="menu-topbar">
          <div>
            <h1 className="menu-page-title">Nuestro Menú</h1>
            <p className="menu-page-sub">Descubre nuestros platillos preparados con los mejores ingredientes.</p>
          </div>

          <div className="menu-topbar-right">
            <div className="menu-search-box">
              <i className="ri-search-line"></i>
              <input
                type="text"
                placeholder="Buscar platillos, ingredientes..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>

            <div className="notification" style={{ color: "var(--gold)", fontSize: "22px", position: "relative", cursor: "pointer" }}>
              <i className="ri-notification-3-line"></i>
              <span className="badge">2</span>
            </div>

            <button className="menu-cart-btn" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
              <i className="ri-shopping-cart-line"></i>
              {totalItems > 0 && <span className="menu-cart-count">{totalItems}</span>}
            </button>

            <div className="menu-user-pill">
              <i className="ri-user-line" style={{ color: "var(--gold)" }}></i>
              <div>
                <span className="menu-user-name">Hola, {user?.name || "josecortez178"}</span>
                <small className="menu-user-role">Cliente</small>
              </div>
              <button onClick={handleLogout} className="btn-mini" style={{ padding: "6px 10px" }}>
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="menu-layout">

          <div className="menu-content-col">

            <div className="menu-cats">
              {CATEGORIAS.map((c) => (
                <button
                  key={c.id}
                  className={`menu-cat-btn${catActiva === c.id && busqueda === "" ? " activa" : ""}`}
                  onClick={() => { setCatActiva(c.id); setBusqueda(""); }}
                >
                  <i className={c.icon}></i> {c.label}
                </button>
              ))}
            </div>

            <div className="menu-filtros">
              <select className="menu-select">
                <option>Todos los ingredientes</option>
                <option>Sin gluten</option>
                <option>Vegetariano</option>
                <option>Vegano</option>
              </select>
              <select className="menu-select">
                <option>Ordenar por: Recomendados</option>
                <option>Precio: menor a mayor</option>
                <option>Precio: mayor a menor</option>
                <option>Más rápido</option>
              </select>
              <button className="menu-filtrar-btn">
                <i className="ri-equalizer-line"></i> Filtrar
              </button>
            </div>

            {busqueda === "" && (
              <div className="menu-section-title">
                <span className="menu-section-line"></span>
                {CATEGORIAS.find((c) => c.id === catActiva)?.label}
              </div>
            )}

            {busqueda !== "" && (
              <div className="menu-section-title">
                <span className="menu-section-line"></span>
                Resultados para "{busqueda}"
              </div>
            )}

            <div className="menu-platos-grid">
              {renderPlatos.length === 0 ? (
                <p style={{ color: "#666", gridColumn: "1/-1", padding: "40px 0" }}>No se encontraron platillos.</p>
              ) : (
                renderPlatos.map((plato) => (
                  <div className="plato-card" key={plato.id}>
                    <div className="plato-card-img-wrap">
                      <img src={plato.img} alt={plato.nombre} />
                      <button
                        className={`plato-fav-btn${favoritos.includes(plato.id) ? " activo" : ""}`}
                        onClick={() => toggleFav(plato.id)}
                      >
                        <i className={favoritos.includes(plato.id) ? "ri-heart-fill" : "ri-heart-line"}></i>
                      </button>
                    </div>
                    <div className="plato-card-body">
                      <h4>{plato.nombre}</h4>
                      <p>{plato.desc}</p>
                      <div className="plato-meta">
                        <span><i className="ri-time-line"></i> {plato.tiempo} min</span>
                      </div>
                      <div className="plato-card-footer">
                        <span className="plato-precio">Q{plato.precio}.00</span>
                        <button className="btn-add-cart" onClick={() => agregarCarrito(plato)}>
                          <i className="ri-shopping-cart-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <aside className="panel-pedido menu-carrito-panel">
            <div className="panel-pedido-header">
              <div className="panel-pedido-title">
                <i className="ri-shopping-cart-line"></i>
                <span>Mi carrito</span>
              </div>
              {carrito.length > 0 && (
                <span style={{ color: "var(--gold)", fontSize: "13px" }}>{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>
              )}
            </div>

            <div className="panel-pedido-items">
              {carrito.length === 0 ? (
                <p className="panel-pedido-vacio">Tu carrito está vacío</p>
              ) : (
                carrito.map((item) => (
                  <div className="pedido-item" key={item.id}>
                    <img src={item.img} alt={item.nombre} className="pedido-item-img" />
                    <div className="pedido-item-info">
                      <span className="pedido-item-nombre">{item.nombre}</span>
                      <span className="pedido-item-precio">Q{item.precio}.00</span>
                      <div className="pedido-item-qty">
                        <button onClick={() => cambiarCantidad(item.id, -1)}>−</button>
                        <span>{item.cantidad}</span>
                        <button onClick={() => cambiarCantidad(item.id, +1)}>+</button>
                      </div>
                    </div>
                    <button className="pedido-item-del" onClick={() => eliminarItem(item.id)}>
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="menu-descuento-box">
              <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>¿Tienes un código de descuento?</p>
              <div className="menu-descuento-row">
                <input type="text" placeholder="Ingresa tu código" className="menu-descuento-input" />
                <button className="menu-descuento-btn">Aplicar</button>
              </div>
            </div>

            <div className="panel-pedido-totales">
              <div className="total-row"><span>Subtotal</span><span>Q{subtotal}.00</span></div>
              <div className="total-row"><span>Impuestos (12%)</span><span>Q{impuestos}</span></div>
              <div className="total-row total-final">
                <span>Total</span>
                <span className="total-monto">Q{total}</span>
              </div>
            </div>

            <button className="btn-finalizar">Ir al checkout <i className="ri-arrow-right-line"></i></button>

            <div className="menu-trust-badges">
              <div className="trust-item"><i className="ri-shield-check-line"></i> Pago 100% seguro</div>
              <div className="trust-item"><i className="ri-truck-line"></i> Entrega rápida y segura</div>
              <div className="trust-item"><i className="ri-medal-line"></i> Calidad garantizada</div>
            </div>
          </aside>
        </div>
      </main>

      <a href="https://wa.me/50255551234" className="whatsapp-floating-trigger" target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:"30px", right:"30px", background:"#25d366", color:"white", width:"60px", height:"60px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"30px", zIndex:"1000", boxShadow:"0 4px 10px rgba(0,0,0,0.3)" }}>
        <i className="ri-whatsapp-line"></i>
      </a>
    </div>
  );
};
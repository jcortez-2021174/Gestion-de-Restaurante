import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useCartStore } from "../store/carStore";
import "../styles/dashboard.css";
import "../styles/usernosotros.css";

export const UserNosotrosPage = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  
  const carrito         = useCartStore((s) => s.carrito);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const eliminarItem    = useCartStore((s) => s.eliminarItem);

  const subtotal   = carrito.reduce((a, i) => a + i.precio * i.cantidad, 0);
  const impuestos  = +(subtotal * 0.12).toFixed(2);
  const total      = +(subtotal + impuestos).toFixed(2);
  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const galeria = [
    "/Plato6.png", "/Plato7.png", "/Plato8.png",
    "/Plato9.png", "/Plato10.png", "/Plato11.png",
    "/cena1.jpg",  "/cena2.jpg",  "/Postre1.png",
  ];

  const valores = [
    { icon: "ri-leaf-line",         titulo: "Ingredientes Frescos",  desc: "Seleccionamos los mejores ingredientes locales e internacionales." },
    { icon: "ri-vip-crown-line",    titulo: "Atención Premium",      desc: "Servicio cálido, profesional y personalizado para cada uno de nuestros clientes." },
    { icon: "ri-goblet-line",       titulo: "Ambiente Exclusivo",    desc: "Un espacio elegante y acogedor para disfrutar momentos únicos." },
    { icon: "ri-shield-check-line", titulo: "Calidad Garantizada",   desc: "Cuidamos cada detalle para garantizar una experiencia excepcional." },
  ];

  return (
    <div className="container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>
        <ul className="menu">
          <Link to="/home" className="menu-link"><li><i className="ri-home-4-line"></i> Inicio</li></Link>
          <Link to="/user/menu" className="menu-link"><li><i className="ri-restaurant-line"></i> Menú</li></Link>
          <Link to="/user/reservations" className="menu-link"><li><i className="ri-calendar-line"></i> Reservas</li></Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line"></i> Pedidos
              {totalItems > 0 && <span className="menu-badge">{totalItems}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link"><li className="active"><i className="ri-group-line"></i> Sobre Nosotros</li></Link>
          <Link to="/user/contacto" className="menu-link"><li><i className="ri-contacts-book-line"></i> Contacto</li></Link>
          <Link to="/user/puntos" className="menu-link"><li><i className="ri-star-line"></i> Puntos Aurea</li></Link>
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

      {/* MAIN */}
      <main className="main" style={{ padding: "28px" }}>

        {/* TOPBAR */}
        <div className="nos-topbar">
          <div className="nos-search-box">
            <i className="ri-search-line"></i>
            <input type="text" placeholder="Buscar platillos, ingredientes..." />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div className="notification" style={{ color: "var(--gold)", fontSize: "22px", position: "relative", cursor: "pointer" }}>
              <i className="ri-notification-3-line"></i>
              <span className="badge">2</span>
            </div>
            <button className="nos-cart-btn">
              <i className="ri-shopping-cart-line"></i>
              {totalItems > 0 && <span className="menu-cart-count">{totalItems}</span>}
            </button>
            <div className="menu-user-pill">
              <i className="ri-user-line" style={{ color: "var(--gold)" }}></i>
              <div>
                <span className="menu-user-name">Hola, {user?.name || "josecortez178"}</span>
                <small className="menu-user-role">Cliente Premium</small>
              </div>
              <button onClick={handleLogout} className="btn-mini" style={{ padding: "6px 10px" }}>
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>
        </div>

        {/* HERO */}
        <div className="nos-hero" style={{ backgroundImage: "url('/Fondo.jpeg')" }}>
          <div className="nos-hero-overlay"></div>
          <div className="nos-hero-content">
            <span className="nos-hero-label">— Aurea Restaurant Manager —</span>
            <h1>Sobre Nosotros</h1>
            <p>Conoce nuestra historia, nuestra pasión y el compromiso que ponemos en cada detalle.</p>
          </div>
        </div>

        {/* HISTORIA + CHEF */}
        <div className="nos-two-col">
          <div className="nos-historia-card card">
            <div className="nos-historia-img-wrap">
              <img src="/chef.png" alt="Historia Aurea" />
            </div>
            <div className="nos-historia-body">
              <span className="nos-label-small">NUESTRA HISTORIA</span>
              <h2>Pasión que<br />se transforma en sabor</h2>
              <p>Nacimos en 2015 con un sueño: ofrecer una cocina exquisita, con ingredientes frescos y técnicas modernas, en un ambiente que haga sentir a cada persona especial.</p>
              <p style={{ marginTop: "10px" }}>Hoy, seguimos comprometidos con la calidad, el detalle y la creación de momentos inolvidables.</p>
              <div className="nos-stats">
                <div className="nos-stat"><i className="ri-award-line"></i><div><span className="nos-stat-num">10+</span><span className="nos-stat-label">Años de experiencia</span></div></div>
                <div className="nos-stat"><i className="ri-restaurant-2-line"></i><div><span className="nos-stat-num">5</span><span className="nos-stat-label">Chefs expertos</span></div></div>
                <div className="nos-stat"><i className="ri-group-line"></i><div><span className="nos-stat-num">2000+</span><span className="nos-stat-label">Clientes felices</span></div></div>
              </div>
            </div>
          </div>

          <div className="nos-chef-card card">
            <div className="nos-chef-img-wrap">
              <img src="/chef2.jpg" alt="Chef Ejecutivo" />
            </div>
            <div className="nos-chef-body">
              <span className="nos-label-small">NUESTRO CHEF</span>
              <h2 className="nos-chef-nombre">Chef Ejecutivo</h2>
              <p className="nos-chef-firma">Marco Aurea</p>
              <div className="nos-chef-quote">
                <i className="ri-double-quotes-l nos-quote-icon"></i>
                <p>La cocina es arte, pasión y precisión. Cada platillo es una creación pensada para emocionar y sorprender.</p>
                <i className="ri-double-quotes-r nos-quote-icon nos-quote-r"></i>
              </div>
            </div>
          </div>
        </div>

        {/* VALORES */}
        <div className="nos-valores-section">
          <p className="nos-section-label">NUESTROS VALORES</p>
          <div className="nos-valores-grid">
            {valores.map((v, i) => (
              <div className="nos-valor-item" key={i}>
                <div className="nos-valor-icon"><i className={v.icon}></i></div>
                <h4>{v.titulo}</h4>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GALERÍA + CARRITO */}
        <div className="nos-galeria-layout">
          <div className="nos-galeria-section">
            <p className="nos-section-label">GALERÍA</p>
            <div className="nos-galeria-grid">
              {galeria.map((src, i) => (
                <div className="nos-galeria-item" key={i}>
                  <img src={src} alt={`galeria-${i}`} />
                </div>
              ))}
            </div>
            <button className="nos-ver-mas-btn"><i className="ri-grid-line"></i> Ver más fotos</button>
          </div>

          {/* ✅ CARRITO CONECTADO AL STORE */}
          <aside className="panel-pedido nos-carrito-panel">
            <div className="panel-pedido-header">
              <div className="panel-pedido-title"><i className="ri-shopping-cart-line"></i><span>Mi carrito</span></div>
              {carrito.length > 0 && <span style={{ color: "var(--gold)", fontSize: "13px" }}>{totalItems} producto{totalItems !== 1 ? "s" : ""}</span>}
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
                    <button className="pedido-item-del" onClick={() => eliminarItem(item.id)}><i className="ri-delete-bin-line"></i></button>
                  </div>
                ))
              )}
            </div>
            <div className="nos-descuento-box">
              <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>¿Tienes un código de descuento?</p>
              <div style={{ display: "flex", gap: "8px" }}>
                <input type="text" placeholder="Ingresa tu código" className="menu-descuento-input" />
                <button className="menu-descuento-btn">Aplicar</button>
              </div>
            </div>
            <div className="panel-pedido-totales">
              <div className="total-row"><span>Subtotal</span><span>Q{subtotal}.00</span></div>
              <div className="total-row"><span>Impuestos (12%)</span><span>Q{impuestos}</span></div>
              <div className="total-row total-final"><span>Total</span><span className="total-monto">Q{total}</span></div>
            </div>
            <button className="btn-finalizar">Ir al checkout <i className="ri-arrow-right-line"></i></button>
            <div className="menu-trust-badges">
              <div className="trust-item"><i className="ri-shield-check-line"></i> Pago 100% seguro</div>
              <div className="trust-item"><i className="ri-truck-line"></i> Entrega rápida y segura</div>
              <div className="trust-item"><i className="ri-medal-line"></i> Calidad garantizada</div>
            </div>
          </aside>
        </div>

        {/* CTA FINAL */}
        <div className="nos-cta" style={{ backgroundImage: "url('/vino2.jpg')" }}>
          <div className="nos-cta-overlay"></div>
          <div className="nos-cta-content">
            <span className="nos-label-small" style={{ color: "var(--gold)" }}>VIVE LA EXPERIENCIA AUREA</span>
            <h2>Te invitamos a ser parte de nuestra historia</h2>
            <p>Reserva tu mesa y disfruta de una experiencia culinaria única.</p>
            <div className="nos-cta-btns">
              <Link to="/user/reservations" className="nos-btn-primary"><i className="ri-calendar-check-line"></i> Reservar Ahora</Link>
              <Link to="/user/menu" className="nos-btn-secondary"><i className="ri-restaurant-line"></i> Ver Menú</Link>
            </div>
          </div>
        </div>

      </main>

      <a href="https://wa.me/50255551234" target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:"30px", right:"30px", background:"#25d366", color:"white", width:"60px", height:"60px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"30px", zIndex:"1000", boxShadow:"0 4px 10px rgba(0,0,0,0.3)", textDecoration:"none" }}>
        <i className="ri-whatsapp-line"></i>
      </a>
    </div>
  );
};
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useState } from "react";
import "../styles/dashboard.css";

export const UserDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const [carrito, setCarrito] = useState([
    { id: 1, nombre: "Costillas de Cordero a la Parrilla", precio: 165, cantidad: 1, img: "/plato1.jpeg" },
    { id: 2, nombre: "Brochetas de Cordero a la Menta y Limón", precio: 140, cantidad: 1, img: "/plato2.jpeg" },
    { id: 3, nombre: "Tarta de Cordero y Queso de Cabra", precio: 120, cantidad: 1, img: "/plato3.jpeg" },
  ]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const cambiarCantidad = (id, delta) => {
    setCarrito((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, cantidad: item.cantidad + delta } : item)
        .filter((item) => item.cantidad > 0)
    );
  };

  const eliminarItem = (id) => setCarrito((prev) => prev.filter((item) => item.id !== id));
  const vaciarCarrito = () => setCarrito([]);

  const subtotal = carrito.reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  const envio = subtotal > 0 ? 15 : 0;
  const total = subtotal + envio;

  const platosDestacados = [
    { id: 1, nombre: "Costillas de Cordero a la Parrilla", desc: "Jugosas y perfectamente asadas, acompañadas de guarniciones frescas.", precio: "Q165.00", img: "/plato1.jpeg", precioNum: 165 },
    { id: 2, nombre: "Cordero al Horno con Hierbas", desc: "Cocción lenta con hierbas provenzales que resaltan su sabor natural.", precio: "Q185.00", img: "/plato2.jpeg", precioNum: 185 },
    { id: 3, nombre: "Brochetas de Cordero a la Menta y Limón", desc: "Delicadas brochetas con un toque fresco de menta y limón.", precio: "Q140.00", img: "/plato3.jpeg", precioNum: 140 },
    { id: 4, nombre: "Tarta de Cordero y Queso de Cabra", desc: "Mezcla perfecta de cordero y queso de cabra en una base crujiente.", precio: "Q120.00", img: "/plato4.jpeg", precioNum: 120 },
  ];

  const agregarAlCarrito = (plato) => {
    setCarrito((prev) => {
      const existe = prev.find((i) => i.id === plato.id);
      if (existe) return prev.map((i) => i.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i);
      return [...prev, { id: plato.id, nombre: plato.nombre, precio: plato.precioNum, cantidad: 1, img: plato.img }];
    });
  };

  return (
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>

        <ul className="menu">
          <Link to="/user/menu" className="menu-link">
            <li>
              <i className="ri-restaurant-line"></i>
              Menú
            </li>
          </Link>
          <Link to="/user/reservations" className="menu-link">
            <li>
              <i className="ri-calendar-line"></i>
              Reservas
            </li>
          </Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line"></i>
              Pedidos
              {carrito.length > 0 && <span className="menu-badge">{carrito.length}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link">
            <li>
              <i className="ri-group-line"></i>
              Sobre Nosotros
            </li>
          </Link>
          <Link to="/user/contacto" className="menu-link">
            <li>
              <i className="ri-contacts-book-line"></i>
              Contacto
            </li>
          </Link>
        </ul>

        <div className="sidebar-contact">
          <p className="sidebar-contact-title">CONTÁCTANOS</p>
          <div className="sidebar-contact-item">
            <i className="ri-phone-line"></i>
            <span>+502 1234 5678</span>
          </div>
          <div className="sidebar-contact-item">
            <i className="ri-mail-line"></i>
            <span>hola@aurea.com</span>
          </div>
          <div className="sidebar-contact-item">
            <i className="ri-map-pin-line"></i>
            <span>5ta avenida 12-34, Zona 10, Ciudad de Guatemala</span>
          </div>
        </div>

        <div className="sidebar-social">
          <a href="#" className="social-icon"><i className="ri-facebook-fill"></i></a>
          <a href="#" className="social-icon"><i className="ri-instagram-line"></i></a>
          <a href="#" className="social-icon"><i className="ri-whatsapp-line"></i></a>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main" id="inicio">

        {/* HERO + PANEL PEDIDO LADO A LADO */}
        <div className="hero-pedido-layout">

          {/* USER BOX */}
          <div className="user-box user-box-floating">
            <div className="notification">
              <i className="ri-notification-3-line"></i>
              <span className="badge">2</span>
            </div>
            <div className="divider"></div>
            <div className="user">
              <i className="ri-user-line"></i>
              <div className="user-info">
                <span>{user?.username || "emiliobol12"}</span>
                <small>Cliente Premium</small>
              </div>
              <button onClick={handleLogout} className="btn-mini" style={{ marginLeft: "10px", padding: "8px 12px" }}>
                <i className="ri-logout-box-line"></i>
              </button>
            </div>
          </div>

          {/* HERO */}
          <section className="hero-section" style={{ backgroundImage: `url('/Plato5.png')` }}>
            <div className="hero-overlay"></div>

            <div className="hero-content">
              <span className="hero-welcome">BIENVENIDO A AUREA <span className="hero-welcome-line"></span></span>
              <h1 className="hero-title">
                El Arte del<br />
                <span className="hero-title-gold">Cordero</span>
              </h1>
              <p className="hero-description">
                Tradición e innovación en cada plato.<br />
                Una experiencia gastronómica única.
              </p>
              <div className="hero-action-buttons">
                <Link to="/user/menu" className="btn-hero-primary">
                  <i className="ri-book-open-line"></i> Ver Menú
                </Link>
                <Link to="/user/reservations" className="btn-hero-secondary">
                  <i className="ri-calendar-check-line"></i> Reservar Mesa
                </Link>
              </div>
            </div>

            <div className="hero-scroll-btn">
              <i className="ri-arrow-down-line"></i>
            </div>
          </section>

          {/* PANEL MI PEDIDO */}
          <aside className="panel-pedido" id="pedidos">
            <div className="panel-pedido-header">
              <div className="panel-pedido-title">
                <i className="ri-shopping-bag-line"></i>
                <span>Mi Pedido</span>
              </div>
              <button className="btn-vaciar" onClick={vaciarCarrito}>
                Vaciar <i className="ri-delete-bin-line"></i>
              </button>
            </div>

            <div className="panel-pedido-items">
              {carrito.length === 0 ? (
                <p className="panel-pedido-vacio">Tu pedido está vacío</p>
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

            <div className="panel-pedido-totales">
              <div className="total-row"><span>Subtotal</span><span>Q{subtotal}.00</span></div>
              <div className="total-row"><span>Envío</span><span>Q{envio}.00</span></div>
              <div className="total-row total-final">
                <span>Total</span>
                <span className="total-monto">Q{total}.00</span>
              </div>
            </div>

            <button className="btn-finalizar">Finalizar Pedido <i className="ri-arrow-right-line"></i></button>
            <button className="btn-ver-carrito">Ver Carrito</button>
          </aside>
        </div>

        {/* MENÚ DESTACADO */}
        <section className="card menu-destacado-section" id="menu">
          <div className="card-header">
            <div className="section-label-row">
              <h2>MENÚ DESTACADO <span className="section-divider-line"></span></h2>
            </div>
            <Link to="/user/menu" className="btn-ver-completo">
              Ver menú completo <i className="ri-arrow-right-line"></i>
            </Link>
          </div>

          <div className="menu-grid-4">
            {platosDestacados.map((plato) => (
              <div className="menu-card-v2" key={plato.id}>
                <div className="menu-card-img-wrap">
                  <img src={plato.img} alt={plato.nombre} />
                </div>
                <div className="menu-card-body">
                  <h4>{plato.nombre}</h4>
                  <p>{plato.desc}</p>
                  <div className="menu-card-footer">
                    <span className="menu-card-precio">{plato.precio}</span>
                    <button className="btn-add-cart" onClick={() => agregarAlCarrito(plato)}>
                      <i className="ri-add-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SERVICIOS */}
        <section className="servicios-section">
          <div className="servicio-item">
            <i className="ri-calendar-check-line"></i>
            <div>
              <p className="servicio-titulo">Reserva tu mesa</p>
              <p className="servicio-desc">Asegura tu lugar y vive una experiencia inolvidable.</p>
              <Link to="/user/reservations" className="servicio-link">Reservar ahora <i className="ri-arrow-right-line"></i></Link>
            </div>
          </div>
          <div className="servicio-item">
            <i className="ri-motorbike-line"></i>
            <div>
              <p className="servicio-titulo">Pedidos a domicilio</p>
              <p className="servicio-desc">Disfruta de Aurea en la comodidad de tu hogar.</p>
              <Link to="/user/orders" className="servicio-link">Pedir ahora <i className="ri-arrow-right-line"></i></Link>
            </div>
          </div>
          <div className="servicio-item">
            <i className="ri-shopping-bag-line"></i>
            <div>
              <p className="servicio-titulo">Para llevar</p>
              <p className="servicio-desc">Haz tu pedido y recógelo en nuestro restaurante.</p>
              <Link to="/user/orders" className="servicio-link">Ordenar ahora <i className="ri-arrow-right-line"></i></Link>
            </div>
          </div>
          <div className="servicio-item">
            <i className="ri-goblet-line"></i>
            <div>
              <p className="servicio-titulo">Maridaje perfecto</p>
              <p className="servicio-desc">Seleccionamos los mejores vinos y guarniciones para ti.</p>
              <Link to="/user/nosotros" className="servicio-link">Explorar más <i className="ri-arrow-right-line"></i></Link>
            </div>
          </div>
        </section>

      </main>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/50255551234" className="whatsapp-floating-trigger" target="_blank" rel="noreferrer"
        style={{
          position: "fixed", bottom: "30px", right: "30px",
          background: "#25d366", color: "white",
          width: "60px", height: "60px", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "30px", zIndex: "1000",
          boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
        }}>
        <i className="ri-whatsapp-line"></i>
      </a>
    </div>
  );
};
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/dashboard.css";
import "../styles/UserDashboardPage.css";

export const UserDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  return (
    <div className="user-page">

      {/* NAVBAR */}
      <nav className="user-navbar">

        <div className="user-navbar-logo">
          <img src="/logo.png" alt="Aurea" />
        </div>

        <ul className="user-nav-links">
          <li><a href="#inicio">Inicio</a></li>
          <li><a href="#menu">Menú</a></li>
          <li><a href="#reservas">Reservas</a></li>
          <li><a href="#pedidos">Pedidos</a></li>
          <li><a href="#nosotros">Sobre Nosotros</a></li>
          <li><a href="#contacto">Contacto</a></li>
        </ul>

        <div className="user-nav-right">
          <div className="user-nav-cart">
            <i className="ri-shopping-cart-line"></i>
            <span className="badge">2</span>
          </div>
          <div className="user-nav-account">
            <i className="ri-user-line"></i>
            <span>Mi Cuenta</span>
            <i className="ri-arrow-down-s-line"></i>
            <div className="user-dropdown">
              <p className="user-dropdown-name">{user?.username || "Usuario"}</p>
              <button onClick={handleLogout}>
                <i className="ri-logout-box-line"></i>
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>

      </nav>

      {/* HERO */}
      <section className="user-hero" id="inicio">
        <div className="user-hero-bg" />
        <div className="user-hero-content">
          <p className="user-hero-sub">— BIENVENIDO A AUREA —</p>
          <h1>El Arte del Cordero</h1>
          <p className="user-hero-desc">
            Tradición e innovación en cada plato.<br />
            Una experiencia gastronómica única.
          </p>
          <div className="user-hero-btns">
            <a href="#menu" className="btn-gold-hero">
              <i className="ri-restaurant-line"></i>
              Ver Menú
            </a>
            <a href="#reservas" className="btn-outline-hero">
              <i className="ri-calendar-line"></i>
              Reservar Mesa
            </a>
          </div>
        </div>
      </section>

      {/* PROMOCIONES */}
      <section className="user-section" id="menu">
        <div className="user-section-header">
          <p className="user-section-label">PROMOCIONES</p>
        </div>
        <div className="promo-grid">
          <div className="promo-card">
            <div className="promo-badge">2x1</div>
            <img src="/plato1.jpeg" alt="promo" />
            <div className="promo-info">
              <h4>2x1 en Copas de Vino</h4>
              <p>Todos los jueves</p>
              <a href="#">Ver más →</a>
            </div>
          </div>
          <div className="promo-card">
            <div className="promo-badge">15% OFF</div>
            <img src="/plato2.jpeg" alt="promo" />
            <div className="promo-info">
              <h4>15% de Descuento</h4>
              <p>En cortes premium</p>
              <a href="#">Ver más →</a>
            </div>
          </div>
          <div className="promo-card">
            <div className="promo-badge"><i className="ri-group-line"></i></div>
            <img src="/plato3.jpeg" alt="promo" />
            <div className="promo-info">
              <h4>Combo Familiar</h4>
              <p>Para 4 personas</p>
              <a href="#">Ver más →</a>
            </div>
          </div>
        </div>
      </section>

      {/* PLATILLOS DESTACADOS */}
      <section className="user-section">
        <div className="user-section-header">
          <p className="user-section-label">PLATILLOS DESTACADOS</p>
          <a href="#menu" className="user-section-link">Ver menú completo →</a>
        </div>
        <div className="platillos-grid">

          <div className="platillo-card">
            <img src="/plato1.jpeg" alt="plato" />
            <div className="platillo-info">
              <h4>Costillas de Cordero a la Parrilla</h4>
              <p>Jugosas y perfectamente asadas, acompañadas de guarniciones frescas.</p>
              <div className="platillo-footer">
                <span>Q165.00</span>
                <button className="btn-add"><i className="ri-add-line"></i></button>
              </div>
            </div>
          </div>

          <div className="platillo-card">
            <img src="/plato2.jpeg" alt="plato" />
            <div className="platillo-info">
              <h4>Cordero al Horno con Hierbas</h4>
              <p>Cocción lenta con hierbas provenzales que resaltan su sabor natural.</p>
              <div className="platillo-footer">
                <span>Q145.00</span>
                <button className="btn-add"><i className="ri-add-line"></i></button>
              </div>
            </div>
          </div>

          <div className="platillo-card">
            <img src="/plato3.jpeg" alt="plato" />
            <div className="platillo-info">
              <h4>Tarta de Cordero y Queso de Cabra</h4>
              <p>Mezclas perfecta de cordero y queso de cabra en una base crujiente.</p>
              <div className="platillo-footer">
                <span>Q120.00</span>
                <button className="btn-add"><i className="ri-add-line"></i></button>
              </div>
            </div>
          </div>

        </div>

        {/* OFERTA DEL DÍA */}
        <div className="oferta-card">
          <div className="oferta-badge">
            <i className="ri-time-line"></i>
            <span>OFERTA VÁLIDA POR HOY</span>
          </div>
          <img src="/plato4.jpeg" alt="oferta" />
          <div className="oferta-info">
            <h4>Costillas de Cordero + Copa de Vino</h4>
            <p>Precio especial solo por hoy</p>
            <span className="oferta-price">Q145.00</span>
            <button className="btn-gold-hero">
              <i className="ri-shopping-cart-line"></i>
              Ordenar ahora
            </button>
          </div>
        </div>
      </section>

      {/* RESERVAS */}
      <section className="user-section" id="reservas">
        <div className="user-section-header">
          <p className="user-section-label">RESERVAS</p>
        </div>
        <div className="reserva-user-card card">
          <div className="reserva-header">
            <i className="ri-calendar-check-line"></i>
            <span>Reservar mesa</span>
          </div>
          <div className="inputs">
            <div className="input-box">
              <i className="ri-calendar-line left-icon"></i>
              <input type="date" />
            </div>
            <div className="input-box">
              <i className="ri-time-line left-icon"></i>
              <input type="time" />
            </div>
          </div>
          <button className="btn-reserva">Reservar Mesa</button>
        </div>
      </section>

      {/* PEDIDOS */}
      <section className="user-section" id="pedidos">
        <div className="user-section-header">
          <p className="user-section-label">PEDIDOS</p>
        </div>
        <div className="pedidos-user-grid">
          <button className="pedido-btn">
            <i className="ri-motorbike-line"></i>
            Pedir a Domicilio
          </button>
          <button className="pedido-btn">
            <i className="ri-shopping-bag-line"></i>
            Ordenar para Llevar
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="user-footer" id="contacto">

        <div className="footer-col">
          <h4>HORARIOS DE ATENCIÓN</h4>
          <p><i className="ri-time-line"></i> Lunes a Jueves: 12:00 PM – 10:00 PM</p>
          <p><i className="ri-time-line"></i> Viernes y Sábado: 12:00 PM – 12:00 AM</p>
          <p><i className="ri-time-line"></i> Domingo: 12:00 PM – 8:00 PM</p>
        </div>

        <div className="footer-col" id="nosotros">
          <h4>VISÍTANOS</h4>
          <p><i className="ri-map-pin-line"></i> 5ta avenida 12-45, Zona 10, Ciudad de Guatemala</p>
          <p><i className="ri-whatsapp-line"></i> +502 5555-1234</p>
          <button className="btn-reserva" style={{ marginTop: 16 }}>
            <i className="ri-calendar-check-line"></i>
            Reservar Mesa
          </button>
        </div>

        <div className="footer-col">
          <h4>SÍGUENOS</h4>
          <div className="footer-socials">
            <a href="#"><i className="ri-facebook-circle-line"></i></a>
            <a href="#"><i className="ri-instagram-line"></i></a>
            <a href="#"><i className="ri-whatsapp-line"></i></a>
          </div>
        </div>

        <div className="footer-bottom">
          <img src="/logo.png" alt="Aurea" />
          <p>© 2025 Aurea - El Arte del Cordero. Todos los derechos reservados.</p>
        </div>

      </footer>

    </div>
  );
};
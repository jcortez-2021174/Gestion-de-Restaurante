import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import "../styles/dashboard.css";

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
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="logo-box">
          <img src="/logo.png" alt="Aurea Logo" />
        </div>

        <ul className="menu">
          <li className="active">
            <i className="ri-home-4-line"></i>
            <a href="#inicio" style={{ color: "inherit", textDecoration: "none" }}>Inicio</a>
          </li>
          <li>
            <i className="ri-restaurant-line"></i>
            <a href="#menu" style={{ color: "inherit", textDecoration: "none" }}>Menú</a>
          </li>
          <li>
            <i className="ri-calendar-line"></i>
            <a href="#reservas" style={{ color: "inherit", textDecoration: "none" }}>Reservas</a>
          </li>
          <li>
            <i className="ri-moped-line"></i>
            <a href="#pedidos" style={{ color: "inherit", textDecoration: "none" }}>Pedidos</a>
          </li>
          <li>
            <i className="ri-group-line"></i>
            <a href="#nosotros" style={{ color: "inherit", textDecoration: "none" }}>Nosotros</a>
          </li>
          <li>
            <i className="ri-contacts-book-line"></i>
            <a href="#contacto" style={{ color: "inherit", textDecoration: "none" }}>Contacto</a>
          </li>
        </ul>

        {/* SIDEBAR IMAGE BANNER */}
        <div className="sidebar-image">
          <img src="/plato1.jpeg" alt="Banner Lateral" />
          <div className="overlay"></div>
          <div className="sidebar-decor">
            <i className="ri-goblet-line"></i>
          </div>
          <p>SABORES CREADOS<br />PARA PERDURAR</p>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="main" id="inicio">
        
      {/* HEADER DENTRO DE USERDASHBOARD */}
    {/* BLOQUE DE USUARIO FLOTANTE */}
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
          <button 
            onClick={handleLogout} 
            className="btn-mini" 
            style={{ marginLeft: "10px", padding: "8px 12px" }}
          >
            <i className="ri-logout-box-line"></i>
          </button>
        </div>
      </div>

       {/* SECCIÓN HERO PRINCIPAL */}
        <section className="hero-section" style={{ backgroundImage: `url('/src/assets/img/fondo.jpg')` }}>
  
          {/* Capa oscura para que el texto resalte (Overlay) */}
          <div className="hero-overlay"></div>

          <div className="hero-content">
            <span className="hero-welcome">BIENVENIDO A AUREA</span>
            <h1 className="hero-title">El Arte del Cordero</h1>
            <p className="hero-description">
              Tradición e innovación en cada plato. Una experiencia <br />
              gastronómica única diseñada para elevar sus sentidos.
            </p>

            <div className="hero-action-buttons">
              <a href="#menu" className="btn-hero-primary">
                <i className="ri-book-open-line"></i> Ver Menú
              </a>
              <a href="#reservas" className="btn-hero-secondary">
                <i className="ri-calendar-check-line"></i> Reservar Mesa
              </a>
            </div>
          </div>
        </section>

        {/* GRID CENTRAL DEL DASHBOARD */}
        <div className="grid">

          {/* MENU / PLATILLOS DESTACADOS */}
          <section className="card menu-card-container" id="menu">
            <div className="card-header">
              <h2>Platillos Destacados</h2>
              <button className="btn-mini">
                Ver todo <i className="ri-arrow-right-line"></i>
              </button>
            </div>

            <div className="menu-grid">
              {/* Plato 1 */}
              <div className="menu-card">
                <img src="/plato1.jpeg" alt="Costillas" />
                <h4>Costillas de Cordero</h4>
                <p>Jugosas y perfectamente asadas a la parrilla con guarnición.</p>
                <span>Q165.00</span>
              </div>

              {/* Plato 2 */}
              <div className="menu-card">
                <img src="/plato2.jpeg" alt="Cordero Horno" />
                <h4>Cordero al Horno</h4>
                <p>Cocción lenta infusionada con finas hierbas provenzales.</p>
                <span>Q145.00</span>
              </div>
            </div>
          </section>

          {/* RESERVAS */}
          <section className="card reserva" id="reservas">
            <div className="reserva-header">
              <i className="ri-calendar-check-line"></i>
              <span>Reserva tu Mesa</span>
            </div>

            <div className="inputs">
              <div className="input-box">
                <i className="ri-user-group-line left-icon"></i>
                <input type="text" placeholder="Personas" />
              </div>
              <div className="input-box">
                <i className="ri-time-line left-icon"></i>
                <input type="text" placeholder="Horario" />
              </div>
            </div>

            <button className="btn-reserva">Confirmar Reserva</button>
          </section>

          {/* PEDIDOS */}
          <section className="card pedidos" id="pedidos">
            <h2>Tus Pedidos Activos</h2>
            <button>
              <i className="ri-shopping-bag-line"></i>
              <span>Ver Carrito de Compras (2 items)</span>
            </button>
          </section>

          {/* ACCESO RÁPIDO */}
          <section className="card acceso">
            <h2>Accesos Rápidos</h2>
            <div className="quick-grid">
              <div>
                <i className="ri-coupon-3-line"></i>
                <p>Cupones</p>
              </div>
              <div>
                <i className="ri-history-line"></i>
                <p>Historial</p>
              </div>
            </div>
          </section>

          {/* SECCIÓN MARIDAJE */}
          <section className="card maridaje" id="nosotros">
            <div className="maridaje-content">
              <h3>Maridaje Perfecto</h3>
              <p>Descubre nuestra exclusiva selección de vinos tintos diseñados para potenciar el sabor de nuestros cortes.</p>
              <ul>
                <li><i className="ri-checkbox-circle-line"></i> Reservas Especiales</li>
                <li><i className="ri-checkbox-circle-line"></i> Cosechas Premium</li>
              </ul>
            </div>
          </section>

          {/* ESTADO DE MESAS */}
          <section className="card mesas" id="contacto">
            <h2>Disponibilidad de Salón</h2>
            <div className="mesas-list">
              <div className="mesa-item">
                <div className="mesa-info">
                  <span className="mesa-nombre">Mesa Terraza 1</span>
                  <span className="mesa-hour">Zona Exterior</span>
                </div>
                <div className="mesa-right">
                  <span className="personas"><i className="ri-user-line"></i> 4</span>
                  <span className="estado disponible">Libre</span>
                </div>
              </div>

              <div className="mesa-item">
                <div className="mesa-info">
                  <span className="mesa-nombre">Mesa Central 4</span>
                  <span className="mesa-hour">Zona Interior</span>
                </div>
                <div className="mesa-right">
                  <span className="personas"><i className="ri-user-line"></i> 2</span>
                  <span className="estado ocupado">Ocupada</span>
                </div>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* WHATSAPP FLOTANTE */}
      <a href="https://wa.me/50255551234" className="whatsapp-floating-trigger" target="_blank" rel="noreferrer" style={{
        position: 'fixed', bottom: '30px', right: '30px', background: '#25d366', color: 'white', 
        width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', 
        justifyContent: 'center', fontSize: '30px', zIndex: '1000', boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
      }}>
        <i className="ri-whatsapp-line"></i>
      </a>

    </div>
  );
};
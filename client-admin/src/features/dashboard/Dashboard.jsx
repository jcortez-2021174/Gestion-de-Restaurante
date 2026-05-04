import "../../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo-box">
          <img src="/logo.png" alt="logo" />
        </div>

        <ul className="menu">
          <li className="active"><i className="ri-home-5-line"></i> Inicio</li>
          <li><i className="ri-restaurant-line"></i> Menú</li>
          <li><i className="ri-shopping-cart-line"></i> Pedidos</li>
          <li><i className="ri-calendar-line"></i> Reservas</li>
          <li><i className="ri-table-line"></i> Mesas</li>
          <li><i className="ri-user-line"></i> Clientes</li>
          <li><i className="ri-bar-chart-line"></i> Reportes</li>
          <li><i className="ri-settings-3-line"></i> Configuración</li>
        </ul>

        <div className="sidebar-image">
          <img src="/vino.jpg" alt="Vino" />
          <div className="overlay"></div>

          <div className="sidebar-decor">
            <i className="ri-goblet-line"></i>
          </div>

          <p>No es solo comida,<br />es una experiencia.</p>
        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <div className="header">

          <div>
            <h2>Bienvenido a Aurea</h2>
            <p>Tradición e innovación en cada plato.</p>
          </div>

          <div className="user-box">

            <div className="notification">
              <i className="ri-notification-3-line"></i>
              <span className="badge">3</span>
            </div>

            <div className="divider"></div>

            <div className="user">
              <i className="ri-user-line"></i>
              <div className="user-info">
                <span>Administrador</span>
                <small>admin@aurea.com</small>
              </div>
              <i className="ri-arrow-down-s-line"></i>
            </div>

          </div>

        </div>

        {/* GRID */}
        <div className="grid">

          {/* MENU */}
          <div className="card menu-card-container">

            <div className="card-header">
              <h3>MENÚ DESTACADO</h3>
              <button className="btn-mini">
                <i className="ri-arrow-right-line"></i> Ver menú completo
              </button>
            </div>

            <div className="menu-grid">

              <div className="menu-card">
                <img src="/plato1.jpeg" />
                <div>
                  <h4>Costillas de Cordero</h4>
                  <p>Jugosas y perfectamente asadas</p>
                  <span>Q165.00</span>
                </div>
              </div>

              <div className="menu-card">
                <img src="/plato2.jpeg" />
                <div>
                  <h4>Cordero al Horno</h4>
                  <p>Cocción lenta con hierbas</p>
                  <span>Q185.00</span>
                </div>
              </div>

              <div className="menu-card">
                <img src="/plato3.jpeg" />
                <div>
                  <h4>Brochetas</h4>
                  <p>Toque fresco de limón</p>
                  <span>Q140.00</span>
                </div>
              </div>

              <div className="menu-card">
                <img src="/plato4.jpeg" />
                <div>
                  <h4>Tarta</h4>
                  <p>Base crujiente gourmet</p>
                  <span>Q120.00</span>
                </div>
              </div>

            </div>

            <div className="actions">
              <button className="btn-gold"><i className="ri-add-line"></i> Agregar</button>
              <button className="btn-outline"><i className="ri-edit-line"></i> Editar</button>
              <button className="btn-danger"><i className="ri-delete-bin-line"></i> Eliminar</button>
            </div>

          </div>

          {/* RESERVA */}
          <div className="card reserva">

            <div className="reserva-header">
              <i className="ri-calendar-check-line"></i>
              <span>Reservar mesa</span>
            </div>

            <input type="date" />
            <input type="time" />

            <button className="btn-gold">Reservar</button>

          </div>

          {/* PEDIDOS */}
          <div className="card pedidos">
            <h3>PEDIDOS</h3>
            <button><i className="ri-motorbike-line"></i> Domicilio</button>
            <button><i className="ri-shopping-bag-line"></i> Llevar</button>
          </div>

          {/* ACCESO */}
          <div className="card acceso">
            <h3>Acceso rápido</h3>

            <div className="quick-grid">
              <div><i className="ri-file-list-line"></i><p>Pedidos</p></div>
              <div><i className="ri-restaurant-line"></i><p>Mesas</p></div>
              <div><i className="ri-bar-chart-line"></i><p>Ventas</p></div>
              <div><i className="ri-user-line"></i><p>Usuarios</p></div>
            </div>
          </div>

          {/* MARIDAJE */}
          <div className="card maridaje">
            <div className="maridaje-content">
              <h3>Maridaje Perfecto</h3>
              <p>El acompañamiento ideal.</p>
            </div>
          </div>

          {/* MESAS */}
          <div className="card mesas">
            <h3>Estado de Mesas</h3>

            <div className="mesa-item">
              <span>Mesa #5</span>
              <span className="ocupado">Ocupada</span>
            </div>

            <div className="mesa-item">
              <span>Mesa #8</span>
              <span className="disponible">Disponible</span>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}

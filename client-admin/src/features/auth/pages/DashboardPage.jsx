import "../styles/dashboard.css";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  return (
    <div className="container">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="logo-box">
          <img src="/logo.png" alt="logo" />
        </div>

        <ul className="menu">

    <Link to="/dashboard" className="menu-link">
        <li>
            <i className="ri-home-5-line"></i>
            Inicio
        </li>
    </Link>

    <Link to="/menu" className="menu-link">
        <li>
            <i className="ri-restaurant-line"></i>
            Menú
        </li>
    </Link>

    <Link to="/orders" className="menu-link">
        <li>
            <i className="ri-shopping-cart-line"></i>
            Pedidos
        </li>
    </Link>

    <Link to="/reservations" className="menu-link">
        <li>
            <i className="ri-calendar-line"></i>
            Reservas
        </li>
    </Link>

    <Link to="/tables" className="menu-link">
        <li>
            <i className="ri-table-line"></i>
            Mesas
        </li>
    </Link>

    <Link to="/clients" className="menu-link">
        <li>
            <i className="ri-user-line"></i>
            Clientes
        </li>
    </Link>

    <Link to="/reports" className="menu-link">
        <li>
            <i className="ri-bar-chart-line"></i>
            Reportes
        </li>
    </Link>

    <Link to="/settings" className="menu-link">
        <li>
            <i className="ri-settings-3-line"></i>
            Configuración
        </li>
    </Link>

</ul>
        <div className="sidebar-image">

          <img src="/vino.jpg" alt="vino" />

          <div className="overlay"></div>

          <div className="sidebar-decor">
            <i className="ri-goblet-line"></i>
          </div>

          <p>
            No es solo comida,
            <br />
            es una experiencia.
          </p>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* HEADER */}
        <div className="header">

          <div>
            <h2>Bienvenido a Aurea</h2>

            <p>
              Tradición e innovación en cada plato.
            </p>
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
                <i className="ri-arrow-right-line"></i>
                Ver menú completo
              </button>

            </div>

            <div className="menu-grid">

              {/* ITEM */}
              <div className="menu-card">

                <img src="/plato1.jpeg" alt="" />

                <div className="menu-card-content">
                  <h4>Costillas de Cordero</h4>

                  <p>
                    Jugosas y perfectamente asadas
                  </p>

                  <span>Q165.00</span>
                </div>

              </div>

              {/* ITEM */}
              <div className="menu-card">

                <img src="/plato2.jpeg" alt="" />

                <div className="menu-card-content">

                  <h4>Cordero al Horno</h4>

                  <p>
                    Cocción lenta con hierbas
                  </p>

                  <span>Q185.00</span>

                </div>

              </div>

              {/* ITEM */}
              <div className="menu-card">

                <img src="/plato3.jpeg" alt="" />

                <div className="menu-card-content">

                  <h4>Brochetas</h4>

                  <p>
                    Toque fresco de limón
                  </p>

                  <span>Q140.00</span>

                </div>

              </div>

              {/* ITEM */}
              <div className="menu-card">

                <img src="/plato4.jpeg" alt="" />

                <div className="menu-card-content">

                  <h4>Tarta</h4>

                  <p>
                    Base crujiente gourmet
                  </p>

                  <span>Q120.00</span>

                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="actions">

              <button className="btn-gold">

                <i className="ri-add-line"></i>
                Agregar Plato

              </button>

              <button className="btn-outline">

                <i className="ri-edit-line"></i>
                Editar Plato

              </button>

              <button className="btn-danger">

                <i className="ri-delete-bin-line"></i>
                Eliminar Plato

              </button>

            </div>

          </div>

          {/* RESERVA */}
          <div className="card reserva">

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

                <i className="ri-arrow-down-s-line arrow-input"></i>

              </div>

            </div>

            <button class="btn-reserva">
    <i class="fa-solid fa-calendar-check"></i>
    Reservar Mesa
</button>

          </div>

          {/* PEDIDOS */}
          <div className="card pedidos">

            <h3>PEDIDOS</h3>

            <button>

              <i className="ri-motorbike-line"></i>

              Pedir a Domicilio

            </button>

            <button>

              <i className="ri-shopping-bag-line"></i>

              Ordenar para Llevar

            </button>

          </div>

          {/* ACCESO */}
          <div className="card acceso">

            <div className="card-header">

              <h3>Acceso rápido</h3>

            </div>

            <div className="quick-grid">

              <div>
                <i className="ri-file-list-3-line"></i>
                <p>Gestión de pedidos</p>
              </div>

              <div>
                <i className="ri-restaurant-line"></i>
                <p>Control de mesas</p>
              </div>

              <div>
                <i className="ri-bar-chart-grouped-line"></i>
                <p>Historial de ventas</p>
              </div>

              <div>
                <i className="ri-user-line"></i>
                <p>Usuarios</p>
              </div>

            </div>

          </div>

          {/* MARIDAJE */}
          <div className="card maridaje">

            <div className="maridaje-content">

              <h3>Maridaje Perfecto</h3>

              <p>
                El acompañamiento ideal para realizar
                cada sabor.
              </p>

              <ul>

                <li>
                  <i className="ri-checkbox-circle-line"></i>
                  Vino recomendado
                </li>

                <li>
                  <i className="ri-checkbox-circle-line"></i>
                  Corte premium
                </li>

                <li>
                  <i className="ri-checkbox-circle-line"></i>
                  Experiencia gourmet
                </li>

              </ul>

            </div>

          </div>

          {/* MESAS */}
          <div className="card mesas">

            <div className="card-header">

              <h3>Estado de Mesas</h3>

              <button className="btn-mini">
                Ver todas
              </button>

            </div>

            <div className="mesas-list">

              {/* ITEM */}
              <div className="mesa-item">

                <div className="mesa-info">

                  <span className="mesa-nombre">
                    Mesa #5
                  </span>

                  <span className="mesa-hora">
                    7:30 PM
                  </span>

                </div>

                <div className="mesa-right">

                  <div className="personas">

                    <i className="ri-user-line"></i>

                    <span>4</span>

                  </div>

                  <span className="estado ocupado">
                    Ocupada
                  </span>

                </div>

              </div>

              {/* ITEM */}
              <div className="mesa-item">

                <div className="mesa-info">

                  <span className="mesa-nombre">
                    Mesa #8
                  </span>

                  <span className="mesa-hora">
                    Disponible
                  </span>

                </div>

                <div className="mesa-right">

                  <div className="personas">

                    <i className="ri-user-line"></i>

                    <span>2</span>

                  </div>

                  <span className="estado disponible">
                    Disponible
                  </span>

                </div>

              </div>

              {/* ITEM */}
              <div className="mesa-item">

                <div className="mesa-info">

                  <span className="mesa-nombre">
                    Mesa #12
                  </span>

                  <span className="mesa-hora">
                    9:00 PM
                  </span>

                </div>

                <div className="mesa-right">

                  <div className="personas">

                    <i className="ri-user-line"></i>

                    <span>6</span>

                  </div>

                  <span className="estado reservada">
                    Reservada
                  </span>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};
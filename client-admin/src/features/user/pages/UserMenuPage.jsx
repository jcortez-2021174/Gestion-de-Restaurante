import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../auth/store/authStore";
import { useCartStore } from "../store/carStore";
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
  { id: 1,  cat: "entradas",  nombre: "Bruschetta Clásica",    desc: "Tomate, albahaca, ajo, aceite de oliva y queso parmesano.",               precio: 49,  tiempo: 15, img: "/plato1.jpeg" },
  { id: 2,  cat: "entradas",  nombre: "Champiñones Rellenos",  desc: "Champiñones rellenos de queso de cabra, espinacas y finas hierbas.",      precio: 59,  tiempo: 20, img: "/Plato8.png" },
  { id: 3,  cat: "entradas",  nombre: "Tartar de Atún",        desc: "Atún fresco, aguacate, sésamo, salsa de soya y aceite de oliva.",         precio: 69,  tiempo: 20, img: "/Plato9.png" },
  { id: 4,  cat: "entradas",  nombre: "Carpaccio de Res",      desc: "Finas láminas de res, rúcula, parmesano y reducción balsámica.",          precio: 65,  tiempo: 15, img: "/Plato10.png" },
  { id: 17, cat: "entradas",  nombre: "Croquetas de Jamón",    desc: "Crujientes croquetas rellenas de jamón serrano y queso manchego.",        precio: 52,  tiempo: 15, img: "/Plato11.png" },
  { id: 18, cat: "entradas",  nombre: "Ceviche Tropical",      desc: "Pescado fresco marinado en limón con mango, cebolla morada y cilantro.",  precio: 68,  tiempo: 20, img: "/Plato12.jpg" },
  { id: 19, cat: "entradas",  nombre: "Queso Fundido",         desc: "Mezcla de quesos gratinados acompañados de tortillas artesanales.",       precio: 58,  tiempo: 15, img: "/Plato13.jpg" },
  { id: 20, cat: "entradas",  nombre: "Calamares Fritos",      desc: "Aros de calamar crujientes con salsa tártara especial.",                  precio: 72,  tiempo: 18, img: "/Plato14.jpg" },
  { id: 21, cat: "entradas",  nombre: "Tabla Mediterránea",    desc: "Selección de quesos, aceitunas, jamón serrano y pan artesanal.",          precio: 89,  tiempo: 20, img: "/Plato15.jpg" },

  { id: 5,  cat: "almuerzos", nombre: "Salmón a la Parrilla",  desc: "Salmón fresco con vegetales salteados y puré de papas.",                 precio: 129, tiempo: 25, img: "/almuerzo1.jpg" },
  { id: 6,  cat: "almuerzos", nombre: "Pasta Alfredo",         desc: "Pasta en salsa alfredo con pollo y queso parmesano.",                    precio: 99,  tiempo: 25, img: "/almuerzo2.jpg" },
  { id: 7,  cat: "almuerzos", nombre: "Risotto de Hongos",     desc: "Arroz arborio con mezcla de hongos, queso parmesano y trufa.",           precio: 110, tiempo: 30, img: "/almuerzo3.jpg" },
  { id: 8,  cat: "almuerzos", nombre: "Filete de Res",         desc: "Filete de res con vegetales asados y salsa de vino tinto.",              precio: 159, tiempo: 30, img: "/almuerzo4.jpg" },
  { id: 22, cat: "almuerzos", nombre: "Pollo Mediterráneo",    desc: "Pechuga de pollo con salsa de limón y vegetales grillados.",             precio: 115, tiempo: 25, img: "/almuerzo5.jpg" },
  { id: 23, cat: "almuerzos", nombre: "Lasagna Boloñesa",      desc: "Capas de pasta con carne, salsa boloñesa y queso gratinado.",            precio: 108, tiempo: 30, img: "/almuerzo6.jpg" },
  { id: 24, cat: "almuerzos", nombre: "Hamburguesa Gourmet",   desc: "Carne premium, queso cheddar, tocino y papas rústicas.",                 precio: 119, tiempo: 25, img: "/almuerzo7.jpg" },
  { id: 25, cat: "almuerzos", nombre: "Paella Española",       desc: "Arroz con mariscos frescos y azafrán al estilo valenciano.",             precio: 145, tiempo: 35, img: "/almuerzo8.jpg" },
  { id: 26, cat: "almuerzos", nombre: "Costillas BBQ",         desc: "Costillas bañadas en salsa BBQ con papas al horno.",                     precio: 155, tiempo: 35, img: "/almuerzo9.jpg" },

  { id: 9,  cat: "cenas",     nombre: "Cordero a las Brasas",  desc: "Costillas de cordero marinadas con hierbas provenzales y chimichurri.",  precio: 185, tiempo: 35, img: "/cena1.jpg" },
  { id: 10, cat: "cenas",     nombre: "Lubina al Horno",       desc: "Lubina entera al horno con limón, alcaparras y tomates cherry.",         precio: 149, tiempo: 30, img: "/cena2.jpg" },
  { id: 27, cat: "cenas",     nombre: "Pato Glaseado",         desc: "Pechuga de pato en reducción de naranja y vino tinto.",                  precio: 195, tiempo: 40, img: "/cena3.jpg" },
  { id: 28, cat: "cenas",     nombre: "Ribeye Premium",        desc: "Corte ribeye acompañado de espárragos y puré cremoso.",                  precio: 210, tiempo: 35, img: "/cena4.jpg" },
  { id: 29, cat: "cenas",     nombre: "Langosta al Ajillo",    desc: "Langosta fresca cocinada en mantequilla y ajo.",                         precio: 245, tiempo: 40, img: "/cena5.png" },
  { id: 30, cat: "cenas",     nombre: "Pollo Trufado",         desc: "Pollo relleno con queso y salsa cremosa de trufa.",                      precio: 165, tiempo: 30, img: "/cena6.png" },
  { id: 31, cat: "cenas",     nombre: "Sushi Deluxe",          desc: "Variedad premium de sushi y sashimi fresco.",                            precio: 185, tiempo: 30, img: "/cena7.jpg" },

  { id: 11, cat: "bebidas",   nombre: "Limonada Natural",      desc: "Jugo de limón fresco con menta y agua mineral.",                        precio: 25,  tiempo: 5,  img: "/bebida1.jpeg" },
  { id: 12, cat: "bebidas",   nombre: "Agua de Jamaica",       desc: "Flor de jamaica, azúcar de caña y hielo.",                              precio: 20,  tiempo: 5,  img: "/bebida2.png" },
  { id: 32, cat: "bebidas",   nombre: "Mojito Cubano",         desc: "Refrescante mezcla de limón, hierbabuena y soda.",                      precio: 35,  tiempo: 5,  img: "/bebida3.jpg" },
  { id: 33, cat: "bebidas",   nombre: "Café Espresso",         desc: "Café espresso intenso preparado al momento.",                           precio: 22,  tiempo: 5,  img: "/bebida4.jpg" },
  { id: 34, cat: "bebidas",   nombre: "Smoothie Tropical",     desc: "Batido natural de mango, piña y coco.",                                 precio: 38,  tiempo: 7,  img: "/bebida5.jpg" },
  { id: 35, cat: "bebidas",   nombre: "Chocolate Caliente",    desc: "Chocolate artesanal caliente con crema batida.",                        precio: 28,  tiempo: 6,  img: "/bebida6.jpeg" },
  { id: 36, cat: "bebidas",   nombre: "Té Frutal",             desc: "Infusión fría de frutos rojos y cítricos.",                             precio: 24,  tiempo: 5,  img: "/bebida7.jpg" },

  { id: 13, cat: "postres",   nombre: "Tiramisú Artesanal",    desc: "Capas de bizcocho, mascarpone y café espresso.",                        precio: 55,  tiempo: 10, img: "/Postre10.jpg" },
  { id: 14, cat: "postres",   nombre: "Tarta de Chocolate",    desc: "Bizcocho húmedo con ganache de chocolate amargo y frambuesas.",         precio: 60,  tiempo: 10, img: "/Postre9.jpg" },
  { id: 37, cat: "postres",   nombre: "Cheesecake de Fresa",   desc: "Pastel de queso cremoso con salsa natural de fresa.",                   precio: 58,  tiempo: 10, img: "/Postre4.jpg" },
  { id: 38, cat: "postres",   nombre: "Brownie con Helado",    desc: "Brownie caliente acompañado de helado de vainilla.",                    precio: 62,  tiempo: 10, img: "/Postre5.jpg" },
  { id: 39, cat: "postres",   nombre: "Crème Brûlée",          desc: "Postre francés con crema de vainilla y caramelo crujiente.",            precio: 65,  tiempo: 12, img: "/Postre6.jpg" },
  { id: 40, cat: "postres",   nombre: "Macarons Franceses",    desc: "Delicados macarons rellenos de crema artesanal.",                       precio: 54,  tiempo: 8,  img: "/Postre7.jpg" },
  { id: 41, cat: "postres",   nombre: "Helado Artesanal",      desc: "Selección de sabores premium preparados artesanalmente.",               precio: 45,  tiempo: 5,  img: "/Postre8.jpg" },

  { id: 15, cat: "combos",    nombre: "Combo Pareja",          desc: "2 entradas + 2 platos principales + 2 postres + 2 bebidas.",            precio: 299, tiempo: 40, img: "/combo1.png" },
  { id: 16, cat: "combos",    nombre: "Combo Familiar",        desc: "4 entradas + 4 platos principales + bebidas ilimitadas.",               precio: 549, tiempo: 45, img: "/combo2.png" },
  { id: 42, cat: "combos",    nombre: "Combo Ejecutivo",       desc: "Entrada + plato fuerte + bebida + postre.",                             precio: 189, tiempo: 30, img: "/combo3.png" },
  { id: 43, cat: "combos",    nombre: "Combo Premium",         desc: "Cena gourmet para dos personas con bebidas incluidas.",                 precio: 399, tiempo: 45, img: "/combo4.png" },
  { id: 44, cat: "combos",    nombre: "Combo Lunch",           desc: "Plato del día + bebida natural + postre pequeño.",                      precio: 129, tiempo: 25, img: "/combo5.jpg" },
  { id: 45, cat: "combos",    nombre: "Combo Fiesta",          desc: "Variedad de entradas y bebidas para compartir.",                        precio: 459, tiempo: 40, img: "/combo6.jpg" },
  { id: 46, cat: "combos",    nombre: "Combo Aurea VIP",       desc: "Experiencia premium con menú degustación y postre especial.",           precio: 699, tiempo: 60, img: "/combo7.jpg" },
];

export const UserMenuPage = () => {
  const user     = useAuthStore((s) => s.user);
  const logout   = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  
  const carrito         = useCartStore((s) => s.carrito);
  const agregarItem     = useCartStore((s) => s.agregarItem);
  const cambiarCantidad = useCartStore((s) => s.cambiarCantidad);
  const eliminarItem    = useCartStore((s) => s.eliminarItem);

  const [catActiva,  setCatActiva]  = useState("entradas");
  const [busqueda,   setBusqueda]   = useState("");
  const [favoritos,  setFavoritos]  = useState([]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("auth-restaurante-Aurea");
    navigate("/login", { replace: true });
  };

  const toggleFav = (id) =>
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );

  const subtotal   = carrito.reduce((a, i) => a + i.precio * i.cantidad, 0);
  const impuestos  = +(subtotal * 0.12).toFixed(2);
  const total      = +(subtotal + impuestos).toFixed(2);
  const totalItems = carrito.reduce((a, i) => a + i.cantidad, 0);

  const platosFiltrados = PLATOS.filter(
    (p) =>
      p.cat === catActiva &&
      (busqueda === "" ||
        p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.desc.toLowerCase().includes(busqueda.toLowerCase()))
  );

  const groupedPlatos = PLATOS.filter((p) =>
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
          <Link to="/home" className="menu-link"><li><i className="ri-home-4-line"></i> Inicio</li></Link>
          <Link to="/user/menu" className="menu-link"><li className="active"><i className="ri-restaurant-line"></i> Menú</li></Link>
          <Link to="/user/reservations" className="menu-link"><li><i className="ri-calendar-line"></i> Reservas</li></Link>
          <Link to="/user/orders" className="menu-link">
            <li>
              <i className="ri-motorbike-line"></i> Pedidos
              {totalItems > 0 && <span className="menu-badge">{totalItems}</span>}
            </li>
          </Link>
          <Link to="/user/nosotros" className="menu-link"><li><i className="ri-group-line"></i> Sobre Nosotros</li></Link>
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

      <main className="main" style={{ padding: "28px", position: "relative" }}>
        <div className="menu-topbar">
          <div>
            <h1 className="menu-page-title">Nuestro Menú</h1>
            <p className="menu-page-sub">Descubre nuestros platillos preparados con los mejores ingredientes.</p>
          </div>
          <div className="menu-topbar-right">
            <div className="menu-search-box">
              <i className="ri-search-line"></i>
              <input type="text" placeholder="Buscar platillos, ingredientes..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
            </div>
            <div className="notification" style={{ color: "var(--gold)", fontSize: "22px", position: "relative", cursor: "pointer" }}>
              <i className="ri-notification-3-line"></i>
              <span className="badge">2</span>
            </div>
            <button className="menu-cart-btn">
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

        <div className="menu-layout">
          <div className="menu-content-col">
            <div className="menu-cats">
              {CATEGORIAS.map((c) => (
                <button key={c.id} className={`menu-cat-btn${catActiva === c.id && busqueda === "" ? " activa" : ""}`} onClick={() => { setCatActiva(c.id); setBusqueda(""); }}>
                  <i className={c.icon}></i> {c.label}
                </button>
              ))}
            </div>

            <div className="menu-filtros">
              <select className="menu-select"><option>Todos los ingredientes</option><option>Sin gluten</option><option>Vegetariano</option><option>Vegano</option></select>
              <select className="menu-select"><option>Ordenar por: Recomendados</option><option>Precio: menor a mayor</option><option>Precio: mayor a menor</option><option>Más rápido</option></select>
              <button className="menu-filtrar-btn"><i className="ri-equalizer-line"></i> Filtrar</button>
            </div>

            <div className="menu-section-title">
              <span className="menu-section-line"></span>
              {busqueda !== "" ? `Resultados para "${busqueda}"` : CATEGORIAS.find((c) => c.id === catActiva)?.label}
            </div>

            <div className="menu-platos-grid">
              {renderPlatos.length === 0 ? (
                <p style={{ color: "#666", gridColumn: "1/-1", padding: "40px 0" }}>No se encontraron platillos.</p>
              ) : (
                renderPlatos.map((plato) => (
                  <div className="plato-card" key={plato.id}>
                    <div className="plato-card-img-wrap">
                      <img src={plato.img} alt={plato.nombre} />
                      <button className={`plato-fav-btn${favoritos.includes(plato.id) ? " activo" : ""}`} onClick={() => toggleFav(plato.id)}>
                        <i className={favoritos.includes(plato.id) ? "ri-heart-fill" : "ri-heart-line"}></i>
                      </button>
                    </div>
                    <div className="plato-card-body">
                      <h4>{plato.nombre}</h4>
                      <p>{plato.desc}</p>
                      <div className="plato-meta"><span><i className="ri-time-line"></i> {plato.tiempo} min</span></div>
                      <div className="plato-card-footer">
                        <span className="plato-precio">Q{plato.precio}.00</span>
                        <button className="btn-add-cart" onClick={() => agregarItem(plato)}>
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
      </main>

      <a href="https://wa.me/50255551234" target="_blank" rel="noreferrer"
        style={{ position:"fixed", bottom:"30px", right:"30px", background:"#25d366", color:"white", width:"60px", height:"60px", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"30px", zIndex:"1000", boxShadow:"0 4px 10px rgba(0,0,0,0.3)" }}>
        <i className="ri-whatsapp-line"></i>
      </a>
    </div>
  );
};
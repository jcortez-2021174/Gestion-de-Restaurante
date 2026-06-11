import { useEffect, useState } from "react";
import { listarProductos } from "../../../services/productos.service";
import { useAuthStore } from "../../auth/store/authStore";
import { UserShell } from "../components/UserShell";
import { CartPanel } from "../components/CartPanel";
import {
  PrimaryButton,
  SecondaryButton,
  SectionHeader,
  UserProfileCard,
} from "../components/UserUi";
import { useCartStore } from "../store/carStore";
import { mapVisibleMenuProducts } from "../menu.products";
import { obtenerMisPuntos } from "../../../services/puntos.service";
import "../styles/user-dashboard.css";

const services = [
  {
    icon: "ri-calendar-check-line",
    title: "Reserva tu mesa",
    description: "Asegura tu lugar para una experiencia inolvidable.",
    to: "/user/reservations",
    action: "Reservar ahora",
  },
  {
    icon: "ri-motorbike-line",
    title: "Pedidos a domicilio",
    description: "Disfruta de Aurea en la comodidad de tu hogar.",
    to: "/user/menu",
    action: "Pedir ahora",
  },
  {
    icon: "ri-shopping-bag-line",
    title: "Para llevar",
    description: "Haz tu pedido y recógelo en nuestro restaurante.",
    to: "/user/menu",
    action: "Ordenar ahora",
  },
  {
    icon: "ri-goblet-line",
    title: "Maridaje perfecto",
    description: "Conoce la selección que acompaña cada creación.",
    to: "/user/nosotros",
    action: "Explorar más",
  },
];

export const UserDashboardPage = () => {
  const user = useAuthStore((state) => state.user);
  const agregarItem = useCartStore((state) => state.agregarItem);
  const sincronizarCatalogo = useCartStore((state) => state.sincronizarCatalogo);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loyalty, setLoyalty] = useState(null);

  useEffect(() => {
    let active = true;

    listarProductos()
      .then((response) => {
        if (active) {
          const products = mapVisibleMenuProducts(response);
          setFeaturedProducts(products.slice(0, 4));
          sincronizarCatalogo(products);
        }
      })
      .catch(() => {
        if (active) setFeaturedProducts([]);
      });

    obtenerMisPuntos().then(setLoyalty).catch(() => setLoyalty(null));

    return () => {
      active = false;
    };
  }, [sincronizarCatalogo]);

  return (
    <UserShell contentClassName="user-dashboard">
      <section className="dashboard-hero-layout">
        <div className="dashboard-hero">
          <img src="/Plato5.png" alt="" className="dashboard-hero-image" />
          <div className="dashboard-hero-overlay" />
          <div className="dashboard-profile">
            <UserProfileCard user={user} compact level={loyalty?.nivel} />
          </div>
          <div className="dashboard-hero-copy">
            <span className="dashboard-kicker">Bienvenido a Aurea</span>
            <h1>El Arte del<br /><em>Cordero</em></h1>
            <p>Tradición e innovación en cada plato.<br />Una experiencia gastronómica única.</p>
            <div className="dashboard-hero-actions">
              <PrimaryButton to="/user/menu" icon="ri-book-open-line">Ver Menú</PrimaryButton>
              <SecondaryButton to="/user/reservations" icon="ri-calendar-check-line">
                Reservar Mesa
              </SecondaryButton>
            </div>
          </div>
          <a href="#menu-destacado" className="dashboard-scroll-cue" aria-label="Ir al menú destacado">
            <i className="ri-arrow-down-line" />
          </a>
        </div>
        <CartPanel title="Mi pedido" />
      </section>

      <section className="dashboard-featured" id="menu-destacado">
        {loyalty && (
          <div className="dashboard-loyalty-card">
            <i className="ri-vip-crown-line" />
            <div><span>Nivel {loyalty.nivel}</span><strong>{loyalty.puntos.toLocaleString("es-GT")} Puntos Aurea</strong></div>
            <SecondaryButton to="/user/puntos">Ver recompensas</SecondaryButton>
          </div>
        )}
        <SectionHeader
          eyebrow="Selección Aurea"
          title="Menú destacado"
          description="Platos que representan nuestra cocina y el carácter de la casa."
          action={<SecondaryButton to="/user/menu" icon="ri-arrow-right-line">Ver menú completo</SecondaryButton>}
        />
        <div className="dashboard-product-grid">
          {featuredProducts.map((product) => (
            <article className="dashboard-product-card" key={product.id}>
              <div className="dashboard-product-image">
                <img src={product.imagen} alt={product.nombre} />
                <span>{product.categoriaNombre}</span>
              </div>
              <div className="dashboard-product-body">
                <h3>{product.nombre}</h3>
                <p>{product.descripcion}</p>
                <div>
                  <strong>Q{product.precio.toFixed(2)}</strong>
                  <button
                    type="button"
                    onClick={() => agregarItem(product)}
                    aria-label={`Agregar ${product.nombre} al carrito`}
                  >
                    <i className="ri-add-line" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-services">
        {services.map((service) => (
          <article key={service.title}>
            <i className={service.icon} />
            <div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <SecondaryButton to={service.to} icon="ri-arrow-right-line">{service.action}</SecondaryButton>
            </div>
          </article>
        ))}
      </section>
    </UserShell>
  );
};

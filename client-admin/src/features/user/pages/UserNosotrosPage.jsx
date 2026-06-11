import { UserShell } from "../components/UserShell";
import { PrimaryButton, SecondaryButton, SectionHeader } from "../components/UserUi";
import "../styles/usernosotros.css";

const values = [
  { icon: "ri-leaf-line", title: "Ingredientes frescos", description: "Seleccionamos productos locales e internacionales de primera calidad." },
  { icon: "ri-vip-crown-line", title: "Atención premium", description: "Servicio cálido, profesional y atento a cada detalle." },
  { icon: "ri-goblet-line", title: "Ambiente exclusivo", description: "Un espacio elegante y acogedor para momentos únicos." },
  { icon: "ri-shield-check-line", title: "Calidad garantizada", description: "Cuidamos cada proceso para entregar una experiencia excepcional." },
];

const gallery = [
  "/Plato6.png", "/Plato7.png", "/Plato8.png",
  "/Plato9.png", "/Plato10.png", "/Plato11.png",
  "/cena1.jpg", "/cena2.jpg", "/Postre1.png",
];

export const UserNosotrosPage = () => (
  <UserShell contentClassName="user-about-page">
    <section className="nos-hero" style={{ backgroundImage: "url('/Plato6.png')" }}>
      <div className="nos-hero-overlay" />
      <div className="nos-hero-content">
        <span className="nos-hero-label">Aurea Restaurant Manager</span>
        <h1>Sobre Nosotros</h1>
        <p>Conoce nuestra historia, nuestra pasión y el compromiso que ponemos en cada detalle.</p>
      </div>
    </section>

    <section className="nos-two-col">
      <article className="nos-historia-card card">
        <div className="nos-historia-img-wrap"><img src="/chef.png" alt="Equipo de cocina Aurea" /></div>
        <div className="nos-historia-body">
          <span className="nos-label-small">Nuestra historia</span>
          <h2>Pasión que se transforma en sabor</h2>
          <p>Nacimos en 2015 con un sueño: ofrecer cocina exquisita, ingredientes frescos y técnicas modernas en un ambiente memorable.</p>
          <p>Hoy seguimos comprometidos con la calidad, el detalle y la creación de momentos inolvidables.</p>
          <div className="nos-stats">
            <Stat icon="ri-award-line" value="10+" label="Años de experiencia" />
            <Stat icon="ri-restaurant-2-line" value="5" label="Chefs expertos" />
            <Stat icon="ri-group-line" value="2000+" label="Clientes felices" />
          </div>
        </div>
      </article>

      <article className="nos-chef-card card">
        <div className="nos-chef-img-wrap"><img src="/chef2.jpg" alt="Chef ejecutivo de Aurea" /></div>
        <div className="nos-chef-body">
          <span className="nos-label-small">Nuestro chef</span>
          <h2 className="nos-chef-nombre">Chef Ejecutivo</h2>
          <p className="nos-chef-firma">Marco Aurea</p>
          <blockquote className="nos-chef-quote">
            La cocina es arte, pasión y precisión. Cada platillo está pensado para emocionar y sorprender.
          </blockquote>
        </div>
      </article>
    </section>

    <section className="nos-valores-section">
      <SectionHeader eyebrow="Nuestra esencia" title="Valores Aurea" />
      <div className="nos-valores-grid">
        {values.map((value) => (
          <article className="nos-valor-item" key={value.title}>
            <div className="nos-valor-icon"><i className={value.icon} /></div>
            <h3>{value.title}</h3>
            <p>{value.description}</p>
          </article>
        ))}
      </div>
    </section>

    <section className="nos-galeria-section">
      <SectionHeader eyebrow="Momentos Aurea" title="Nuestra galería" />
      <div className="nos-galeria-grid">
        {gallery.map((src, index) => (
          <figure className="nos-galeria-item" key={src}>
            <img src={src} alt={`Experiencia Aurea ${index + 1}`} />
          </figure>
        ))}
      </div>
      <SecondaryButton icon="ri-grid-line">Ver más fotos</SecondaryButton>
    </section>

    <section className="nos-cta" style={{ backgroundImage: "url('/vino2.jpg')" }}>
      <div className="nos-cta-overlay" />
      <div className="nos-cta-content">
        <span className="nos-label-small">Vive la experiencia Aurea</span>
        <h2>Te invitamos a ser parte de nuestra historia</h2>
        <p>Reserva tu mesa y disfruta de una experiencia culinaria única.</p>
        <div className="nos-cta-btns">
          <PrimaryButton to="/user/reservations" icon="ri-calendar-check-line">Reservar ahora</PrimaryButton>
          <SecondaryButton to="/user/menu" icon="ri-restaurant-line">Ver menú</SecondaryButton>
        </div>
      </div>
    </section>
  </UserShell>
);

const Stat = ({ icon, value, label }) => (
  <div className="nos-stat">
    <i className={icon} />
    <div><span className="nos-stat-num">{value}</span><span className="nos-stat-label">{label}</span></div>
  </div>
);

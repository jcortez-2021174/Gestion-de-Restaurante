import "../styles/auth.css";

export const AuthFrame = ({ children, scroll = false }) => (
  <div className={`auth-page${scroll ? " auth-page-scroll" : ""}`}>
    <div className="auth-bg" style={{ backgroundImage: "url('/Fondo.jpg')" }} />
    <div className="auth-light auth-light-1" />
    <div className="auth-light auth-light-2" />
    <div className="auth-grid" />
    <div className="auth-card">
      <div className="auth-logo-wrap">
        <img src="/logo.png" alt="Logo Aurea" className="auth-logo-img" />
      </div>
      <div className="auth-ornament">
        <div className="auth-orn-line" />
        <div className="auth-orn-dot" />
        <div className="auth-orn-diamond" />
        <div className="auth-orn-dot" />
        <div className="auth-orn-line" />
      </div>
      {children}
    </div>
  </div>
);

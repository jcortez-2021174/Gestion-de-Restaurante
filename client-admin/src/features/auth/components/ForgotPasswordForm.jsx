export const ForgotPasswordForm = ({ onBack }) => {

  return (
    <div>

      <h1 className="auth-title">
        Recuperar Contraseña
      </h1>

      <p className="auth-subtitle">
        Recuperación próximamente
      </p>

      <button
        className="btn-login"
        onClick={onBack}
      >
        Volver al Login
      </button>

    </div>
  );
};
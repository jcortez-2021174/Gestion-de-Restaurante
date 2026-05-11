import { LoginForm } from "./LoginForm";

export const Login = ({ onForgot }) => {
  return (
    <div className="auth-content">

      {/* Título */}
      <h1 className="auth-title">
        Bienvenido de Nuevo
      </h1>

      {/* Subtítulo */}
      <p className="auth-subtitle">
        Ingresa a tu cuenta de administrador
      </p>

      {/* Formulario */}
      <LoginForm onForgot={onForgot} />

    </div>
  );
};
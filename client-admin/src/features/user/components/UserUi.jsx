import { Link } from "react-router-dom";

const ButtonContent = ({ icon, children }) => (
  <>
    {icon && <i className={icon} />}
    <span>{children}</span>
  </>
);

export const PrimaryButton = ({ to, icon, children, className = "", ...props }) => {
  const classes = `user-button user-button-primary ${className}`.trim();
  return to ? (
    <Link to={to} className={classes}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Link>
  ) : (
    <button type="button" className={classes} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
};

export const SecondaryButton = ({ to, icon, children, className = "", ...props }) => {
  const classes = `user-button user-button-secondary ${className}`.trim();
  return to ? (
    <Link to={to} className={classes}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </Link>
  ) : (
    <button type="button" className={classes} {...props}>
      <ButtonContent icon={icon}>{children}</ButtonContent>
    </button>
  );
};

export const SectionHeader = ({ eyebrow, title, description, action }) => (
  <div className="user-section-header">
    <div>
      {eyebrow && <span className="user-section-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </div>
    {action && <div className="user-section-action">{action}</div>}
  </div>
);

export const UserProfileCard = ({ user, compact = false, level }) => (
  <div className={`user-profile-card${compact ? " is-compact" : ""}`}>
    <span className="user-profile-icon"><i className="ri-user-line" /></span>
    <span className="user-profile-copy">
      <strong>{user?.username || user?.name || "Cliente Aurea"}</strong>
      <small>{level ? `Nivel ${level}` : "Cliente Premium"}</small>
    </span>
  </div>
);

const State = ({ tone, icon, title, description, action }) => (
  <div className={`user-state user-state-${tone}`} role={tone === "error" ? "alert" : undefined}>
    <span className="user-state-icon"><i className={icon} /></span>
    <div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action && <div className="user-state-action">{action}</div>}
    </div>
  </div>
);

export const LoadingState = ({ title = "Cargando", description = "Estamos preparando la información." }) => (
  <State tone="loading" icon="ri-loader-4-line" title={title} description={description} />
);

export const ErrorState = ({ title = "No pudimos cargar la información", description, onRetry }) => (
  <State
    tone="error"
    icon="ri-error-warning-line"
    title={title}
    description={description}
    action={onRetry && <SecondaryButton icon="ri-refresh-line" onClick={onRetry}>Reintentar</SecondaryButton>}
  />
);

export const EmptyState = ({ icon = "ri-inbox-2-line", title, description, action }) => (
  <State tone="empty" icon={icon} title={title} description={description} action={action} />
);

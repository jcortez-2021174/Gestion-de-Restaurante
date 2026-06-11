export const authorizeRole = (...allowedRoles) => {
  const normalizedAllowedRoles = allowedRoles.map((role) =>
    String(role).trim().toUpperCase()
  );

  return (req, res, next) => {
    const rawRole = req.auth?.role;
    const roles = (Array.isArray(rawRole) ? rawRole : [rawRole])
      .filter(Boolean)
      .map((role) => String(role).trim().toUpperCase());

    if (roles.length === 0) {
      return res.status(403).json({
        success: false,
        code: 'AUTH_ROLE_MISSING',
        message: 'El usuario autenticado no tiene un rol asignado',
      });
    }

    if (!roles.some((role) => normalizedAllowedRoles.includes(role))) {
      return res.status(403).json({
        success: false,
        code: 'AUTH_ROLE_FORBIDDEN',
        message: 'No tienes permiso para realizar esta accion',
      });
    }

    next();
  };
};

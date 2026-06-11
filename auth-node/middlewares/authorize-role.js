export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.auth?.role;

    if (!role) {
      return res.status(403).json({
        success: false,
        code: 'AUTH_ROLE_MISSING',
        message: 'El usuario autenticado no tiene un rol asignado',
      });
    }

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        success: false,
        code: 'AUTH_ROLE_FORBIDDEN',
        message: 'No tienes permiso para realizar esta accion',
      });
    }

    next();
  };
};

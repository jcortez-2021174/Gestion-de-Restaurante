import jwt from 'jsonwebtoken';

const bearerToken = (authorization = '') => {
  const [scheme, token] = authorization.trim().split(/\s+/);
  return scheme?.toLowerCase() === 'bearer' && token ? token : null;
};

export const createValidateJWT = ({
  secret = process.env.JWT_SECRET,
  issuer = process.env.JWT_ISSUER,
  audience = process.env.JWT_AUDIENCE,
} = {}) => {
  return (req, res, next) => {
    if (!secret || !issuer || !audience) {
      return res.status(500).json({
        success: false,
        code: 'AUTH_CONFIGURATION_ERROR',
        message: 'La validacion JWT no esta configurada',
      });
    }

    const token = bearerToken(req.header('Authorization'));
    if (!token) {
      return res.status(401).json({
        success: false,
        code: 'AUTH_TOKEN_MISSING',
        message: 'Se requiere un token Bearer',
      });
    }

    try {
      const decoded = jwt.verify(token, secret, {
        algorithms: ['HS256'],
        issuer,
        audience,
      });

      if (!decoded.sub) {
        return res.status(401).json({
          success: false,
          code: 'AUTH_SUBJECT_MISSING',
          message: 'El token no contiene una identidad valida',
        });
      }

      req.auth = {
        userId: decoded.sub,
        role:
          decoded.role ||
          decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
          decoded.roles?.[0] ||
          null,
        claims: decoded,
      };
      req.usuario = decoded;
      next();
    } catch {
      return res.status(401).json({
        success: false,
        code: 'AUTH_TOKEN_INVALID',
        message: 'Token invalido o expirado',
      });
    }
  };
};

export const validateJWT = (req, res, next) => {
  return createValidateJWT()(req, res, next);
};

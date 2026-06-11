import { timingSafeEqual } from 'node:crypto';

const secureEquals = (left, right) => {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer);
};

export const validateInternalApiKey = (req, res, next) => {
  const configuredKey = process.env.IDENTITY_PROVISIONING_KEY;
  const providedKey = req.header('X-Internal-API-Key');

  if (!configuredKey) {
    return res.status(500).json({
      success: false,
      code: 'IDENTITY_PROVISIONING_NOT_CONFIGURED',
      message: 'El aprovisionamiento de identidad no esta configurado',
    });
  }

  if (!providedKey || !secureEquals(providedKey, configuredKey)) {
    return res.status(401).json({
      success: false,
      code: 'INVALID_INTERNAL_API_KEY',
      message: 'Credencial interna invalida',
    });
  }

  next();
};

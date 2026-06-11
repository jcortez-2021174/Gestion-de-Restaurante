import rateLimit from "express-rate-limit";

export const requestLimit = rateLimit({
  windowMs: 60 * 1000,
  limit: 180,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.method === "OPTIONS" || req.path.endsWith("/health"),
  handler: (req, res) => {
    console.log(`Peticiones excedidas desde IP: ${req.ip}, Endpoint: ${req.path}`);
    res.status(429).json({
      success: false,
      code: "RATE_LIMIT_EXCEEDED",
      message: "Demasiadas peticiones desde esta IP, intenta de nuevo mas tarde",
      retryAfter: Math.max(
        1,
        Math.round((req.rateLimit.resetTime - Date.now()) / 1000)
      ),
    });
  },
});

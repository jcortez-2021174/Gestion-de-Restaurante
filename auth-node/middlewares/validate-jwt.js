import jwt from "jsonwebtoken";

export const validateJWT = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ msg: "No hay token" });
  }

  try {
    const decoded = jwt.verify(token, "secretKey");
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Token inválido" });
  }
};
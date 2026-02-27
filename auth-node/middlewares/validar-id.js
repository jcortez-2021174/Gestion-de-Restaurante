export const validarId = (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ msg: "ID es obligatorio" });
  }

  next();
};
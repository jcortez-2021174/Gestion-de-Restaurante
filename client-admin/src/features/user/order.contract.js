export const isMongoObjectId = (value) => (
  typeof value === 'string' && /^[a-f\d]{24}$/i.test(value)
);

export const createOrderPayload = (cartItems, mesaId = null) => ({
  mesaId,
  productos: cartItems.map((item) => ({
    productoId: String(item.id),
    cantidad: item.cantidad,
  })),
});

export const mapMenuProduct = (product, index = 0) => {
  const category = product.idCategoria;
  const categoryIsPopulated = category && typeof category === 'object';

  return {
    id: String(product._id || product.id),
    nombre: product.nombre,
    descripcion: product.descripcion
      || (categoryIsPopulated ? category.descripcion : null)
      || 'Preparado con ingredientes seleccionados.',
    precio: Number(product.precio),
    disponibilidad: product.disponibilidad,
    categoriaId: String(
      (categoryIsPopulated ? category._id || category.id : category)
      || product.categoriaId
      || 'sin-categoria',
    ),
    categoriaNombre: (categoryIsPopulated ? category.nombre : null)
      || product.categoriaNombre
      || 'Menu',
    imagen: product.imagen || product.image || `/plato${(index % 3) + 1}.jpeg`,
  };
};

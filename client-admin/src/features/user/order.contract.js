export const createOrderPayload = (cartItems, mesaId = null) => ({
  mesaId,
  productos: cartItems.map((item) => ({
    productoId: item.id,
    cantidad: item.cantidad,
  })),
});

export const mapMenuProduct = (product, index = 0) => ({
  id: product._id,
  nombre: product.nombre,
  descripcion: product.idCategoria?.descripcion || 'Preparado con ingredientes seleccionados.',
  precio: Number(product.precio),
  disponibilidad: product.disponibilidad,
  categoriaId: product.idCategoria?._id || 'sin-categoria',
  categoriaNombre: product.idCategoria?.nombre || 'Menu',
  imagen: `/plato${(index % 3) + 1}.jpeg`,
});

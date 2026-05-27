import  Producto  from './producto.model.js';
import '../categoria/categoria.model.js'; 

export const crearProducto = async (data) => {
  const producto = new Producto(data);
  return await producto.save();
};

export const listarProductos = async () => {
  return await Producto.find()
    .populate('idCategoria', 'nombre')
    .sort({ createdAt: -1 });
};

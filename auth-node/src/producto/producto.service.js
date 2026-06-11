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

export const buscarProductos = async ({ buscar, categoria, disponibilidad } = {}) => {
  const query = {};
  if (buscar) query.nombre = { $regex: buscar.trim(), $options: 'i' };
  if (categoria) query.idCategoria = categoria;
  if (disponibilidad) query.disponibilidad = disponibilidad;

  return Producto.find(query)
    .populate('idCategoria', 'nombre descripcion estado')
    .sort({ createdAt: -1 });
};

export const obtenerProductoPorId = async (id) => {
  return await Producto.findById(id)
    .populate('idCategoria', 'nombre');
};

export const actualizarProducto = async (id, data) => {
  return await Producto.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  ).populate('idCategoria', 'nombre');
};

export const eliminarProducto = async (id) => {
  return await Producto.findByIdAndDelete(id);
};

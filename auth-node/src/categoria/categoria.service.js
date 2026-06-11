import Categoria from './categoria.model.js';
import Producto from '../producto/producto.model.js';

export class CategoriaError extends Error {
    constructor(code, message, status = 400) {
        super(message);
        this.code = code;
        this.status = status;
    }
}

const withProductCount = async (categorias) => {
    const counts = await Producto.aggregate([
        { $group: { _id: '$idCategoria', total: { $sum: 1 } } },
    ]);
    const byCategory = new Map(counts.map((item) => [item._id.toString(), item.total]));

    return categorias.map((categoria) => ({
        ...categoria.toObject(),
        productos: byCategory.get(categoria._id.toString()) || 0,
    }));
};

const crearCategoria = async (data) =>
{
    const existe = await Categoria.findOne({ nombre: data.nombre });

    if (existe)
        throw new Error('Ya existe una categoria con ese nombre');

    return await Categoria.create(data);
};

const obtenerCategorias = async () =>
{
    const categorias = await Categoria.find().sort({ nombre: 1 });
    return withProductCount(categorias);
};

const obtenerCategoriaPorId = async (id) =>
{
    const categoria = await Categoria.findById(id);

    if (!categoria)
        throw new Error('Categoria no encontrada');

    return categoria;
};

const actualizarCategoria = async (id, data) =>
{
    const categoria = await Categoria.findByIdAndUpdate(id, data, { new: true, runValidators: true });

    if (!categoria)
        throw new Error('Categoria no encontrada');

    return categoria;
};

const eliminarCategoria = async (id) =>
{
    const productosAsociados = await Producto.countDocuments({ idCategoria: id });
    if (productosAsociados > 0) {
        throw new CategoriaError(
            'CATEGORY_IN_USE',
            `La categoria tiene ${productosAsociados} producto(s) asociado(s)`,
            409
        );
    }

    const categoria = await Categoria.findByIdAndDelete(id);

    if (!categoria)
        throw new Error('Categoria no encontrada');

    return categoria;
};

export default {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};

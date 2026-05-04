import Categoria from './categoria.model.js';

const crearCategoria = async (data) =>
{
    const existe = await Categoria.findOne({ nombre: data.nombre });

    if (existe)
        throw new Error('Ya existe una categoria con ese nombre');

    return await Categoria.create(data);
};

const obtenerCategorias = async () =>
{
    return await Categoria.find().sort({ nombre: 1 });
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
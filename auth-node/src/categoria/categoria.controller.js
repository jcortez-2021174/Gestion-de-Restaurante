const categoriaService = require('../services/categoria.service');

const crear = async (req, res) =>
{
    try
    {
        const categoria = await categoriaService.crearCategoria(req.body);
        res.status(201).json({ mensaje: 'Categoria creada correctamente', data: categoria });
    }
    catch (error)
    {
        res.status(400).json({ mensaje: error.message });
    }
};

const listar = async (req, res) =>
{
    try
    {
        const categorias = await categoriaService.obtenerCategorias();
        res.json(categorias);
    }
    catch (error)
    {
        res.status(500).json({ mensaje: 'Error al obtener categorias' });
    }
};

const obtener = async (req, res) =>
{
    try
    {
        const categoria = await categoriaService.obtenerCategoriaPorId(req.params.id);
        res.json(categoria);
    }
    catch (error)
    {
        res.status(404).json({ mensaje: error.message });
    }
};

const actualizar = async (req, res) =>
{
    try
    {
        const categoria = await categoriaService.actualizarCategoria(req.params.id, req.body);
        res.json({ mensaje: 'Categoria actualizada', data: categoria });
    }
    catch (error)
    {
        res.status(400).json({ mensaje: error.message });
    }
};

const eliminar = async (req, res) =>
{
    try
    {
        await categoriaService.eliminarCategoria(req.params.id);
        res.json({ mensaje: 'Categoria eliminada' });
    }
    catch (error)
    {
        res.status(404).json({ mensaje: error.message });
    }
};

module.exports =
{
    crear,
    listar,
    obtener,
    actualizar,
    eliminar
};
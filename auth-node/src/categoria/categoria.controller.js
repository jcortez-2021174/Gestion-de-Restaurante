import categoriaService from './categoria.service.js';

const sendError = (res, error, fallbackStatus = 400) => res
    .status(error.status || fallbackStatus)
    .json({
        success: false,
        code: error.code || 'CATEGORY_ERROR',
        message: error.message,
    });

const crear = async (req, res) =>
{
    try
    {
        const categoria = await categoriaService.crearCategoria(req.body);
        res.status(201).json({ mensaje: 'Categoria creada correctamente', data: categoria });
    }
    catch (error)
    {
        sendError(res, error);
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
        sendError(res, error, 500);
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
        sendError(res, error, 404);
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
        sendError(res, error);
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
        sendError(res, error, 404);
    }
};

export default {
    crear,
    listar,
    obtener,
    actualizar,
    eliminar
};

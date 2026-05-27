import { validationResult } from 'express-validator';

import {

    crearCliente,
    listarClientes,
    editarCliente,
    eliminarCliente

} from './cliente.service.js';

import Pedido from '../pedido/pedido.model.js';

import Cliente from './cliente.model.js';

/* =========================================
   AGREGAR CLIENTE
========================================= */

export const agregarCliente = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            errors: errors.array()

        });

    }

    try {

        const {

            nombre,
            apellido,
            telefono,
            correo,
            direccion

        } = req.body;

        const nuevoCliente = await crearCliente({

            nombre,
            apellido,
            telefono,
            correo,
            direccion

        });

        return res.status(201).json({

            success: true,

            message:
                'Cliente registrado correctamente en Áurea Restaurant',

            data:
                nuevoCliente

        });

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    'El correo electrónico ya está registrado'

            });

        }

        if (error.name === 'ValidationError') {

            const mensajes = Object.values(
                error.errors
            ).map((e) => e.message);

            return res.status(400).json({

                success: false,

                message:
                    mensajes.join(', ')

            });

        }

        return res.status(500).json({

            success: false,

            message:
                'Error interno del servidor',

            error:
                error.message

        });

    }

};

/* =========================================
   LISTAR CLIENTES
========================================= */

export const listarClientesCtrl = async (req, res) => {

    try {

        const clientes =
            await listarClientes();

        return res.status(200).json({

            success: true,

            total:
                clientes.length,

            data:
                clientes

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                'Error interno del servidor',

            error:
                error.message

        });

    }

};

/* =========================================
   EDITAR CLIENTE
========================================= */

export const editarClienteCtrl = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({

            success: false,

            errors:
                errors.array()

        });

    }

    try {

        const { id } = req.params;

        const {

            nombre,
            apellido,
            telefono,
            correo,
            direccion

        } = req.body;

        const clienteActualizado =
            await editarCliente(id, {

                nombre,
                apellido,
                telefono,
                correo,
                direccion

            });

        if (!clienteActualizado) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente no encontrado'

            });

        }

        return res.status(200).json({

            success: true,

            message:
                'Cliente actualizado correctamente',

            data:
                clienteActualizado

        });

    } catch (error) {

        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    'El correo electrónico ya está en uso'

            });

        }

        return res.status(500).json({

            success: false,

            message:
                'Error interno del servidor',

            error:
                error.message

        });

    }

};

/* =========================================
   ELIMINAR CLIENTE
========================================= */

export const eliminarClienteCtrl = async (req, res) => {

    try {

        const { id } = req.params;

        const clienteEliminado =
            await eliminarCliente(id);

        if (!clienteEliminado) {

            return res.status(404).json({

                success: false,

                message:
                    'Cliente no encontrado'

            });

        }

        return res.status(200).json({

            success: true,

            message:
                'Cliente eliminado correctamente'

            });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                'Error interno del servidor',

            error:
                error.message

        });

    }

};

/* =========================================
   DASHBOARD CLIENTES
========================================= */

export const getClientesDashboard = async (req, res) => {

    try {

        const clientes =
            await Cliente.find();

        const clientesDashboard =
            await Promise.all(

                clientes.map(async (cliente) => {

                    const pedidos =
                        await Pedido.find({

                            IdCliente:
                                cliente._id

                        })
                        .populate(
                            'Productos.IdProducto'
                        )
                        .sort({
                            Fecha: -1
                        });

                    /* =========================================
                       TOTAL COMPRAS
                    ========================================= */

                    const totalCompras =
                        pedidos.reduce(

                            (acc, pedido) =>

                                acc + pedido.Total,

                            0

                        );

                    /* =========================================
                       PRODUCTO FAVORITO
                    ========================================= */

                    const productosMap = {};

                    pedidos.forEach((pedido) => {

                        pedido.Productos.forEach((producto) => {

                            const nombre =

                                producto.IdProducto?.nombre ||

                                'Producto';

                            if (!productosMap[nombre]) {

                                productosMap[nombre] = 0;

                            }

                            productosMap[nombre] +=
                                producto.Cantidad;

                        });

                    });

                    let productoFavorito =
                        'Sin pedidos';

                    let maxCantidad = 0;

                    Object.entries(productosMap).forEach(

                        ([nombre, cantidad]) => {

                            if (cantidad > maxCantidad) {

                                maxCantidad =
                                    cantidad;

                                productoFavorito =
                                    nombre;

                            }

                        }

                    );

                    /* =========================================
                       HISTORIAL
                    ========================================= */

                    const historial =
                        pedidos
                        .slice(0, 5)
                        .map((pedido) => ({

                            codigo:
                                pedido._id
                                    .toString()
                                    .slice(-6),

                            fecha:
                                new Date(
                                    pedido.Fecha
                                ).toLocaleDateString(),

                            total:
                                pedido.Total

                        }));

                    /* =========================================
                       ÚLTIMA VISITA
                    ========================================= */

                    const ultimaVisita =

                        pedidos.length > 0

                            ? new Date(
                                pedidos[0].Fecha
                            ).toLocaleDateString()

                            : 'Sin visitas';

                    /* =========================================
                       INICIALES
                    ========================================= */

                    const initials =

                        `${cliente.nombre?.[0] || ''}
                        ${cliente.apellido?.[0] || ''}`

                        .replace(' ', '');

                    return {

                        _id:
                            cliente._id,

                        initials,

                        name:
                            `${cliente.nombre}
                            ${cliente.apellido}`,

                        email:
                            cliente.correo,

                        phone:
                            cliente.telefono,

                        direccion:
                            cliente.direccion,

                        fechaRegistro:
                            new Date(
                                cliente.createdAt
                            ).toLocaleDateString(),

                        totalCompras,

                        totalPedidos:
                            pedidos.length,

                        productoFavorito,

                        ultimaVisita,

                        favoriteImage:
                            '/plato1.jpeg',

                        historial

                    };

                })

            );

        return res.status(200).json({

            success: true,

            clientes:
                clientesDashboard

        });

    } catch (error) {

        return res.status(500).json({

            success: false,

            message:
                'Error al obtener dashboard de clientes',

            error:
                error.message

        });

    }

};
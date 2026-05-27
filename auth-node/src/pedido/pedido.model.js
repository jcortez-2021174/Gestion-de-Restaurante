import { Schema, model } from "mongoose";

const estadosPedido = [
    "Pendiente",
    "EnPreparacion",
    "Listo",
    "Entregado",
    "Cancelado"
];

const pedidoSchema = new Schema({

    Fecha: {
        type: Date,
        default: Date.now
    },

    Productos: [
        {
            IdProducto: {
                type: Schema.Types.ObjectId,
                ref: "Producto",
                required: true
            },

            Cantidad: {
                type: Number,
                required: true,
                min: 1
            },

            PrecioUnitario: {
                type: Number,
                required: true
            }
        }
    ],

    TipoPedido: {
        type: String,
        enum: ["Restaurante", "Domicilio"],
        required: true
    },

    MetodoPago: {
        type: String,
        enum: ["Efectivo", "Tarjeta"],
        required: true
    },

    Cupon: {
        type: String,
        default: ""
    },

    Propina: {
        type: Number,
        default: 0
    },

    Total: {
        type: Number,
        required: true
    },

    EstadoPedido: {
        type: String,
        enum: estadosPedido,
        default: "Pendiente"
    },

    IdCliente: {
        type: Schema.Types.ObjectId,
        ref: "Cliente",
        required: true
    },

    IdMesa: {
        type: Schema.Types.ObjectId,
        ref: "Mesa",

        required: function () {
            return this.TipoPedido === "Restaurante";
        }
    }

}, {
    timestamps: true
});

const Pedido = model("Pedido", pedidoSchema);

export default Pedido;
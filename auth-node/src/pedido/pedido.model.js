import { Schema, model } from 'mongoose';
import { ESTADOS_PEDIDO } from './pedido.constants.js';

const productoPedidoSchema = new Schema(
  {
    IdProducto: {
      type: Schema.Types.ObjectId,
      ref: 'Producto',
      required: true,
    },
    NombreProducto: {
      type: String,
      required: true,
      trim: true,
    },
    Cantidad: {
      type: Number,
      required: true,
      min: 1,
    },
    PrecioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const pedidoSchema = new Schema(
  {
    Fecha: {
      type: Date,
      default: Date.now,
    },
    Productos: {
      type: [productoPedidoSchema],
      validate: {
        validator: (productos) => productos.length > 0,
        message: 'El pedido debe contener productos',
      },
    },
    Subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
    Total: {
      type: Number,
      required: true,
      min: 0,
    },
    EstadoPedido: {
      type: String,
      enum: ESTADOS_PEDIDO,
      default: 'Pendiente',
    },
    IdCliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true,
      index: true,
    },
    IdMesa: {
      type: Schema.Types.ObjectId,
      ref: 'Mesas',
      default: null,
    },
    RazonCancelacion: {
      type: String,
      default: '',
      trim: true,
    },
    PuntosAcreditados: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Pedido = model('Pedido', pedidoSchema);

export default Pedido;

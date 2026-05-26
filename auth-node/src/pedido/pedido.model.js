import mongoose from "mongoose";

const estadosPedido = [
  "Pendiente",
  "EnPreparacion",
  "Listo",
  "Entregado",
  "Cancelado"
];

const pedidoSchema = new mongoose.Schema({
  Fecha: {
    type: Date,
    default: Date.now
  },
  Productos: [{
    IdProducto: {
      type: mongoose.Schema.Types.ObjectId,
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
  }],
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  IdMesa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mesa",
    required: function() { return this.TipoPedido === "Restaurante"; } // Requerido solo si come en el local
  }
}, { timestamps: true });

export default mongoose.model("Pedido", pedidoSchema);
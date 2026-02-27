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
    required: true
  }

}, { timestamps: true });

export default mongoose.model("Pedido", pedidoSchema);
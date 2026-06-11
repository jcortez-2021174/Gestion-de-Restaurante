import { Schema, model } from 'mongoose';

const movimientoPuntosSchema = new Schema({
  clienteId: { type: Schema.Types.ObjectId, ref: 'Cliente', required: true, index: true },
  puntos: { type: Number, required: true },
  tipo: {
    type: String,
    enum: ['PEDIDO', 'BONO', 'CANJE', 'AJUSTE'],
    required: true,
  },
  motivo: { type: String, required: true, trim: true },
  referencia: { type: String, required: true, unique: true, index: true },
  pedidoId: { type: Schema.Types.ObjectId, ref: 'Pedido', default: null },
  recompensaId: { type: Schema.Types.ObjectId, ref: 'Recompensa', default: null },
  saldoResultante: { type: Number, required: true, min: 0 },
}, {
  timestamps: true,
  versionKey: false,
});

export default model('MovimientoPuntos', movimientoPuntosSchema);

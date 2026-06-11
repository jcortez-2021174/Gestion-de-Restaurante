import { Schema, model } from 'mongoose';

const recompensaSchema = new Schema({
  nombre: { type: String, required: true, trim: true },
  descripcion: { type: String, default: '', trim: true },
  imagen: { type: String, default: '' },
  puntosRequeridos: { type: Number, required: true, min: 1 },
  activa: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false,
});

export default model('Recompensa', recompensaSchema);

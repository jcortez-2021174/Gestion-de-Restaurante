import { Schema, model } from 'mongoose';

const notificacionSchema = new Schema({
  destinatario: { type: String, required: true, trim: true, lowercase: true },
  evento: { type: String, required: true, index: true },
  asunto: { type: String, required: true },
  html: { type: String, required: true },
  estado: {
    type: String,
    enum: ['PENDIENTE', 'ENVIADA', 'ERROR'],
    default: 'PENDIENTE',
    index: true,
  },
  referencia: { type: String, required: true, unique: true },
  intentos: { type: Number, default: 0 },
  ultimoError: { type: String, default: '' },
}, { timestamps: true, versionKey: false });

export default model('Notificacion', notificacionSchema);

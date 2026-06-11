import { Schema, model } from 'mongoose';

const mesasSchema = new Schema(
  {
    Numero: {
      type: Number,
      required: [true, 'El numero de mesa es obligatorio'],
      min: [1, 'El numero de mesa minimo es 1'],
      max: [99, 'El numero de mesa maximo es 99'],
      unique: true,
    },
    Capacidad: {
      type: Number,
      required: [true, 'La capacidad de la mesa es obligatoria'],
      min: [1, 'La capacidad minima es 1'],
    },
    EstadoMesa: {
      type: String,
      enum: ['DISPONIBLE', 'RESERVADA', 'OCUPADA', 'FUERA_SERVICIO'],
      default: 'DISPONIBLE',
    },
    Zona: {
      type: String,
      enum: ['TERRAZA', 'INTERIOR', 'VIP', 'EVENTOS'],
      default: 'INTERIOR',
    },
    Forma: {
      type: String,
      enum: ['CIRCULO', 'RECTANGULO'],
      default: 'RECTANGULO',
    },
    PosicionX: { type: Number, min: 0, max: 100, default: 50 },
    PosicionY: { type: Number, min: 0, max: 100, default: 50 },
    IdRestaurante: {
      type: String,
      required: [true, 'El ID del restaurante es obligatorio'],
      default: 'aurea-main',
    },
  },
  {
    timestamps: true,
  }
);

const Mesas = model('Mesas', mesasSchema);

export default Mesas;

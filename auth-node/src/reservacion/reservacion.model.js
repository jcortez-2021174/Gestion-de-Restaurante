import { Schema, model } from 'mongoose';

const reservacionSchema = new Schema(
  {
    fechaReservacion: {
      type: Date,
      required: [true, 'La fecha de la reservación es obligatoria'],
    },
    cantidadPersonas: {
      type: Number,
      required: [true, 'La cantidad de personas es obligatoria'],
      min: [1, 'La reservación debe ser al menos para 1 persona'],
    },
    estadoReservacion: {
      type: String,
      enum: {
        values: ['RESERVADA', 'CANCELADA', 'EXPIRADA'],
        message: 'El estado debe ser RESERVADA, CANCELADA o EXPIRADA',
      },
      default: 'RESERVADA',
      uppercase: true,
    },
    idCliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El ID del cliente es obligatorio'],
    },
    idMesa: {
      type: Schema.Types.ObjectId,
      ref: 'Mesa',
      required: [true, 'El ID de la mesa es obligatorio'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
 
    timestamps: true,
    versionKey: false,
  }
);


reservacionSchema.index({ idCliente: 1 });
reservacionSchema.index({ idMesa: 1 });

export const Reservacion = model('Reservacion', reservacionSchema, 'reservacion');
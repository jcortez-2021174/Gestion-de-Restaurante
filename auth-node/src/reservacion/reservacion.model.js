import { Schema, model } from 'mongoose';

const reservacionSchema = new Schema(
  {
    fechaReservacion: {
      type: Date,
      required: [true, 'La fecha de la reservacion es obligatoria'],
    },
    horaInicio: {
      type: String,
      required: [true, 'La hora de inicio es obligatoria'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora de inicio debe tener formato HH:mm'],
    },
    horaFin: {
      type: String,
      required: [true, 'La hora de fin es obligatoria'],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'La hora de fin debe tener formato HH:mm'],
    },
    cantidadPersonas: {
      type: Number,
      required: [true, 'La cantidad de personas es obligatoria'],
      min: [1, 'La reservacion debe ser al menos para 1 persona'],
    },
    estadoReservacion: {
      type: String,
      enum: {
        values: ['PENDIENTE', 'CONFIRMADA', 'CANCELADA', 'COMPLETADA'],
        message: 'Estado de reservacion invalido',
      },
      default: 'PENDIENTE',
      uppercase: true,
    },
    idCliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: [true, 'El ID del cliente es obligatorio'],
    },
    idMesa: {
      type: Schema.Types.ObjectId,
      ref: 'Mesas',
      required: [true, 'El ID de la mesa es obligatorio'],
    },
    razonCancelacion: {
      type: String,
      default: '',
      trim: true,
    },
    notas: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Las notas no pueden superar 500 caracteres'],
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

const Reservacion = model('Reservacion', reservacionSchema);

export default Reservacion;

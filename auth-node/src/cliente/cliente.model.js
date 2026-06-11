import { Schema, model } from 'mongoose';

const clienteSchema = new Schema(
  {
    authUserId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    nombre: {
      type: String,
      required: [true, 'El nombre del cliente es obligatorio'],
      trim: true,
    },
    apellido: {
      type: String,
      required: [true, 'El apellido del cliente es obligatorio'],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono es obligatorio'],
      trim: true,
      minLength: [8, 'El teléfono debe tener al menos 8 dígitos'],
      maxLength: [15, 'El teléfono no puede exceder los 15 dígitos'],
    },
    correo: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true, 
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, 'Por favor, ingresa un correo electrónico válido'],
    },
    direccion: {
      type: String,
      default: '',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    puntosAurea: {
      type: Number,
      default: 0,
      min: 0,
    },
    puntosReferencias: {
      type: [String],
      default: [],
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);



const Cliente = model("Cliente", clienteSchema);

export default Cliente;

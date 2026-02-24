import { Schema, model } from 'mongoose';

const restauranteSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del restaurante es obligatorio'],
      trim: true,
      minLength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxLength: [150, 'El nombre no puede exceder los 150 caracteres'],
    },
    direccion: {
      type: String,
      required: [true, 'La dirección del restaurante es obligatoria'],
      trim: true,
      minLength: [5, 'La dirección debe tener al menos 5 caracteres'],
      maxLength: [300, 'La dirección no puede exceder los 300 caracteres'],
    },
    telefono: {
    type: String,
    required: [true, 'El teléfono del restaurante es obligatorio'],
    trim: true,
    minLength: [8, 'El teléfono debe tener al menos 8 caracteres'],
    maxLength: [20, 'El teléfono no puede exceder los 20 caracteres'],
  },
    capacidadTotal: {
      type: Number,
      required: [true, 'La capacidad total del restaurante es obligatoria'],
      min: [1, 'La capacidad total debe ser un número positivo mayor a 0'],
      validate: {
        validator: Number.isInteger,
        message: 'La capacidad total debe ser un número entero',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    versionKey: false,
}
);

restauranteSchema.index({ isActive: 1 });
restauranteSchema.index({ nombre: 1 });
restauranteSchema.index({ isActive: 1, nombre: 1 });

export default model('Restaurante', restauranteSchema);
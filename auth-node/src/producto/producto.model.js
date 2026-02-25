import { Schema, model } from 'mongoose';

const productoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    disponibilidad: {
      type: String,
      enum: {
        values: ['Disponible', 'NoDisponible'],
        message: 'La disponibilidad debe ser "Disponible" o "NoDisponible"',
      },
      default: 'Disponible',
    },
    idCategoria: {
      type: Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es obligatoria'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Producto = model('Producto', productoSchema);

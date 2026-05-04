import { Schema, model } from 'mongoose';

const categoriaSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
    minlength: [3, 'El nombre debe tener mínimo 3 caracteres'],
    maxlength: [60, 'El nombre no puede superar 60 caracteres'],
    unique: true,
  },
  descripcion: {
    type: String,
    trim: true,
    maxlength: [200, 'La descripción no puede superar 200 caracteres'],
  },
  estado: {
    type: String,
    enum: {
      values: ['ACTIVO', 'INACTIVO'],
      message: 'Estado invalido',
    },
    default: 'ACTIVO',
  },
}, {
  timestamps: true,
  versionKey: false,
});

const Categoria = model('Categoria', categoriaSchema);

export default Categoria;
import mongoose from "mongoose";

const mesaSchema = new mongoose.Schema({
  Numero: {
    type: Number,
    required: [true, "El número de mesa es obligatorio"],
    min: [1, "El número de mesa mínimo es 1"],
    max: [15, "El número de mesa máximo es 15"],
    unique: true 
  },
  Capacidad: {
    type: Number,
    required: [true, "La capacidad de la mesa es obligatoria"],
    min: [1, "La capacidad mínima es 1"]
  },
  EstadoMesa: {
    type: String,
    enum: ["DISPONIBLE", "RESERVADA", "OCUPADA"],
    default: "DISPONIBLE"
  },
  IdRestaurante: {
    type: String,
    required: [true, "El ID del restaurante es obligatorio"]
  }
}, {
  timestamps: true
});

const Mesa = mongoose.model("Mesa", mesaSchema);
export default Mesa;
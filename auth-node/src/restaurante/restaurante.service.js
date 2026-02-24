import Restaurante from './restaurante.model.js';


export const createRestauranteRecord = async ({ restauranteData }) => {
  const restaurante = new Restaurante(restauranteData);
  await restaurante.save();
  return restaurante;
};


export const getRestaurantesRecord = async () => {
  return await Restaurante.find({ isActive: true }).sort({ createdAt: -1 });
};
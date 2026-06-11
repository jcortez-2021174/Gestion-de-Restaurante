import Restaurante from './restaurante.model.js';


export const createRestauranteRecord = async ({ restauranteData }) => {
  const restaurante = new Restaurante(restauranteData);
  await restaurante.save();
  return restaurante;
};


export const getRestaurantesRecord = async () => {
  return await Restaurante.find({ isActive: true }).sort({ createdAt: -1 });
};

export const getConfiguracionRecord = async () => {
  const existing = await Restaurante.findOne({ isActive: true }).sort({ createdAt: 1 });
  if (existing) return existing;

  return Restaurante.create({
    nombre: 'Aurea Restaurant',
    direccion: 'Direccion pendiente de configurar',
    telefono: '00000000',
    capacidadTotal: 1,
  });
};

export const updateConfiguracionRecord = async (data) => {
  const current = await getConfiguracionRecord();
  Object.assign(current, {
    nombre: data.nombre,
    direccion: data.direccion,
    telefono: data.telefono,
    correo: data.correo || '',
    logo: data.logo || '',
    banner: data.banner || '',
    redesSociales: data.redesSociales || {},
  });
  await current.save();
  return current;
};

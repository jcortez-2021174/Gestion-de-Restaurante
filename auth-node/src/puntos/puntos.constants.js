export const NIVELES_AUREA = [
  { nombre: 'BRONCE', minimo: 0, maximo: 999 },
  { nombre: 'PLATA', minimo: 1000, maximo: 2999 },
  { nombre: 'ORO', minimo: 3000, maximo: 5999 },
  { nombre: 'DIAMANTE', minimo: 6000, maximo: null },
];

export const nivelPorPuntos = (puntos = 0) => (
  NIVELES_AUREA.find(({ minimo, maximo }) => (
    puntos >= minimo && (maximo === null || puntos <= maximo)
  )) || NIVELES_AUREA[0]
);

export const progresoNivel = (puntos = 0) => {
  const nivel = nivelPorPuntos(puntos);
  const index = NIVELES_AUREA.findIndex((item) => item.nombre === nivel.nombre);
  const siguiente = NIVELES_AUREA[index + 1] || null;
  return {
    nivel: nivel.nombre,
    siguienteNivel: siguiente?.nombre || null,
    puntosSiguienteNivel: siguiente?.minimo || null,
    puntosFaltantes: siguiente ? Math.max(0, siguiente.minimo - puntos) : 0,
  };
};

export const bonoPorCantidadPedidos = (cantidad) => ({
  1: 100,
  5: 250,
  10: 500,
  20: 1000,
}[cantidad] || 0);

import { isMongoObjectId, mapMenuProduct } from "./order.contract.js";

export const extractProductCollection = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

export const isProductAvailable = (product) => {
  if (typeof product?.disponibilidad === "boolean") {
    return product.disponibilidad;
  }

  return String(product?.disponibilidad || "")
    .trim()
    .toLowerCase() === "disponible";
};

export const mapVisibleMenuProducts = (payload) => (
  extractProductCollection(payload)
    .filter(isProductAvailable)
    .map(mapMenuProduct)
    .filter((product) => (
      isMongoObjectId(product.id)
      && product.nombre
      && Number.isFinite(product.precio)
    ))
);

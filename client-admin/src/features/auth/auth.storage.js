export const AUTH_STORAGE_KEY = 'auth-restaurante-Aurea';

export const readPersistedAuth = () => {
  try {
    const value = localStorage.getItem(AUTH_STORAGE_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const clearPersistedSession = (storage = localStorage) => {
  storage.removeItem(AUTH_STORAGE_KEY);
  storage.removeItem('carrito-aurea');
};

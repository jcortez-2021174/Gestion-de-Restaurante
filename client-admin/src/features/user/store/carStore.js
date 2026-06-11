import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isMongoObjectId } from '../order.contract';

const validCartItems = (items = []) => items.filter((item) => isMongoObjectId(item?.id));

export const useCartStore = create(
    persist(
        (set, get) => ({
            carrito: [],

            agregarItem: (plato) => {
                if (!isMongoObjectId(plato?.id)) return;

                const { carrito } = get();
                const existe = carrito.find((i) => i.id === plato.id);
                if (existe) {
                    set({ carrito: carrito.map((i) => i.id === plato.id ? { ...i, cantidad: i.cantidad + 1 } : i) });
                } else {
                    set({ carrito: [...carrito, { ...plato, cantidad: 1 }] });
                }
            },

            cambiarCantidad: (id, delta) => {
                set({
                    carrito: get().carrito
                        .map((i) => i.id === id ? { ...i, cantidad: i.cantidad + delta } : i)
                        .filter((i) => i.cantidad > 0),
                });
            },

            eliminarItem: (id) => set({ carrito: get().carrito.filter((i) => i.id !== id) }),

            vaciarCarrito: () => set({ carrito: [] }),
        }),
        {
            name: "carrito-aurea",
            version: 1,
            migrate: (persistedState) => ({
                ...persistedState,
                carrito: validCartItems(persistedState?.carrito),
            }),
        }
    )
);

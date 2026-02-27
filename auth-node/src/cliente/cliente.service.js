import { Cliente } from './cliente.model.js';


export const crearCliente = async (data) => {
  const cliente = new Cliente(data);
  return await cliente.save();
};


export const listarClientes = async () => {
  return await Cliente.find()
    .sort({ createdAt: -1 });
};
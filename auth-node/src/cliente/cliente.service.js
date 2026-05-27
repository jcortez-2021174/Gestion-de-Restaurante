import  Cliente  from './cliente.model.js';


export const crearCliente = async (data) => {
  const cliente = new Cliente(data);
  return await cliente.save();
};


export const listarClientes = async () => {
  return await Cliente.find()
    .sort({ createdAt: -1 });
};

export const editarCliente = async (id, data) => {
  return await Cliente.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
};

export const eliminarCliente = async (id) => {
  return await Cliente.findByIdAndDelete(id);
};
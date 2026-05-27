import  Reservacion  from './reservacion.model.js';


export const crearReservacionRecord = async (data) => {
    const reservacion = new Reservacion(data);
    return await reservacion.save();
};


export const listarReservacionesRecord = async () => {
    return await Reservacion.find({ isActive: true }) 
        .populate('idCliente', 'nombre apellido correo') 
        .populate('idMesa', 'numero capacidad')         
        .sort({ fechaReservacion: 1 });                  
};

export const actualizarReservacionRecord = async (id, data) => {
    return await Reservacion.findByIdAndUpdate(
        id, 
        data, 
        { new: true, runValidators: true }
    );
};
import mongoose, { mongo } from 'mongoose';
 
export const dbConnection = async () => {
    try{
        mongoose.connection.on('error', ()=>{
            console.error('Error de conexion');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', ()=>{
            console.log('Intentando conectar a MongoDB');
        });
        mongoose.connection.on('connected', ()=>{
            console.log('Conexion establecida con MongoDB');
        });
        mongoose.connection.on('open', ()=>{
            console.log('Conexion abierta con MongoDB');
        });
        mongoose.connection.on('reconnect', ()=>{
            console.log('Reconectado a MongoDB');
        });
        mongoose.connection.on('disconnected', ()=>{
            console.log('Conexion perdida con MongoDB');
        });
        await mongoose.connect(process.env.URI_MONGODB,{
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10
        });
    }catch(err){
        console.error(`Áurea Restaurant- error al conectar la db: ${err.message}`);
        process.exit(1);
    }
}
 
const gracefulShutdown = async (signal) =>{
    console.log(`Mongo DB | Recibida señal de ${signal}, cerrando conexiónn a mongo DB...`);
    try {
        await mongoose.disconnect();
        console.log('Mongo DB | Conexion cerrada exitosamente')
        process.exit(0)
    } catch (err) {
        console.error(`Mongo DB | Error durante el cierre de la conexiop: ${err.message}`);
        process.exit(1);
    }
}
 
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));
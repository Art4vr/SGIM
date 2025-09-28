//Configuracion del modelo para el inicio de sesion con la tabla usuario
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los usuarios
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const obtenerUsuario = async (username)=>{
    const query = 'SELECT * FROM usuarios WHERE username = ?';
    try{
        const[resultados] = await conexionDB.execute(query,[username]);
        console.log(resultados);
        return resultados;
    }catch(err){
        console.error('Error con la base de datos: ', err);
        throw err;
    }
};
//Configuracion del modelo para el inicio de sesion con la tabla usuario
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los usuarios
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

export const nuevoUsuario = async (nombre,username,password,estado,rol)=>{
    const query = 'INSERT INTO Usuario (nombre, username, password, estado, Rol_idRol) VALUES(?,?,?,?,?)';
    try{
        const[resultados] = await conexionDB.execute(query,[nombre,username,password,estado,rol]);
        console.log(resultados);
        return resultados;
    }catch(err){
        console.error('Error con la base de datos: ', err);
        throw err;
    }
};
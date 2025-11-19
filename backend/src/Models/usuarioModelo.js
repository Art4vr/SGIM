//Configuracion del modelo para la tabla usuario
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los usuarios
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- LOGIN -----------------------------------------
// Funcion para obetener la informacion del usuario en base al username
export const obtenerUsuario = async (username)=>{ //recibe el username como parametro. async para operaciones asincronas
    const query = 'SELECT idUsuario, nombre, username, password, Rol_idRol, estado FROM usuario WHERE username = ?';//consulta sql
    try{
        const[resultados] = await conexionDB.execute(query,[username]);//ejecuta la consulta, el username es el ?. 
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error con la base de datos (obtenerUsuario): ', err); //manejo de errores
        throw err;
    }
};


//--------------------- REGISTRO -----------------------------------------
// Funcion para crear un nuevo usuario
export const crearUsuario = async ({nombre,username,passwordHash,rolId})=>{ //recibe objeto con los datos del nuevo usuario
    const query = 'INSERT INTO usuario (nombre, username, password, Rol_idRol) VALUES (?, ?, ?, ?)';//consulta sql
    try{
        const [resultado] = await conexionDB.execute(query,[nombre,username,passwordHash,rolId]);//ejecuta la consulta, los ? se remplazan por los valores del array (parametros)
        //console.log('Modelo',resultado);
        return resultado.insertId; // Devuelve el ID del nuevo usuario
    }catch(err){
        console.error('Error con la base de datos (crearUsuario): ', err);//manejo de errores
        throw err;
    }
};

//--------------------- OBTENER USUARIOS -----------------------------------------
// Funcion para obtener todos los usuarios
export const listarUsuarios = async ()=>{ //
    const query = 'SELECT * FROM usuario';//consulta sql
    try{
        const[resultados] = await conexionDB.execute(query);//ejecuta la consulta, el username es el ?. 
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error con la base de datos (listarUsuarios): ', err); //manejo de errores
        throw err;
    }
};

//--------------------- ELIMINAR -----------------------------------------
// Funcion para eliminar a un usuario
export const eliminarUsuario = async (idUsuario) => {
    const query = 'DELETE FROM usuario WHERE idUsuario = ?';
    try{
        const [resultado] = await conexionDB.execute(query,[idUsuario]);
        return resultado.affectedRows > 0;
    }catch(err){
        console.error('Error con la base de datos (eliminarUsuario): ', err);
        throw err;
    }
};

//--------------------- MODIFICAR -----------------------------------------
// Funcion para modificar los datos de un usuario
export const modificarUsuario = async (id, nombre, username, rolId, estado) => {
    // Construir la consulta dinámicamente según los campos proporcionados
    let query = 'UPDATE usuario SET ';
    const params = [];
    const cambios = [];
    if (nombre) {
        cambios.push('nombre = ?');
        params.push(nombre);
    }
    if (username) {
        cambios.push('username = ?');
        params.push(username);
    }
    if (rolId) {
        cambios.push('Rol_idRol = ?');
        params.push(rolId);
    }
    if (estado) {
        cambios.push('estado = ?');
        params.push(estado);
    }
    params.push(id);
    query += cambios.join(', ') + ' WHERE idUsuario = ?';
    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows > 0;
    } catch (err) {
        console.error('Error con la base de datos (modificarUsuario): ', err);
        throw err;
    }
};
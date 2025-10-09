//Configuracion del modelo para la tabla imprevisto
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los imprevistos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- LOGIN -----------------------------------------
// Funcion para obetener los imprevistos de acuerdo a busqueda o todos 
export const listarImprevisto = async (filtro,busqueda)=>{ //recibe el filtro y el criterio de busqueda como parametro
    const query = 'SELECT * FROM imprevisto WHERE ? = ?';//consulta sql
    try{
        const[resultados] = await conexionDB.execute(query,[filtro,busqueda]);//ejecuta la consulta
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error con la base de datos (listarImprevisto): ', err); //manejo de errores
        throw err;
    }
};


//--------------------- REGISTRO -----------------------------------------
// Funcion para registrar un nuevo imprevisto 
export const crearImprevisto = async ({idUsuarioReporta,idInventarioProducto,descripcion,cantidad,idUnidadMedida})=>{ //recibe objeto con los datos del nuevo usuario
    const query = 'INSERT INTO imprevisto (Usuario_idUsuarioReporta, InventarioProducto_idInventarioProducto, descripcion, fecha, cantidad, UnidadMedida_idUnidadMedida, estado, Usuario_idUsuarioAutoriza) VALUES (?, ?, ?, NOW(), ?, ?, ?, NULL)';//consulta sql
    try{
        const [resultado] = await conexionDB.execute(query,[idUsuarioReporta,idInventarioProducto,descripcion,cantidad,idUnidadMedida,'pendiente']);//ejecuta la consulta, los ? se remplazan por los valores del array (parametros)
        console.log('Modelo',resultado);
        return resultado.insertId; // Devuelve el ID del nuevo imprevisto
    }catch(err){
        console.error('Error con la base de datos (crearImprevisto): ', err);//manejo de errores
        throw err;
    }
};
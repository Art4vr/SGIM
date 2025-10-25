//Configuracion del modelo para la tabla imprevisto
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los imprevistos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- MOSTRAR -----------------------------------------
// Funcion para obetener los imprevistos de acuerdo a busqueda o todos 
export const listarImprevisto = async (filtro,busqueda)=>{ //recibe el filtro y el criterio de busqueda como parametro
    const columnasPermitidas = ['idImprevisto', 
                                'Usuario_idUsuarioReporta', 
                                'InventarioProducto_idInventarioProducto',
                                'descripcion',
                                'fecha',
                                'cantidad',
                                'UnidadMedida_idUnidadMedida',
                                'estado', 
                                'Usuario_idUsuarioAutoriza']
    // Validar filtro para evitar inyección
    if (filtro && !columnasPermitidas.includes(filtro)){
        throw new Error('Filtro no válido');
    }
    //Base de la consulta
    let query = 'SELECT * FROM imprevisto WHERE 1=1';
    let params = [];

    // Agregar condición solo si hay búsqueda
    if (filtro && busqueda) {
        query += ` AND ${filtro} LIKE ?`;
        params.push(`%${busqueda}%`);
    }
    try{
        const[resultados] = await conexionDB.execute(query,params);//ejecuta la consulta
        //console.log("Resultados imprevistos: -modelo: ", resultados);
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error al ejecutar la consulta (listarImprevisto): ', err); //manejo de errores
        throw err;
    }
};


//--------------------- CREAR -----------------------------------------
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
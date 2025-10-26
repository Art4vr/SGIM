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
        //console.log('Modelo',resultado);
        return resultado.insertId; // Devuelve el ID del nuevo imprevisto
    }catch(err){
        console.error('Error con la base de datos (crearImprevisto): ', err);//manejo de errores
        throw err;
    }
};

//--------------------- ELIMINAR -----------------------------------------
// Funcion para eliminar algun imprevisto 
export const eliminarImprevisto = async (idImprevisto) => {
    const query = 'DELETE FROM imprevisto WHERE idImprevisto = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idImprevisto]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar imprevisto-imprevistoModelo:', err);
        throw err;
    }
};


//--------------------- MODIFICAR -----------------------------------------
// Funcion para modificar algun imprevisto 
export const actualizarImprevisto = async ({idImprevisto,idInventarioProducto,descripcion,cantidad,idUnidadMedida }) => {
    let query = 'UPDATE imprevisto SET ';
    const params = [];
    const cambios = [];
    if (idInventarioProducto) {
        cambios.push('InventarioProducto_idInventarioProducto = ?');
        params.push(idInventarioProducto);
    }
    if (descripcion) {
        cambios.push('descripcion = ?');
        params.push(descripcion);
    }   
    if (cantidad) {
        cambios.push('cantidad = ?');
        params.push(cantidad);
    }
    if (idUnidadMedida) {
        cambios.push('UnidadMedida_idUnidadMedida = ?');
        params.push(idUnidadMedida);
    }
    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;
    query += cambios.join(', ') + ' WHERE idImprevisto = ?';
    params.push(idImprevisto);
    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar imprevisto.imprevistoModelo:', err);
        throw err;
    }
};
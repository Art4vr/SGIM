//Configuracion del modelo para la tabla de inventario
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con el inventario de los productos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador
//Configuracion del modelo para la tabla imprevisto
// El modelo es responsable de la interacción con la base de datos
// Ejecuta las consultas, inserciones, actualizaciones y eliminaciones relacionadas con los imprevistos
// Se encarga de la lógica de negocio y manipula los datos que se enviarán o recibirán del controlador

import conexionDB from '../config/db.js';

//--------------------- MOSTRAR -----------------------------------------
// Funcion para obetener los productos en inventario de acuerdo a busqueda o todos 
export const listarInventario = async (filtro,busqueda)=>{ //recibe el filtro y el criterio de busqueda como parametro
    const columnasPermitidas = ['idInventarioProducto', 
                                'Producto_idProducto', 
                                'cantidadMaxima',
                                'cantidadMinima',
                                'cantidadActual',
                                'fechaCaducidad',
                                'fechaIngreso',
                                'Proveedor_idProveedor', 
                                'Usuario_idUsuario',
                                'UnidadMedida_idUnidadMedida'
                            ]
    // Validar filtro para evitar inyección
    if (filtro && !columnasPermitidas.includes(filtro)){
        throw new Error('Filtro no válido');
    }
    //Base de la consulta
    let query = 'SELECT * FROM inventarioproducto WHERE 1=1';
    let params = [];

    // Agregar condición solo si hay búsqueda
    if (filtro && busqueda) {
        query += ` AND ${filtro} LIKE ?`;
        params.push(`%${busqueda}%`);
    }
    try{
        const[resultados] = await conexionDB.execute(query,params);//ejecuta la consulta
        //console.log("Resultados inventario: -modelo: ", resultados);
        return resultados; //devuelve los resultados de la consulta
    }catch(err){
        console.error('Error al ejecutar la consulta (listarIInventario): ', err); //manejo de errores
        throw err;
    }
};


//--------------------- CREAR -----------------------------------------
// Funcion para registrar entrada de algun producto al inventario
export const ingresarInventario = async ({Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida})=>{ //recibe objeto con los datos del nuevo registro de inventario
    const query = 'INSERT INTO inventarioproducto (Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, fechaIngreso, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)';//consulta sql
    console.log('------ QUERY: ',query,[Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida]);
    try{
        const [resultado] = await conexionDB.execute(query,[Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida]);//ejecuta la consulta, los ? se remplazan por los valores del array (parametros)
        console.log('Modelo',resultado);
        return resultado.insertId; // Devuelve el ID del nuevo imprevisto
    }catch(err){
        console.error('Error con la base de datos (ingresarInventario): ', err);//manejo de errores
        throw err;
    }
};

//--------------------- ELIMINAR -----------------------------------------
// Funcion para dar de baja el inventario (lote) de un producto
export const eliminarInventario = async (idInventarioProducto) => {
    const query = 'DELETE FROM inventarioproducto WHERE idInventarioProducto = ?';
    try {
        const [resultado] = await conexionDB.execute(query, [idInventarioProducto]);
        return resultado.affectedRows; // Devuelve cuántas filas fueron afectadas (1 si se eliminó, 0 si no existía)
    } catch (err) {
        console.error('Error al eliminar lote del producto-inventarioModelo:', err);
        throw err;
    }
};

//--------------------- MODIFICAR O ACTUALIZAR -----------------------------------------
// Funcion para modificar o actualizar algun producto del inventario, ya sea actualizar cantidades, o correcciones
export const actualizarInventario = async ({ idInventarioProducto, Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor,UnidadMedida_idUnidadMedida }) => {
    let query = 'UPDATE inventarioproducto SET ';
    const params = [];
    const cambios = [];
    if (Producto_idProducto) {
        cambios.push('Producto_idProducto = ?');
        params.push(Producto_idProducto);
    }
    if (cantidadMaxima) {
        cambios.push('cantidadMaxima = ?');
        params.push(cantidadMaxima);
    }   
    if (cantidadMinima) {
        cambios.push('cantidadMinima = ?');
        params.push(cantidadMinima);
    }
    if (cantidadActual) {
        cambios.push('cantidadActual = ?');
        params.push(cantidadActual);
    }
    if (fechaCaducidad) {
        cambios.push('fechaCaducidad = ?');
        params.push(fechaCaducidad);
    }
    if (Proveedor_idProveedor) {
        cambios.push('Proveedor_idProveedor = ?');
        params.push(Proveedor_idProveedor);
    }
    if (UnidadMedida_idUnidadMedida) {
        cambios.push('UnidadMedida_idUnidadMedida = ?');
        params.push(UnidadMedida_idUnidadMedida);
    }
    // Si no hay campos para actualizar
    if (cambios.length === 0) return 0;
    query += cambios.join(', ') + ' WHERE idInventarioProducto = ?';
    params.push(idInventarioProducto);
    try {
        const [resultado] = await conexionDB.execute(query, params);
        return resultado.affectedRows; 
    } catch (err) {
        console.error('Error al modificar inventario-inventarioModelo:', err);
        throw err;
    }
};
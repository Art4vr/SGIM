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
export const ingresarInventario = async ({idUsuarioReporta,idInventarioProducto,descripcion,cantidad,idUnidadMedida})=>{ //recibe objeto con los datos del nuevo registro de inventario
    const query = 'INSERT INTO inventarioproducto (Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, fechaIngreso, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?)';//consulta sql
    try{
        const [resultado] = await conexionDB.execute(query,[Producto_idProducto, cantidadMaxima, cantidadMinima, cantidadActual, fechaCaducidad, Proveedor_idProveedor, Usuario_idUsuario,UnidadMedida_idUnidadMedida]);//ejecuta la consulta, los ? se remplazan por los valores del array (parametros)
        //console.log('Modelo',resultado);
        return resultado.insertId; // Devuelve el ID del nuevo imprevisto
    }catch(err){
        console.error('Error con la base de datos (ingresarInventario): ', err);//manejo de errores
        throw err;
    }
};
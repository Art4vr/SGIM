-- Permisos a nivel de back
-- Prácticamente es definir a que tablas de la base de datos tiene acceso cada roll
-- Estos permisos son para definir en las rutas, es decir a qué controladores pueden pedir datos estos roles 

TRUNCATE permiso_rol;
ALTER TABLE Permiso_Rol AUTO_INCREMENT = 1;


DELETE FROM permiso WHERE idPermiso BETWEEN 1 AND 12;
ALTER TABLE Permiso AUTO_INCREMENT = 1;
-- =========================
-- ROL
-- =========================
-- INSERT INTO Rol (nombre, descripcion) VALUES
-- ('Gerente', 'Acceso total al sistema'),
-- ('Inventario', 'Encargado de administrar el inventario'),
-- ('Chef', 'Prepara platillos y reporta imprevistos'),
-- ('Mesero', 'Toma órdenes y atiende clientes'),
-- ('Cliente', 'Visualiza menú con QR');

-- Insertar todos los permisos
INSERT INTO Permiso (nombre, descripcion) VALUES
-- permisos y roles
('gestionar_permisos', 'Puede administrar roles y permisos'), -- gerente
-- ordenes
('ver_ordenes', 'Puede visualizar las órdenes'), -- gerente | chef | mesero
('crear_orden', 'Puede crear nuevas órdenes'), -- gerente | mesero
('editar_orden', 'Puede actualizar el estado de órdenes'), -- gerente | mesero
('eliminar_orden', 'Puede eliminar o cancelar órdenes'), -- gerente | mesero
-- platillos por orden
('ver_platillo_orden', 'Puede visualizar los platillos dentro de la comanda'), -- gerente | chef | mesero
('crear_platillo_orden', 'Agrega platillos a la orden'), -- gerente | mesero
('editar_platillo_orden', 'Puede actualizar el estado de los platillos en la orden'), -- gerente | mesero | chef
('eliminar_platillo_orden', 'Puede eliminar pedidos dentro de una orden'), -- gerente | mesero
-- platillos
('crear_platillos', 'Puede dar de alta un platillo nuevo al menú'), -- gerente
('ver_platillos', 'Puede visualizar los platillos del menú'), -- gerente | chef | mesero
('editar_platillo', 'Puede modificar algún platillo del menú'), -- gerente
('eliminar_platillo', 'Puede eliminar platillos del menú'), -- gerente
-- productos
('crear_producto', 'Dar de alta un nuevo producto'), -- gerente
('ver_productos', 'Puede visualizar el catalogo de productos'), -- gerente | chef | encargado de inventario | mesero
('editar_producto', 'Puede modificar o actualizar las caracteristicas de un producto'), -- gerente
('eliminar_producto', 'Puede eliminar cualquier producto'), -- gerente
-- usuarios
('crear_usuario', 'Puede dar de alta algún usuario'), -- gerente
('ver_usuarios', 'Puede consultar los usuarios existentes'), -- gerente
('editar_usuario', 'Puede modificar los datos del usuario'), -- gerente
('eliminar_usuario', 'Puede dar de baja a cualquier usuario'), -- gerente
-- proveedores
('crear_proveedor', 'Puede dar de alta algún proveedor'), -- gerente
('ver_proveedores', 'Puede consultar los proveedores existentes'), -- gerente | encargado de inventario
('editar_proveedor', 'Puede modificar los datos del proveedor'), -- gerente
('eliminar_proveedor', 'Puede dar de baja a cualquier proveedor'), -- gerente
-- inventario
('ver_inventario', 'Puede consultar el inventario'), -- gerente | encargado de inventario
('crear_inventario', 'Puede registrar un nuevo lote en el inventario'), -- gerente
('editar_inventario', 'Puede actualizar el stock de algún producto en inventario'), -- gerente | encargado de inventario | chef | mesero
('eliminar_inventario', 'Puede eliminar cualquier lote existente en inventario'), -- gerente 
-- imprevistos
('crear_imprevisto', 'Puede reportar un imprevisto en inventario'), -- gerente | chef
('editar_imprevisto', 'Puede autorizar o rechazar imprevistos'), -- gerente
('ver_imprevistos', 'Puede consultar los imprevistos registrados'), -- gerente
('eliminar_imprevisto', 'Puede eliminar cualquier imprevisto'), -- gerente
-- menu
('ver_menu', 'Puede visualizar el menú de platillos'); -- gerente | cliente | mesero

-- Asignar los permisos a un rol

-- inserta todos los permisos al gerente
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 1, idPermiso FROM Permiso;

-- inserta permisos al chef
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 3, idPermiso FROM Permiso WHERE nombre IN 
('ver_ordenes',
'ver_platillo_orden','editar_platillo_orden',
'crear_imprevisto',
'editar_inventario',
'ver_productos',
'ver_platillos');

-- permisos para el mesero
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 4, idPermiso FROM Permiso WHERE nombre IN 
('crear_orden','eliminar_orden','ver_ordenes','editar_orden',
'ver_platillo_orden','crear_platillo_orden','editar_platillo','eliminar_platillo_orden',
'ver_platillos',
'ver_productos',
'editar_inventario',
'ver_menu');

-- permisos para el encargado de inventario
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 2, idPermiso FROM Permiso WHERE nombre IN 
('ver_proveedores',
'ver_productos',
'ver_inventario','editar_inventario');

-- permisos para el cliente
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 5, idPermiso FROM Permiso WHERE nombre IN ('ver_menu');

-- Visualizar Los permisos asignados a cada rol
select * from permiso_rol p
JOIN permiso ON permiso.idPermiso = p.Permiso_idPermiso
order by 1,2;

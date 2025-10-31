-- =========================
-- ROL
-- =========================
INSERT INTO Rol (nombre, descripcion) VALUES
('Gerente', 'Acceso total al sistema'),
('Inventario', 'Encargado de administrar el inventario'),
('Chef', 'Prepara platillos y reporta imprevistos'),
('Mesero', 'Toma órdenes y atiende clientes'),
('Cliente', 'Visualiza menú con QR');

-- Insertar todos los permisos
INSERT INTO Permiso (nombre, descripcion) VALUES
('ver_ordenes', 'Puede visualizar las órdenes'),
('crear_orden', 'Puede crear nuevas órdenes'),
('actualizar_orden', 'Puede actualizar el estado de órdenes'),
('eliminar_orden', 'Puede eliminar o cancelar órdenes'),
('ver_inventario', 'Puede consultar el inventario'),
('gestionar_inventario', 'Puede modificar el inventario'),
('reportar_imprevisto', 'Puede reportar un imprevisto en inventario'),
('aprobar_imprevisto', 'Puede autorizar o rechazar imprevistos'),
('gestionar_usuarios', 'Puede administrar usuarios'),
('gestionar_permisos', 'Puede administrar roles y permisos'),
('ver_menu', 'Puede visualizar el menú de platillos');
('gestionar_platillos', 'Acciones sobre platillos (alta, baja, update, ver)'),
('gestionar_productos', 'Acciones sobre productos (alta, baja, update, ver)');

-- Asignar los permisos a un rol

-- inserta todos los permisos al gerente
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 1, idPermiso FROM Permiso;

-- inserta permisos al chef
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 3, idPermiso FROM Permiso WHERE nombre IN 
('ver_ordenes','actualizar_orden','reportar_imprevisto');

-- permisos para el mesero
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 4, idPermiso FROM Permiso WHERE nombre IN 
('crear_orden','ver_ordenes','actualizar_orden','ver_menu');

-- permisos para el encargado de inventario
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 2, idPermiso FROM Permiso WHERE nombre IN 
('ver_inventario','gestionar_inventario','ver_ordenes','aprobar_imprevisto');

-- permisos para el cliente
INSERT INTO Permiso_Rol (Rol_idRol, Permiso_idPermiso)
SELECT 5, idPermiso FROM Permiso WHERE nombre IN ('ver_menu');

-- Visualizar Los permisos asignados a cada rol

-- select * from permiso_rol p
-- JOIN permiso ON permiso.idPermiso = p.Permiso_idPermiso
-- order by 1;

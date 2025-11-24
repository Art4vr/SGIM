CREATE DATABASE  IF NOT EXISTS `makibase` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `makibase`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: makibase
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `idCategoria` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `descripcion` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`idCategoria`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Abarrotes','Categoría para los productos de abarrotes.'),(2,'Abarrotes de Importación','Categoría para los productos de abarrotes de importación.'),(3,'Aderezos','Categoría para los productos de aderezos.'),(4,'Carnes','Categoría para los productos de carnes.'),(5,'Cervezas','Categoría para los productos de cerveza.'),(6,'Congelados','Categoría para los productos congelados.'),(7,'Frutas y Verduras','Categoría para las frutas y verduras.'),(8,'Lácteos','Categoría para los productos lácteos.'),(9,'Pescados y Mariscos','Categoría para los pescados y mariscos.'),(10,'Pollo','Categoría para el pollo.'),(11,'Postres','Categoría para los postres.'),(12,'Refrescos','Categoría para los refrescos.'),(13,'Salsas','Categoría para las salsas.'),(14,'Vinos y Licores','Categoría para los vinos y licores.');
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imprevisto`
--

DROP TABLE IF EXISTS `imprevisto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imprevisto` (
  `idImprevisto` int NOT NULL AUTO_INCREMENT,
  `Usuario_idUsuarioReporta` int NOT NULL,
  `InventarioProducto_idInventarioProducto` int NOT NULL,
  `descripcion` varchar(75) DEFAULT NULL,
  `fecha` datetime NOT NULL,
  `cantidad` int NOT NULL,
  `UnidadMedida_idUnidadMedida` int NOT NULL,
  `estado` enum('autorizado','pendiente','rechazado') NOT NULL,
  `Usuario_idUsuarioAutoriza` int DEFAULT NULL,
  PRIMARY KEY (`idImprevisto`),
  KEY `fk_Imprevisto_Usuario1_idx` (`Usuario_idUsuarioReporta`),
  KEY `fk_Imprevisto_InventarioProducto1_idx` (`InventarioProducto_idInventarioProducto`),
  KEY `fk_Imprevisto_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  KEY `fk_Imprevisto_Usuario2_idx` (`Usuario_idUsuarioAutoriza`),
  CONSTRAINT `fk_Imprevisto_InventarioProducto1` FOREIGN KEY (`InventarioProducto_idInventarioProducto`) REFERENCES `inventarioproducto` (`idInventarioProducto`),
  CONSTRAINT `fk_Imprevisto_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`),
  CONSTRAINT `fk_Imprevisto_Usuario1` FOREIGN KEY (`Usuario_idUsuarioReporta`) REFERENCES `usuario` (`idUsuario`),
  CONSTRAINT `fk_Imprevisto_Usuario2` FOREIGN KEY (`Usuario_idUsuarioAutoriza`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imprevisto`
--

LOCK TABLES `imprevisto` WRITE;
/*!40000 ALTER TABLE `imprevisto` DISABLE KEYS */;
/*!40000 ALTER TABLE `imprevisto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `inventarioproducto`
--

DROP TABLE IF EXISTS `inventarioproducto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `inventarioproducto` (
  `idInventarioProducto` int NOT NULL AUTO_INCREMENT,
  `Producto_idProducto` int NOT NULL,
  `cantidadMaxima` int NOT NULL,
  `cantidadMinima` int NOT NULL,
  `cantidadActual` decimal(10,3) NOT NULL,
  `fechaCaducidad` datetime NOT NULL,
  `fechaIngreso` datetime NOT NULL,
  `Proveedor_idProveedor` int NOT NULL,
  `Usuario_idUsuario` int NOT NULL,
  `UnidadMedida_idUnidadMedida` int NOT NULL,
  `estado` enum('pronto_a_caducar','bajo_stock','en_stock','caducado','finalizado') NOT NULL,
  PRIMARY KEY (`idInventarioProducto`),
  KEY `fk_InventarioProducto_Producto1_idx` (`Producto_idProducto`),
  KEY `fk_InventarioProducto_Proveedor1_idx` (`Proveedor_idProveedor`),
  KEY `fk_InventarioProducto_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_InventarioProducto_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  CONSTRAINT `fk_InventarioProducto_Producto1` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`),
  CONSTRAINT `fk_InventarioProducto_Proveedor1` FOREIGN KEY (`Proveedor_idProveedor`) REFERENCES `proveedor` (`idProveedor`),
  CONSTRAINT `fk_InventarioProducto_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`),
  CONSTRAINT `fk_InventarioProducto_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventarioproducto`
--

LOCK TABLES `inventarioproducto` WRITE;
/*!40000 ALTER TABLE `inventarioproducto` DISABLE KEYS */;
INSERT INTO `inventarioproducto` VALUES (41,1001,50,10,30.500,'2025-06-15 00:00:00','2025-01-20 12:00:00',1,3,1,'caducado'),(42,1005,40,8,20.000,'2025-05-10 00:00:00','2025-01-22 10:00:00',1,3,1,'caducado'),(43,1011,60,12,45.750,'2025-05-20 00:00:00','2025-01-19 15:30:00',7,3,1,'caducado'),(44,2025,80,10,60.000,'2025-02-20 00:00:00','2025-01-25 09:00:00',2,3,1,'caducado'),(46,3001,30,5,18.000,'2025-04-15 00:00:00','2025-01-18 14:00:00',3,3,1,'caducado'),(47,5001,40,10,0.000,'2025-03-12 00:00:00','2025-01-20 15:00:00',4,3,1,'finalizado'),(48,6022,100,20,0.000,'2026-01-01 00:00:00','2025-01-16 13:30:00',5,3,1,'finalizado'),(49,6032,120,25,90.000,'2026-03-15 00:00:00','2025-01-17 09:45:00',5,3,4,'en_stock'),(50,7001,200,30,150.000,'2026-12-31 00:00:00','2025-01-10 08:20:00',6,3,5,'en_stock'),(51,3003,5000,100,0.000,'2025-12-04 00:00:00','2025-11-19 08:39:28',3,3,2,'finalizado'),(52,5001,5000,100,0.000,'2025-12-04 00:00:00','2025-11-19 08:45:34',3,3,1,'finalizado'),(53,6037,15,1,0.000,'2025-11-20 00:00:00','2025-11-19 20:02:42',2,3,1,'finalizado'),(54,6037,200,50,95.000,'2025-11-21 00:00:00','2025-11-19 20:45:13',3,3,1,'caducado'),(55,3005,15,2,15.000,'2025-12-05 00:00:00','2025-11-20 21:39:41',6,3,4,'en_stock'),(56,6034,15,2,11.000,'2025-12-05 00:00:00','2025-11-20 21:41:46',6,3,4,'en_stock'),(57,3005,20,5,15.000,'2025-11-22 00:00:00','2025-11-20 22:03:28',6,3,3,'caducado'),(58,3005,20,5,15.000,'2025-11-22 00:00:00','2025-11-20 22:03:32',6,3,3,'caducado'),(59,3005,20,5,15.000,'2025-11-22 00:00:00','2025-11-20 22:05:19',6,3,3,'caducado');
/*!40000 ALTER TABLE `inventarioproducto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mesa`
--

DROP TABLE IF EXISTS `mesa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `mesa` (
  `idMesa` int NOT NULL AUTO_INCREMENT,
  `estado` enum('disponible','ocupada','inhabilitada') NOT NULL DEFAULT 'disponible',
  `numeroMesa` int NOT NULL,
  PRIMARY KEY (`idMesa`),
  UNIQUE KEY `numeroMesa_UNIQUE` (`numeroMesa`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesa`
--

LOCK TABLES `mesa` WRITE;
/*!40000 ALTER TABLE `mesa` DISABLE KEYS */;
INSERT INTO `mesa` VALUES (1,'disponible',1),(2,'disponible',2),(3,'disponible',3),(4,'disponible',4),(5,'disponible',5),(6,'disponible',6),(7,'disponible',7);
/*!40000 ALTER TABLE `mesa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden`
--

DROP TABLE IF EXISTS `orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orden` (
  `idOrden` int NOT NULL AUTO_INCREMENT,
  `Usuario_idUsuario` int NOT NULL,
  `Mesa_idMesa` int NOT NULL,
  `estado` enum('cerrada','abierta') NOT NULL DEFAULT 'abierta',
  `total` decimal(10,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`idOrden`),
  KEY `fk_Orden_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_Orden_Mesa1_idx` (`Mesa_idMesa`),
  CONSTRAINT `fk_Orden_Mesa1` FOREIGN KEY (`Mesa_idMesa`) REFERENCES `mesa` (`idMesa`),
  CONSTRAINT `fk_Orden_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden`
--

LOCK TABLES `orden` WRITE;
/*!40000 ALTER TABLE `orden` DISABLE KEYS */;
/*!40000 ALTER TABLE `orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pedido`
--

DROP TABLE IF EXISTS `pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pedido` (
  `idPedido` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL,
  `estado` enum('entregado','pendiente','cancelado') NOT NULL DEFAULT 'pendiente',
  `Usuario_idUsuario` int NOT NULL,
  `Proveedor_idProveedor` int NOT NULL,
  PRIMARY KEY (`idPedido`),
  KEY `fk_Pedido_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_Pedido_Proveedor1_idx` (`Proveedor_idProveedor`),
  CONSTRAINT `fk_Pedido_Proveedor1` FOREIGN KEY (`Proveedor_idProveedor`) REFERENCES `proveedor` (`idProveedor`),
  CONSTRAINT `fk_Pedido_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pedido`
--

LOCK TABLES `pedido` WRITE;
/*!40000 ALTER TABLE `pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `idPermiso` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(30) NOT NULL,
  `descripcion` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`idPermiso`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (28,'gestionar_platillos','Acciones sobre platillos (alta, baja, update, ver)'),(29,'gestionar_productos','Acciones sobre productos (alta, baja, update, ver)'),(30,'gestionar_permisos','Puede administrar roles y permisos'),(31,'ver_ordenes','Puede visualizar las órdenes'),(32,'crear_orden','Puede crear nuevas órdenes'),(33,'editar_orden','Puede actualizar el estado de órdenes'),(34,'eliminar_orden','Puede eliminar o cancelar órdenes'),(35,'ver_platillo_orden','Puede visualizar los platillos dentro de la comanda'),(36,'crear_platillo_orden','Agrega platillos a la orden'),(37,'editar_platillo_orden','Puede actualizar el estado de los platillos en la orden'),(38,'eliminar_platillo_orden','Puede eliminar pedidos dentro de una orden'),(39,'crear_platillos','Puede dar de alta un platillo nuevo al menú'),(40,'ver_platillos','Puede visualizar los platillos del menú'),(41,'editar_platillo','Puede modificar algún platillo del menú'),(42,'eliminar_platillo','Puede eliminar platillos del menú'),(43,'crear_producto','Dar de alta un nuevo producto'),(44,'ver_productos','Puede visualizar el catalogo de productos'),(45,'editar_producto','Puede modificar o actualizar las caracteristicas de un producto'),(46,'eliminar_producto','Puede eliminar cualquier producto'),(47,'crear_usuario','Puede dar de alta algún usuario'),(48,'ver_usuarios','Puede consultar los usuarios existentes'),(49,'editar_usuario','Puede modificar los datos del usuario'),(50,'eliminar_usuario','Puede dar de baja a cualquier usuario'),(51,'crear_proveedor','Puede dar de alta algún proveedor'),(52,'ver_proveedores','Puede consultar los proveedores existentes'),(53,'editar_proveedor','Puede modificar los datos del proveedor'),(54,'eliminar_proveedor','Puede dar de baja a cualquier proveedor'),(55,'ver_inventario','Puede consultar el inventario'),(56,'crear_inventario','Puede registrar un nuevo lote en el inventario'),(57,'editar_inventario','Puede actualizar el stock de algún producto en inventario'),(58,'eliminar_inventario','Puede eliminar cualquier lote existente en inventario'),(59,'crear_imprevisto','Puede reportar un imprevisto en inventario'),(60,'editar_imprevisto','Puede autorizar o rechazar imprevistos'),(61,'ver_imprevistos','Puede consultar los imprevistos registrados'),(62,'eliminar_imprevisto','Puede eliminar cualquier imprevisto'),(63,'ver_menu','Puede visualizar el menú de platillos');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso_rol`
--

DROP TABLE IF EXISTS `permiso_rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso_rol` (
  `Rol_idRol` int NOT NULL,
  `Permiso_idPermiso` int NOT NULL,
  PRIMARY KEY (`Rol_idRol`,`Permiso_idPermiso`),
  KEY `fk_Permiso_Rol_Permiso1_idx` (`Permiso_idPermiso`),
  CONSTRAINT `fk_Permiso_Rol_Permiso1` FOREIGN KEY (`Permiso_idPermiso`) REFERENCES `permiso` (`idPermiso`),
  CONSTRAINT `fk_Permiso_Rol_Rol` FOREIGN KEY (`Rol_idRol`) REFERENCES `rol` (`idRol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso_rol`
--

LOCK TABLES `permiso_rol` WRITE;
/*!40000 ALTER TABLE `permiso_rol` DISABLE KEYS */;
INSERT INTO `permiso_rol` VALUES (1,28),(1,29),(1,30),(1,31),(3,31),(4,31),(1,32),(4,32),(1,33),(4,33),(1,34),(4,34),(1,35),(3,35),(4,35),(1,36),(4,36),(1,37),(3,37),(1,38),(4,38),(1,39),(1,40),(3,40),(4,40),(1,41),(4,41),(1,42),(1,43),(1,44),(2,44),(3,44),(4,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(2,52),(1,53),(1,54),(1,55),(2,55),(1,56),(1,57),(2,57),(3,57),(4,57),(1,58),(1,59),(3,59),(1,60),(1,61),(1,62),(1,63),(4,63),(5,63);
/*!40000 ALTER TABLE `permiso_rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillo`
--

DROP TABLE IF EXISTS `platillo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillo` (
  `idPlatillo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `id_categoria` varchar(255) DEFAULT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` enum('disponible','agotado','descontinuado') NOT NULL DEFAULT 'disponible',
  PRIMARY KEY (`idPlatillo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo`
--

LOCK TABLES `platillo` WRITE;
/*!40000 ALTER TABLE `platillo` DISABLE KEYS */;
INSERT INTO `platillo` VALUES (1,'Brocheta Empanizada de Pollo','','1',NULL,45.00,'agotado'),(2,'Brocheta Empanizada de Camarón','','1',NULL,50.00,'agotado'),(3,'Brocheta Empanizada de Surimi','','1',NULL,45.00,'agotado'),(4,'Brocheta de Queso con Plátano Macho','','1',NULL,50.00,'agotado'),(5,'Ensalada Sunomono Especial','Ensalada a base de kanikama, pepino, zanahoria, pimiento morrón y apio en julianas, con camarón, pulpo y callo de hacha sazonada con furikake, aderezada con vinagreta sunomono especial de la casa.','2',NULL,165.00,'agotado'),(6,'MK Salad (Salmón 150 g)','Filete de salmón acompañado de una mezcla de lechugas, frutos rojos, manzana y pepino con vinagreta de frutos rojos.','2',NULL,175.00,'agotado'),(7,'Tazón Especial con Pollo','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: pechuga de pollo empanizada.','2',NULL,165.00,'agotado'),(8,'Tazón Especial con Sirloin','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: sirloin a la parrilla.','2',NULL,185.00,'agotado'),(9,'Tazón Especial con Atún','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: atún.','2',NULL,185.00,'agotado'),(10,'Aros de Calamar (120g.)','Aros de calamar empanizados, acompañados de salsa BBQ.','3',NULL,138.00,'agotado'),(11,'Aros de Cebolla (120g.)','Aros de cebolla capeados, acompañados de salsa sweet-spicy.','3',NULL,75.00,'agotado'),(12,'Sampler Botanero','Con boneless de pollo, queso Chihuahua, camarones y aros de calamar empanizados, acompañados de aderezo srirasha.','3',NULL,165.00,'agotado'),(13,'Chile Torito','Chile caribe relleno con camarones, queso Chihuahua, Philadelphia, envuelto con tocino y empanizado con panko.','3',NULL,69.00,'agotado'),(14,'Edamames','Vainas de frijol de soya sofritas en ajo y mantequilla, salteadas en una salsa picosita a base de srirasha y shichimi.','3',NULL,95.00,'agotado'),(15,'Tiradito Atún (120g.)','Finas rebanadas de atún marinadas con una deliciosa salsa negra de la casa.','3',NULL,185.00,'agotado'),(16,'Tiradito Salmón (120g.)','Finas rebanadas de salmón marinadas con una deliciosa salsa negra de la casa.','3',NULL,205.00,'agotado'),(17,'Tiradito Mixto (200g.)','Finas rebanadas combinadas de atún y salmón marinadas con una deliciosa salsa negra de la casa.','3',NULL,269.00,'agotado'),(18,'Tostadita MK','Tostada Wonton con base de pepino, camarón, atún, salmón y callo de hacha marinados en salsa aguachile negra, con un toque de cebolla x\'nipec y rebanadas de aguacate.','3',NULL,69.00,'agotado'),(19,'Tostadita de Aguachile','Camarones marinados en salsa de aguachile MK, con pepino, aguacate y cebolla x\'nipec sobre una tostada Wonton.','3',NULL,69.00,'agotado'),(20,'Torres de Mariscos','Camarones, atún, pulpo, callo de hacha, pepino, aguacate y cebolla x\'nipec bañados con salsa negra y un toque de clamato.','3',NULL,225.00,'agotado'),(21,'Gohan','Arroz al vapor con especias, salmón y tampico, acompañado con aguacate y queso Philadelphia.','4',NULL,145.00,'agotado'),(22,'Yakimeshi','Arroz frito salteado con calabaza, zanahoria y cebollín, con sirloin y tocino, acompañado con tampico, aguacate y Philadelphia.','4',NULL,125.00,'agotado'),(23,'Arrokis','Arroz frito salteado con camarón, calabaza y zanahoria, acompañado con tampico, aguacate y Philadelphia.','4',NULL,139.00,'agotado'),(24,'Bomba Especial','Bola de arroz rellena de res, tocino y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.','4',NULL,149.00,'agotado'),(25,'Bomba Marinera','Bola de arroz rellena de camarón, pulpo, tampico y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.','4',NULL,149.00,'agotado'),(26,'Teppa Udon Sirloin (150g.)','Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.','5',NULL,209.00,'agotado'),(27,'Teppa Udon Camarón (120g.)','Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.','5',NULL,225.00,'agotado'),(28,'Wok Teriyaki Pollo (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,195.00,'agotado'),(29,'Wok Teriyaki Camarón (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,225.00,'agotado'),(30,'Wok Teriyaki Sirloin (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,209.00,'agotado'),(31,'Wok Teriyaki Mixto (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,235.00,'agotado'),(32,'Wok Teppanyaki Pollo (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,195.00,'agotado'),(33,'Wok Teppanyaki Camarón (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,225.00,'agotado'),(34,'Wok Teppanyaki Sirloin (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,209.00,'agotado'),(35,'Wok Teppanyaki Mixto (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,235.00,'agotado'),(36,'Roka Ebi (160g. Camarón)','Camarones empanizados con panko sobre arroz frito, con aderezo a elección (sweet-spicy, BBQ, mango-habanero).','5',NULL,185.00,'agotado'),(37,'Yakisoba Sirloin (150g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,199.00,'agotado'),(38,'Yakisoba Camarón (120g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,199.00,'agotado'),(39,'Yakisoba Mixto (140g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,205.00,'agotado'),(40,'Chikin MK (150g. Pollo)','Fajitas de pollo salteadas con vegetales en salsa picosita a base de sriracha, sobre arroz frito.','5',NULL,175.00,'agotado'),(41,'Chikin Strips (180g. Pollo)','Crujientes tiritas de pollo empanizadas acompañadas con salsa a elección (BBQ, Mango-Habanero).','5',NULL,165.00,'agotado'),(42,'Fahítas (150g.)','Fajitas de sirloin con camarones, cebolla cambray, tomate y chiles en juliana con pasta Udón.','5',NULL,185.00,'agotado'),(43,'Tun (220g. Atún)','Filete de atún fajeado y sellado con costra de ajonjolí, acompañado de vegetales y arroz al vapor.','5',NULL,225.00,'agotado'),(44,'OrenjiChikin (200g. Pollo)','Boneless de pollo salteados con salsa de naranja sobre una cama de arroz.','5',NULL,175.00,'agotado'),(45,'Tom Yum','Sopa con mariscos (camarón, pulpo, surimi) y vegetales en un caldo ligeramente picante.','6',NULL,139.00,'agotado'),(46,'Kenko','Berenjena por dentro con cubierta de zanahoria al tempura y brócoli frito por fuera con aderezo cebollín.','7',NULL,115.00,'agotado'),(47,'Fruit Roll','Kiwi por dentro con cubierta de Philadelphia, mango y ajonjolí garapiñado por fuera acompañado con salsa de fresa.','7',NULL,115.00,'agotado'),(48,'Bigan Roll','Verduras al tempura, queso de hojuela de papa por dentro enrollado en alga de soya.','7',NULL,149.00,'agotado'),(49,'Abokado Maki','Atún por dentro con cubierta de aguacate, rayado con anguila y espolvoreado con ajonjolí negro.','7',NULL,145.00,'agotado'),(50,'Glass Maki','Camarón y surimi por dentro con cama de pepino por fuera, Philadelphia y ajonjolí negro.','7',NULL,145.00,'disponible'),(51,'California Roll','Camarón por dentro con cubierta de mezcla de ajonjolís.','7',NULL,125.00,'agotado'),(52,'Salmoncito Roll','Piel de salmón por dentro con cubierta de salmón y topping de tampico, cebollín y salsa de anguila.','7',NULL,155.00,'agotado'),(53,'Phila','Camarón empanizado por dentro con cubierta de queso Philadelphia.','7',NULL,119.00,'agotado'),(54,'Tako Maki','Surimi capeado por dentro con cubierta de pulpo rayado con aderezo cebollín.','7',NULL,145.00,'agotado'),(55,'MK Roll','Camarón y salmón por dentro con cubierta mitad de queso Philadelphia y mitad de aguacate.','7',NULL,169.00,'agotado'),(56,'Akuma Maki','Camarón empanizado a la diabla por dentro con cubierta de tampico y camarones, rayado con salsa sweet-spicy.','7',NULL,135.00,'agotado'),(57,'Aguachile Roll','Pulpo por dentro con cubierta de aguacate y camarones en salsa de aguachile negra MK.','7',NULL,175.00,'agotado'),(58,'Aguachile Mango-Habanero','Surimi por dentro con cubierta de aguacate y camarones en salsa de aguachile de mango.','7',NULL,175.00,'agotado'),(59,'Sake Maki','Surimi frito por dentro con cubierta de Philadelphia y salmón.','7',NULL,165.00,'agotado'),(60,'Masago Roll','Base de arroz con masago, salmón por dentro con topping de tampico y camarones fritos por fuera, rayado con aderezo cebollín.','7',NULL,175.00,'agotado'),(61,'Umi Maki','Camarón por dentro con cubierta de Philadelphia y tiras de surimi empanizadas encima, rayado con aderezo sriracha y salsa de anguila.','7',NULL,129.00,'agotado'),(62,'Hono Maki','Surimi por dentro con cubierta horneada de sirloin, tocino, tampico, queso manchego y Philadelphia.','7',NULL,160.00,'agotado'),(63,'Ebi Roll','Camarón por dentro, cubierta de queso manchego (empanizado).','8',NULL,119.00,'agotado'),(64,'Mar y Tierra','Sirloin y camarón por dentro (empanizado).','8',NULL,129.00,'agotado'),(65,'Roka Chicken Roll','Tiras de pollo empanizadas, tocino y queso manchego por dentro, Philadelphia por fuera (capeado).','8',NULL,135.00,'agotado'),(66,'Fat Roll','Res, pollo, camarón y tocino por dentro, con Philadelphia y manchego por fuera (capeado).','8',NULL,155.00,'agotado'),(67,'Don Cangrejo','Camarón por dentro con Kanikama, aderezo chipotle y camarón frito por fuera, rayado con aderezo cebollín (empanizado).','8',NULL,175.00,'agotado'),(68,'Yaki Maki','Cama de arroz frito con tocino, queso manchego por dentro, con tampico y tiras de pollo empanizado por fuera, rayado con aderezo sriracha (capeado).','8',NULL,139.00,'agotado'),(69,'Nomi Maki','Camarón y salmón por dentro, láminas de queso manchego por fuera con topping de Philadelphia y sriracha (empanizado).','8',NULL,175.00,'agotado'),(70,'Pike Roll','Sirloin marinado, tocino frito y chile serrano por dentro, gratinado con queso manchego (empanizado).','8',NULL,138.00,'agotado'),(71,'Sumo Maki','Sirloin, pollo y tocino por dentro, manchego y Philadelphia por fuera empanizado pieza por pieza.','8',NULL,145.00,'agotado'),(72,'Cheese Roll','Camarón y sirloin por dentro, gratinado con queso manchego, tocino picado y chile serrano (empanizado).','8',NULL,148.00,'agotado'),(73,'Tampiko Roll','Camarón y pulpo por dentro, con topping de tampico y trocitos de aguacate por fuera (empanizado).','8',NULL,145.00,'agotado'),(74,'Parrillero','Camarón y tocino por dentro, con topping de tampico y tiritas de sirloin empanizadas por fuera, rayado con salsa BBQ (empanizado).','8',NULL,149.00,'agotado'),(75,'Té Helado 480 ML (3 refill)',' ','9',NULL,55.00,'agotado'),(76,'Refrescos (355 ML)',' ','9',NULL,42.00,'disponible'),(77,'Limonada (480 ML)',' ','9',NULL,55.00,'agotado'),(78,'Limonada Pepino/Limón (480 ML)',' ','9',NULL,55.00,'agotado'),(79,'Naranjada (562 ML)',' ','9',NULL,55.00,'agotado'),(80,'Fresada (480 ML)',' ','9',NULL,65.00,'agotado'),(81,'Piñada (480 ML)',' ','9',NULL,65.00,'agotado'),(82,'Conga (480 ML)',' ','9',NULL,60.00,'disponible'),(83,'Clamato Mineral (480 ML)',' ','9',NULL,65.00,'agotado'),(84,'Café Americano (230 ML)',' ','9',NULL,40.00,'agotado'),(85,'Capuchino (240 ML)',' ','9',NULL,65.00,'agotado'),(86,'Café Expreso (30 ML)',' ','9',NULL,45.00,'agotado'),(87,'Helado Tempura','Helado de vainilla capeado y frito, acompañado de crema batida y chocolate líquido Hershey\'s.','9',NULL,80.00,'agotado'),(88,'Camelado','Gelatina de café en cubos con helado de vainilla y rompope.','9',NULL,79.00,'agotado'),(89,'Copa de Helado','Helado de vainilla con chantilly y chocolate líquido Hershey\'s.','9',NULL,65.00,'agotado'),(90,'Brownie con Chocolate','Brownie con chocolate líquido Hershey\'s.','9',NULL,79.00,'agotado'),(91,'Brownie con Helado','Brownie con helado de vainilla y chocolate líquido Hershey\'s.','9',NULL,89.00,'agotado'),(92,'Tecate 355 ML',' ','10',NULL,45.00,'agotado'),(93,'Tecate Light 355 ML',' ','10',NULL,45.00,'agotado'),(94,'Indio 355 ML',' ','10',NULL,45.00,'agotado'),(95,'Carta Blanca 355 ML',' ','10',NULL,45.00,'agotado'),(96,'XX Larger 355 ML',' ','10',NULL,45.00,'agotado'),(97,'XX Ámbar 355 ML',' ','10',NULL,45.00,'agotado'),(98,'Bohemia 355 ML',' ','10',NULL,55.00,'agotado'),(99,'Bohemia Obscura 355 ML',' ','10',NULL,55.00,'agotado'),(100,'Miller High Life 355 ML',' ','10',NULL,55.00,'agotado'),(101,'Heineken 355 ML',' ','10',NULL,55.00,'agotado'),(102,'Amstel Ultra 355 ML',' ','10',NULL,55.00,'agotado'),(103,'Clamato MK 540 ML',' ','10',NULL,85.00,'agotado'),(104,'Piña Colada 480 ML',' ','10',NULL,75.00,'agotado'),(105,'Gin Tonic 480 ML',' ','10',NULL,65.00,'agotado'),(106,'Gin de Frutos Rojos 480 ML',' ','10',NULL,65.00,'agotado'),(107,'Mojito 360 ML',' ','10',NULL,65.00,'agotado'),(108,'Mojito de Frutos Rojos 360 ML',' ','10',NULL,65.00,'agotado'),(109,'Margarita MK 330 ML',' ','10',NULL,69.00,'agotado'),(110,'Margarita 330 ML',' ','10',NULL,65.00,'agotado'),(111,'Margarita de Mango 330 ML',' ','10',NULL,65.00,'agotado'),(112,'Margarita de Fresa 330 ML',' ','10',NULL,65.00,'agotado'),(113,'Sangría 480 ML',' ','10',NULL,65.00,'agotado'),(114,'Clericot MK 480 ML',' ','10',NULL,69.00,'agotado'),(115,'Carajillo 360 ML',' ','10',NULL,95.00,'agotado');
/*!40000 ALTER TABLE `platillo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillo_categoria`
--

DROP TABLE IF EXISTS `platillo_categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillo_categoria` (
  `id_categoria_platillo` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(150) DEFAULT NULL,
  PRIMARY KEY (`id_categoria_platillo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo_categoria`
--

LOCK TABLES `platillo_categoria` WRITE;
/*!40000 ALTER TABLE `platillo_categoria` DISABLE KEYS */;
INSERT INTO `platillo_categoria` VALUES (1,'Brochetas','Categoría para las brochetas empanizadas con diferentes proteínas.'),(2,'Ensaladas','Categoría para ensaladas frescas con base de vegetales, frutas y proteínas.'),(3,'Entradas','Categoría para los aperitivos y botanas de inicio.'),(4,'Arroz','Categoría para los platillos elaborados a base de arroz.'),(5,'Platillos','Categoría para los platillos principales de la carta.'),(6,'Sopas','Categoría para las sopas y caldos especiales de la casa.'),(7,'Rollos Naturales','Categoría para los rollos fríos elaborados con ingredientes naturales.'),(8,'Rollos Calientes','Categoría para los rollos calientes o empanizados.'),(9,'Postres y Bebidas','Categoría para los postres dulces y bebidas frías o calientes.'),(10,'Cervezas','Categoría para las cervezas nacionales e importadas.');
/*!40000 ALTER TABLE `platillo_categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platillo_orden`
--

DROP TABLE IF EXISTS `platillo_orden`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platillo_orden` (
  `idPlatilloOrden` int NOT NULL AUTO_INCREMENT,
  `Orden_idOrden` int NOT NULL,
  `Platillo_idPlatillo` int NOT NULL,
  `cantidad` int NOT NULL,
  `estado` enum('pendiente','entregado','preparacion','cancelado','listo','espera') NOT NULL DEFAULT 'pendiente',
  `precioUnitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`idPlatilloOrden`),
  KEY `Orden_idOrden_idx` (`Orden_idOrden`),
  KEY `Platillo_idPlatillo_idx` (`Platillo_idPlatillo`),
  CONSTRAINT `fk_idOrden` FOREIGN KEY (`Orden_idOrden`) REFERENCES `orden` (`idOrden`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_idPlatillo` FOREIGN KEY (`Platillo_idPlatillo`) REFERENCES `platillo` (`idPlatillo`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo_orden`
--

LOCK TABLES `platillo_orden` WRITE;
/*!40000 ALTER TABLE `platillo_orden` DISABLE KEYS */;
/*!40000 ALTER TABLE `platillo_orden` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `idProducto` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) DEFAULT NULL,
  `estado` enum('vigente','descontinuado','suspendido') NOT NULL DEFAULT 'vigente',
  `Categoria_idCategoria` int NOT NULL,
  `UnidadMedida_idUnidadMedida` int NOT NULL,
  PRIMARY KEY (`idProducto`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  KEY `fk_Producto_Categoria1_idx` (`Categoria_idCategoria`),
  KEY `fk_Producto_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  CONSTRAINT `fk_Producto_Categoria1` FOREIGN KEY (`Categoria_idCategoria`) REFERENCES `categoria` (`idCategoria`),
  CONSTRAINT `fk_Producto_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`)
) ENGINE=InnoDB AUTO_INCREMENT=14012 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1001,'CAMARÓN 41/50','vigente',9,2),(1002,'PULPO COCIDO','vigente',9,2),(1003,'CALLO DE HACHA MEDIA LUNA','vigente',9,2),(1004,'AROS DE CALAMAR','vigente',9,2),(1005,'SALMÓN AHUMADO','vigente',9,2),(1006,'SURIMI AQUAMAR','vigente',9,2),(1007,'STEAK DE ATÚN NACIONAL','vigente',9,2),(1008,'EDAMAMES CON VAINA','vigente',2,2),(1009,'CAMARÓN 26-30','vigente',9,2),(1010,'MASAGO HUEVA DE PEZ','vigente',2,2),(1011,'SALMÓN','vigente',9,2),(2001,'BRÓCOLI','vigente',7,2),(2022,'AJO','vigente',7,2),(2023,'MANGO PETACÓN','vigente',7,2),(2024,'CHILE SERRANO','vigente',7,2),(2025,'CEBOLLA MORADA','vigente',7,2),(2026,'CHILE MORRÓN','vigente',7,2),(2027,'COL MORADA','vigente',7,2),(2028,'APIO','vigente',7,2),(2029,'FRESA','vigente',7,2),(2030,'JITOMATE','vigente',7,2),(2031,'MANZANA','vigente',7,2),(2032,'CHILE POBLANO','vigente',7,2),(2033,'PIÑA MIEL','vigente',7,2),(2034,'HIERBABUENA','vigente',7,2),(2035,'CILANTRO','vigente',7,2),(2037,'JUGO DE NARANJA','vigente',7,3),(3001,'SIRLOIN','vigente',4,2),(3002,'TOCINO AHUMADO DE CERDO','vigente',4,2),(3003,'PECHUGA DE POLLO MEDIA MARIPOSA','vigente',10,2),(3004,'COCHINITA','vigente',4,2),(3005,'JUGO PARA CARNE','vigente',1,3),(3006,'BISTEC DE RES','vigente',4,2),(5001,'QUESO PHILADELPHIA','vigente',8,2),(5002,'QUESO CHIHUAHUA CHILCHOTA','vigente',8,2),(5003,'QUESO VEGANO','vigente',8,2),(5004,'QUESO MANCHEGO (GOUDA ALEMÁN)','vigente',8,2),(5005,'MARGARINA','vigente',8,2),(6001,'COLIFLOR','vigente',7,2),(6002,'AGUACATE','vigente',7,2),(6003,'PEPINO','vigente',7,2),(6004,'CALABAZA','vigente',7,2),(6005,'CEBOLLA CAMBRAY','vigente',7,2),(6006,'CHAMPIÑÓN','vigente',7,2),(6007,'ZANAHORIA','vigente',7,2),(6008,'LIMÓN','vigente',7,2),(6009,'BERENJENA','vigente',7,2),(6010,'JENGIBRE','vigente',7,2),(6011,'LIMÓN S/S','vigente',7,2),(6012,'KIWI','vigente',7,2),(6013,'NARANJA','vigente',7,2),(6014,'CHILE HÚNGARO','vigente',7,2),(6015,'CEBOLLA','vigente',7,2),(6016,'PLÁTANO MACHO','vigente',7,2),(6017,'LECHUGA ITALIANA','vigente',7,2),(6018,'LECHUGA SANGRÍA','vigente',7,2),(6019,'CHILE JALAPEÑO','vigente',7,2),(6020,'CHILE HABANERO','vigente',7,2),(6021,'SALSA SRIRACHA','vigente',2,3),(6022,'ARROZ KOKUHO','vigente',2,2),(6023,'TÉMPURA','vigente',2,2),(6024,'RAMEN','vigente',2,2),(6025,'WONTON','vigente',2,2),(6026,'ALGA NORI','vigente',2,2),(6027,'HUEVA DE PESCADO','vigente',2,2),(6028,'PASTA PARA TOM YUM','vigente',2,2),(6029,'FURIKAKE','vigente',2,2),(6030,'SALSA DE ANGUILA','vigente',2,3),(6031,'PANKO','vigente',2,2),(6032,'SALSA DE SOYA NATURAL','vigente',2,3),(6033,'Vinagre Blanco','vigente',1,3),(6034,'LECHE CARNATION','vigente',1,3),(6035,'Fresa Congelada','vigente',1,2),(6036,'CHILE CHIPOTLE','vigente',1,2),(6037,'HUEVO','vigente',1,2),(6038,'JUGO LIMÓN CONGELADO','vigente',1,3),(6039,'JUGO MAGGI','vigente',1,3),(6040,'JUGO PIÑA','vigente',12,3),(6041,'KANIKAMA','vigente',2,2),(6042,'JARABE NATURAL','vigente',1,3),(6043,'EDAMAMES','vigente',2,2),(6044,'SALSA INGLESA','vigente',1,3),(6045,'ADEREZO DE MAYONESA','vigente',3,2),(6046,'PIMIENTA LIMÓN','vigente',1,2),(6047,'SALSA BBQ','vigente',3,3),(6048,'ALGA DE SOYA','vigente',2,2),(6049,'SALSA MANGO HABANERO','vigente',1,3),(6050,'GOMITAS','vigente',1,2),(6052,'PASTA NOODLE HOUSE FIDEO DELGADO','vigente',2,2),(6053,'OHASHI','vigente',2,5),(6054,'CALPIS SUI','vigente',2,3),(6055,'AZÚCAR','vigente',1,2),(6056,'TÉ HELADO KLAS','vigente',1,3),(6057,'ACEITE FREIDORA','vigente',1,3),(6058,'PASTA UDON','vigente',2,2),(6059,'JARABE DE MORAS','vigente',1,3),(6060,'CREMA DE COCO','vigente',1,3),(6061,'JARABE DE GRANADINA','vigente',1,3),(6062,'JUGO DE TORONJA','vigente',1,3),(6063,'SAL','vigente',1,2),(6064,'CREMA CHANTILLÍ','vigente',1,2),(6065,'VINO TINTO','vigente',1,3),(6066,'VINO BLANCO','vigente',1,3),(6067,'JUGO NARANJA','vigente',1,3),(6068,'JUGO NARANJA NATURAL','vigente',1,3),(6069,'PAN BOLLO','vigente',1,2),(6070,'ELOTE EN GRANO','vigente',1,2),(6071,'KIKKOMAN SALSA DE SOYA BOTE 18.9 LT','vigente',2,3),(6072,'CAFÉ NESCAFÉ','vigente',1,2),(6073,'EDAMAMES SIN VAINA','vigente',2,2),(6074,'RICO POLLO','vigente',1,2),(6075,'GRENETINA','vigente',1,2),(6076,'AJONJOLÍ','vigente',1,2),(6077,'AJONJOLÍ NEGRO','vigente',1,2),(6078,'HARINA','vigente',1,2),(6079,'CÁTSUP','vigente',1,3),(6080,'SHICHIMI','vigente',2,2),(6081,'PASTA RAMEN','vigente',2,2),(6082,'CHOCOLATE LÍQUIDO HERSHEY\'S','vigente',1,3),(6083,'AGUA GARRAFÓN','vigente',1,3),(6084,'CHILE TAJÍN','vigente',1,2),(6085,'KERMATO','vigente',1,2),(6086,'VINO TINTO CUATRO SOLES','vigente',1,3),(6087,'JARABE CONCENTRADO DE TAMARINDO','vigente',1,3),(6088,'CHAMOY','vigente',1,3),(6089,'CONCENTRADO DE MANGO','vigente',1,3),(6090,'CEREZAS','vigente',1,2),(6091,'SALSA DE OSTIÓN','vigente',2,3),(6092,'CLAMATO','vigente',1,3),(6093,'ADEREZO CEBOLLÍN','vigente',3,2),(6094,'ADEREZO CHIPOTLE','vigente',3,2),(6095,'ADEREZO SRIRACHA','vigente',3,2),(6096,'PONZU','vigente',13,2),(6097,'TAMPIKO','vigente',3,2),(6098,'SALSA AGUACHILE MANGO HABANERO','vigente',13,3),(6099,'SALSA DE XNIPEC','vigente',13,3),(6100,'PIMIENTA NEGRA','vigente',1,2),(6101,'ORÉGANO','vigente',1,2),(6102,'AZÚCAR GLASS','vigente',1,2),(6103,'JUGO DE LIMÓN','vigente',7,3),(6104,'ENDULZANTE SPLENDA SOBRE 1 G','vigente',1,2),(6105,'SWEET SPICY','vigente',1,2),(6106,'CAFÉ MOLIDO TOSTADO','vigente',1,2),(6107,'VINAGRE DE ARROZ','vigente',1,3),(7001,'COCA','vigente',12,3),(7002,'AGUA MINERAL PEÑAFIEL 2 LT','vigente',12,3),(7003,'CIEL MINERAL','vigente',12,3),(7004,'AGUA CIEL 600 ML','vigente',12,3),(7005,'COCA SIN AZÚCAR','vigente',12,3),(7006,'SIDRAL','vigente',12,3),(7007,'COCA LIGHT','vigente',12,3),(7008,'FRESCA','vigente',12,3),(7009,'SPRITE','vigente',12,3),(7010,'AGUA QUINA SCHWEPPES','vigente',12,3),(7011,'AGUA QUINA PEÑAFIEL','vigente',12,3),(7012,'SIDRAL PET','vigente',12,3),(7013,'AGUA QUINA','vigente',12,3),(8001,'SALSA DE AGUACHILE','vigente',13,3),(8003,'SALSA YAKISOBA','vigente',13,3),(8004,'VINAGRETA SUNOMONO','vigente',13,3),(8007,'CHILES TOREADOS','vigente',13,2),(8008,'SALSA DE FRESA','vigente',13,3),(9001,'HELADO VAINILLA','vigente',6,2),(9002,'FRUTOS ROJOS','vigente',6,2),(9003,'MANGO','vigente',6,2),(9004,'ENSALADA ITALIANA','vigente',6,2),(10001,'BROWNIE','vigente',11,5),(11001,'LICOR 43 750 ML','vigente',14,3),(11002,'BACARDÍ BLANCO 700 ML','vigente',14,3),(11003,'CONTROY 1 LT','vigente',14,3),(11004,'TEQUILA DESTILADO 1.5 LT','vigente',14,3),(11005,'GINEBRA OSO NEGRO 1 LT','vigente',14,3),(11006,'CARLO ROSSI TINTO GARRAFA 4 LT','vigente',14,3),(11007,'GINEBRA LONDON DRY','vigente',14,3),(11008,'ROMPOPE LA HOLANDESA','vigente',14,3),(11009,'BACARDÍ BLANCO 1.750 LT','vigente',14,3),(11010,'VINO TINTO DON SIMÓN 5 LT','vigente',14,3),(11011,'TEQUILA CAZADORES','vigente',14,3),(12001,'BOHEMIA OSCURA','vigente',5,3),(12002,'BOHEMIA CLARA','vigente',5,3),(12003,'HEINEKEN','vigente',5,3),(12004,'XX ÁMBAR','vigente',5,3),(12005,'XX LAGER','vigente',5,3),(12006,'INDIO','vigente',5,3),(12007,'AMSTEL ULTRA','vigente',5,3),(12008,'CARTA BLANCA','vigente',5,3),(12009,'TECATE LIGHT','vigente',5,3),(12010,'TECATE','vigente',5,3),(12011,'HIGH LIFE','vigente',5,3),(14005,'VINAGRE MK','vigente',3,3),(14008,'Chayote','vigente',7,2),(14009,'espinaca','vigente',7,2),(14010,'salsa picante','vigente',3,3);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_pedido`
--

DROP TABLE IF EXISTS `producto_pedido`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_pedido` (
  `idProducto_Pedido` int NOT NULL AUTO_INCREMENT,
  `Producto_idProducto` int NOT NULL,
  `Pedido_idPedido` int NOT NULL,
  `cantidad` decimal(10,3) NOT NULL,
  `UnidadMedida_idUnidadMedida` int NOT NULL,
  PRIMARY KEY (`idProducto_Pedido`),
  KEY `fk_Producto_Pedido_Producto1_idx` (`Producto_idProducto`),
  KEY `fk_Producto_Pedido_Pedido1_idx` (`Pedido_idPedido`),
  KEY `fk_Producto_Pedido_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  CONSTRAINT `fk_Producto_Pedido_Pedido1` FOREIGN KEY (`Pedido_idPedido`) REFERENCES `pedido` (`idPedido`),
  CONSTRAINT `fk_Producto_Pedido_Producto1` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`),
  CONSTRAINT `fk_Producto_Pedido_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_pedido`
--

LOCK TABLES `producto_pedido` WRITE;
/*!40000 ALTER TABLE `producto_pedido` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_pedido` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_platillo`
--

DROP TABLE IF EXISTS `producto_platillo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_platillo` (
  `Platillo_idPlatillo` int NOT NULL,
  `Producto_idProducto` int NOT NULL,
  `UnidadMedida_idUnidadMedida` int NOT NULL,
  `cantidad` int NOT NULL,
  PRIMARY KEY (`Platillo_idPlatillo`,`Producto_idProducto`),
  KEY `fk_Producto_Platillo_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  KEY `fk_Producto_Platillo_Producto1_idx` (`Producto_idProducto`),
  CONSTRAINT `fk_Producto_Platillo_Platillo1` FOREIGN KEY (`Platillo_idPlatillo`) REFERENCES `platillo` (`idPlatillo`),
  CONSTRAINT `fk_Producto_Platillo_Producto1` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`),
  CONSTRAINT `fk_Producto_Platillo_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_platillo`
--

LOCK TABLES `producto_platillo` WRITE;
/*!40000 ALTER TABLE `producto_platillo` DISABLE KEYS */;
INSERT INTO `producto_platillo` VALUES (1,3003,2,100),(1,5001,2,100),(1,6008,2,20),(1,6022,2,150),(2,1001,2,1),(3,1006,2,1),(4,6016,2,1),(5,6003,2,1),(6,1011,2,1),(7,3003,2,1),(8,3001,2,1),(9,1007,2,1),(10,1004,2,1),(11,6015,2,1),(12,1001,2,1),(13,6020,2,1),(14,6043,2,1),(15,1007,2,1),(16,1011,2,1),(17,1007,2,1),(18,6041,2,1),(19,1001,2,1),(20,1001,2,1),(21,6022,2,1),(22,6022,2,1),(23,6022,2,1),(24,6041,2,1),(25,6037,2,1),(26,3001,2,1),(27,1001,2,1),(28,3003,2,1),(29,1001,2,1),(30,3001,2,1),(31,1001,2,1),(32,3003,2,1),(33,1001,2,1),(34,3001,2,1),(35,1001,2,1),(36,1001,2,1),(37,3001,2,1),(38,1001,2,1),(39,1001,2,1),(40,3003,2,1),(41,3003,2,1),(42,3003,2,1),(43,1007,2,1),(44,3003,2,1),(45,6028,2,1),(46,6041,2,1),(47,6012,2,1),(48,6041,2,1),(49,6002,2,1),(50,6034,1,1),(51,6041,2,1),(52,1011,2,1),(53,5001,2,1),(54,1002,2,1),(55,6041,2,1),(56,6021,1,1),(57,1001,2,1),(58,2023,2,1),(59,1011,2,1),(60,1010,1,1),(61,6041,2,1),(62,6030,1,1),(63,1001,2,1),(64,3001,2,1),(65,3003,2,1),(66,6041,2,1),(67,6041,2,1),(68,3003,2,1),(69,6030,1,1),(70,6041,2,1),(71,6041,2,1),(72,5004,2,1),(73,6096,1,1),(74,3001,2,1),(75,6056,2,1),(76,7001,3,1),(77,6067,1,1),(78,6003,2,1),(79,6037,3,1),(80,2029,2,1),(81,2033,2,1),(82,6032,1,1),(83,6092,1,1),(84,6072,2,1),(85,6064,2,1),(86,6072,2,1),(87,9001,2,1),(88,9002,2,1),(89,9001,2,1),(90,10001,3,1),(91,10001,3,1),(92,12010,3,1),(93,12009,3,1),(94,12006,3,1),(95,12008,3,1),(96,12005,3,1),(97,12004,3,1),(98,12002,3,1),(99,12001,3,1),(100,12011,3,1),(101,12003,3,1),(102,12007,3,1),(103,6092,1,1),(104,6060,1,1),(105,11007,1,1),(106,11007,1,1),(107,6037,3,1),(108,2029,2,1),(109,11003,1,1),(110,11003,1,1),(111,2023,2,1),(112,2029,2,1),(113,6106,1,1),(114,6106,1,1),(115,11001,1,1);
/*!40000 ALTER TABLE `producto_platillo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `idProveedor` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `telefono` varchar(15) NOT NULL,
  `direccion` varchar(45) DEFAULT NULL,
  `correo` varchar(45) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  PRIMARY KEY (`idProveedor`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (1,'Mariscos del Pacífico','667-123-4567','Puerto 123, Mazatlán','contacto@mariscospacifico.com','activo'),(2,'Distribuidora Vegetal MX','667-987-6543','Av. Agricultura 54','ventas@vegemx.com','activo'),(3,'Carnes Selectas Norte','667-555-8899','Blvd. Ganadero 89','proveedor@carnesnorte.com','activo'),(4,'Lácteos del Valle','667-444-2211','Calle Leche 22','contacto@lacteovalle.com','activo'),(5,'Salsas y Condimentos SA','667-777-6633','Carretera Sur 120','ventas@salsacondimentos.com','activo'),(6,'Bebidas Frías MX','667-222-3344','Circunvalación 97','ventas@bebidasfriasmx.com','activo'),(7,'Congelados Premium','667-900-1234','Zona Industrial 45','info@congeladospremium.com','activo');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registroacceso`
--

DROP TABLE IF EXISTS `registroacceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registroacceso` (
  `idRegistro` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip` varchar(45) DEFAULT NULL,
  `ruta` varchar(255) DEFAULT NULL,
  `metodo` varchar(10) DEFAULT NULL,
  `username_proporcionado` varchar(100) DEFAULT NULL,
  `usuario_id` int DEFAULT NULL,
  `rol_requerido` varchar(100) DEFAULT NULL,
  `motivo` varchar(255) NOT NULL,
  `detalle` text,
  PRIMARY KEY (`idRegistro`),
  KEY `usuario_id` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registroacceso`
--

LOCK TABLES `registroacceso` WRITE;
/*!40000 ALTER TABLE `registroacceso` DISABLE KEYS */;
INSERT INTO `registroacceso` VALUES (1,'2025-11-02 15:46:48','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(2,'2025-11-02 15:47:44','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(3,'2025-11-02 15:47:51','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(4,'2025-11-02 15:48:18','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(5,'2025-11-02 15:48:32','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(6,'2025-11-02 15:48:33','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(7,'2025-11-02 15:48:34','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(8,'2025-11-02 15:48:34','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(9,'2025-11-02 15:49:02','::ffff:127.0.0.1','/api/auth/login','POST','andreaGerente',1,NULL,'Login fallido','Contraseña incorrecta'),(10,'2025-11-02 15:49:19','::ffff:127.0.0.1','/api/auth/login','POST','andreagerente',1,NULL,'Login fallido','Contraseña incorrecta'),(11,'2025-11-02 15:51:18','::ffff:127.0.0.1','/api/auth/login','POST','andrea',2,NULL,'Login fallido','Contraseña incorrecta'),(12,'2025-11-02 15:51:20','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(13,'2025-11-02 15:52:15','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(14,'2025-11-02 15:54:14','::ffff:127.0.0.1','/api/auth/login','POST','andrea',2,NULL,'Login fallido','Contraseña incorrecta'),(15,'2025-11-02 15:56:23','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(16,'2025-11-02 16:02:13','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(17,'2025-11-02 16:02:30','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(18,'2025-11-03 19:20:34','::ffff:127.0.0.1','/api/productos','GET','andreaG',3,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(19,'2025-11-03 19:52:58','::ffff:127.0.0.1','/api/auth/login','POST','andreaG',3,NULL,'Login fallido','Contraseña incorrecta'),(20,'2025-11-03 19:53:09','::ffff:127.0.0.1','/api/usuarios','GET','andreaG',3,'ver_usuarios','Permiso insuficiente','Rol 1 no tiene permiso ver_usuarios'),(21,'2025-11-03 20:05:51','::ffff:127.0.0.1','/api/auth/login','POST','andreaM',5,NULL,'Login fallido','Contraseña incorrecta'),(22,'2025-11-05 19:41:01','::ffff:127.0.0.1','/api/auth/login','POST','andreaC',NULL,NULL,'Login fallido','Usuario no encontrado'),(23,'2025-11-06 21:28:01','::ffff:127.0.0.1','/api/auth/login','POST','andreaC',NULL,NULL,'Login fallido','Usuario no encontrado'),(24,'2025-11-07 19:26:38','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(25,'2025-11-07 21:22:08','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(26,'2025-11-07 21:29:27','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(27,'2025-11-07 21:32:38','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(28,'2025-11-07 21:33:28','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(29,'2025-11-07 21:33:38','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(30,'2025-11-11 08:07:40','::ffff:127.0.0.1','/api/auth/login','POST','andreaM',5,NULL,'Login fallido','Contraseña incorrecta'),(31,'2025-11-17 15:55:42','::ffff:127.0.0.1','/api/auth/login','POST','andreaC',6,NULL,'Login fallido','Contraseña incorrecta'),(32,'2025-11-17 15:58:37','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(33,'2025-11-17 15:58:39','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(34,'2025-11-17 15:58:40','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(35,'2025-11-17 15:58:42','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(36,'2025-11-18 18:48:43','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(37,'2025-11-18 19:15:12','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(38,'2025-11-18 19:18:13','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(39,'2025-11-18 19:19:51','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(40,'2025-11-18 19:22:51','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(41,'2025-11-18 19:34:42','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(42,'2025-11-18 19:36:21','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(43,'2025-11-18 19:39:16','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(44,'2025-11-18 19:40:23','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(45,'2025-11-18 19:42:32','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(46,'2025-11-18 19:42:35','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(47,'2025-11-18 19:42:40','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(48,'2025-11-18 19:42:43','::ffff:127.0.0.1','/api/productosPlatillo/obtener/49','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(49,'2025-11-18 19:42:45','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(50,'2025-11-18 19:42:46','::ffff:127.0.0.1','/api/productosPlatillo/obtener/49','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(51,'2025-11-18 19:42:51','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(52,'2025-11-18 19:42:55','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(53,'2025-11-18 19:45:40','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(54,'2025-11-18 19:45:42','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(55,'2025-11-18 19:45:44','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(56,'2025-11-18 19:45:44','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(57,'2025-11-18 19:50:01','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(58,'2025-11-18 19:50:01','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(59,'2025-11-18 19:53:17','::ffff:127.0.0.1','/api/productosPlatillo/obtener/2','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(60,'2025-11-18 19:53:17','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(61,'2025-11-18 19:54:20','::ffff:127.0.0.1','/api/productosPlatillo/obtener/2','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(62,'2025-11-18 19:54:20','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(63,'2025-11-18 19:56:50','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(64,'2025-11-18 19:56:52','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(65,'2025-11-18 19:56:52','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(66,'2025-11-18 19:57:33','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(67,'2025-11-18 19:57:35','::ffff:127.0.0.1','/api/productosPlatillo/obtener/1','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(68,'2025-11-18 19:57:35','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(69,'2025-11-18 19:58:06','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(70,'2025-11-18 19:58:08','::ffff:127.0.0.1','/api/productosPlatillo/obtener/2','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(71,'2025-11-18 19:58:08','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(72,'2025-11-19 08:27:48','::ffff:127.0.0.1','/api/auth/login','POST','andreaG',3,NULL,'Login fallido','Contraseña incorrecta'),(73,'2025-11-19 17:55:17','::ffff:127.0.0.1','/api/usuarios','GET','andreaM',5,'ver_usuarios','Permiso insuficiente','Rol 4 no tiene permiso ver_usuarios'),(74,'2025-11-20 21:47:45','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(75,'2025-11-20 21:47:45','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(76,'2025-11-20 21:47:45','::ffff:127.0.0.1','/api/usuarios','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(77,'2025-11-20 21:48:02','::ffff:127.0.0.1','/api/perfil/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(78,'2025-11-20 21:48:02','::ffff:127.0.0.1','/api/productos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(79,'2025-11-20 21:48:02','::ffff:127.0.0.1','/api/usuarios','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(80,'2025-11-24 17:00:31','::ffff:127.0.0.1','/api/usuarios','GET','jorge ',7,'ver_usuarios','Permiso insuficiente','Rol 2 no tiene permiso ver_usuarios'),(81,'2025-11-24 17:08:49','::ffff:127.0.0.1','/api/usuarios','GET','jorge ',7,'ver_usuarios','Permiso insuficiente','Rol 2 no tiene permiso ver_usuarios');
/*!40000 ALTER TABLE `registroacceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `idRol` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(25) NOT NULL,
  `descripcion` varchar(65) DEFAULT NULL,
  PRIMARY KEY (`idRol`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Gerente','Acceso total al sistema'),(2,'Inventario','Encargado de administrar el inventario'),(3,'Chef','Prepara platillos y reporta imprevistos'),(4,'Mesero','Toma órdenes y atiende clientes'),(5,'Cliente','Visualiza menú con QR');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unidadmedida`
--

DROP TABLE IF EXISTS `unidadmedida`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unidadmedida` (
  `idUnidadMedida` int NOT NULL AUTO_INCREMENT,
  `medida` varchar(45) NOT NULL,
  `abreviatura` varchar(10) NOT NULL,
  `medidaEquivalente` varchar(45) DEFAULT NULL,
  `factorConversion` decimal(10,3) DEFAULT NULL,
  PRIMARY KEY (`idUnidadMedida`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unidadmedida`
--

LOCK TABLES `unidadmedida` WRITE;
/*!40000 ALTER TABLE `unidadmedida` DISABLE KEYS */;
INSERT INTO `unidadmedida` VALUES (1,'Kilogramo','Kg','Gramo',1000.000),(2,'Gramo','gr','Kilogramo',0.001),(3,'Mililitro','ml','Litro',0.001),(4,'Litro','Lt','Mililitro',1000.000),(5,'Pieza','pz','Kilogramo',NULL);
/*!40000 ALTER TABLE `unidadmedida` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(45) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `estado` enum('activo','inactivo') NOT NULL DEFAULT 'activo',
  `Rol_idRol` int NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  KEY `fk_Usuario_Rol1_idx` (`Rol_idRol`),
  CONSTRAINT `fk_Usuario_Rol1` FOREIGN KEY (`Rol_idRol`) REFERENCES `rol` (`idRol`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (3,'andreaG','andreaG','$2b$10$SJ.ryxFVXNpJE77PDVIa/O6qvyB1zag3c5rw28XYvJoZdsFmcoiK2','activo',1),(4,'andreaI','andreaI','$2b$10$9m7yJklFky3H4AGF5xvIbeLZj6XLLvQqh544h937JDMWgK7y2iOTi','activo',2),(5,'andreaM','andreaM','$2b$10$q4NlJEefbjw9AfT/XvNOeOYv2LtvrOLmNdQogoE0RsMDNXwsstYP6','activo',4),(6,'andreaC','andreaC','$2b$10$fcGw8E/vkwOj3mkKiWi5n.PcQWYS3k2D76qjuNC8vQ/JyFXrDPmcS','activo',3),(8,'jorge','jorge','$2b$10$dOWk5GiJKeVkZFH6Reb0huqQDVfMuJ1MRPWFGXJNtvgjXEYwP1wPu','activo',3);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-24 17:30:23

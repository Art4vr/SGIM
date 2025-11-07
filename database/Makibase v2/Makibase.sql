CREATE DATABASE  IF NOT EXISTS `makibase` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `makibase`;
-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: makibase
-- ------------------------------------------------------
-- Server version	9.2.0

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
INSERT INTO `categoria` VALUES (1,'Abarrotes','Categoria para los productos de abarrotes.'),(2,'Abarrotes Importación','Categoria para los productos de abarrotes de importación.'),(3,'Aderezos','Categoria para los productos de aderezos.'),(4,'Carnes','Categoria para los productos de carnes.'),(5,'Cerveza','Categoria para los productos de cervezas.'),(6,'Congelados','Categoria para los productos congelados.'),(7,'Frutas y Verduras','Categoria para las frutas y verduras.'),(8,'Lacteos','Categoria para los productos lacteos.'),(9,'Pescados y Mariscos','Categoria para los pescados y mariscos.'),(10,'Pollo','Categoria para el pollo.'),(11,'Postres','Categoria para los postres.'),(12,'Refrescos','Categoria para los refrescos.'),(13,'Salsas','Categoria para las salsas.'),(14,'Vinos y Licores','Categoria para los vinos y licores.');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
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
  PRIMARY KEY (`idInventarioProducto`),
  KEY `fk_InventarioProducto_Producto1_idx` (`Producto_idProducto`),
  KEY `fk_InventarioProducto_Proveedor1_idx` (`Proveedor_idProveedor`),
  KEY `fk_InventarioProducto_Usuario1_idx` (`Usuario_idUsuario`),
  KEY `fk_InventarioProducto_UnidadMedida1_idx` (`UnidadMedida_idUnidadMedida`),
  CONSTRAINT `fk_InventarioProducto_Producto1` FOREIGN KEY (`Producto_idProducto`) REFERENCES `producto` (`idProducto`),
  CONSTRAINT `fk_InventarioProducto_Proveedor1` FOREIGN KEY (`Proveedor_idProveedor`) REFERENCES `proveedor` (`idProveedor`),
  CONSTRAINT `fk_InventarioProducto_UnidadMedida1` FOREIGN KEY (`UnidadMedida_idUnidadMedida`) REFERENCES `unidadmedida` (`idUnidadMedida`),
  CONSTRAINT `fk_InventarioProducto_Usuario1` FOREIGN KEY (`Usuario_idUsuario`) REFERENCES `usuario` (`idUsuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `inventarioproducto`
--

LOCK TABLES `inventarioproducto` WRITE;
/*!40000 ALTER TABLE `inventarioproducto` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mesa`
--

LOCK TABLES `mesa` WRITE;
/*!40000 ALTER TABLE `mesa` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
<<<<<<< HEAD
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
=======
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb3;
>>>>>>> origin/main-v2
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
<<<<<<< HEAD
=======
INSERT INTO `permiso` VALUES (13,'eliminar_platillo','Puede eliminar platillos del menú'),(14,'crear_producto','Dar de alta un nuevo producto'),(15,'ver_productos','Puede visualizar el catalogo de productos'),(16,'editar_producto','Puede modificar o actualizar las caracteristicas de un producto'),(17,'eliminar_producto','Puede eliminar cualquier producto'),(18,'crear_usuario','Puede dar de alta algún usuario'),(19,'ver_usuarios','Puede consultar los usuarios existentes'),(20,'editar_usuario','Puede modificar los datos del usuario'),(21,'eliminar_usuario','Puede dar de baja a cualquier usuario'),(22,'crear_proveedor','Puede dar de alta algún proveedor'),(23,'ver_proveedores','Puede consultar los proveedores existentes'),(24,'editar_proveedor','Puede modificar los datos del proveedor'),(25,'eliminar_proveedor','Puede dar de baja a cualquier proveedor'),(26,'ver_inventario','Puede consultar el inventario'),(27,'crear_inventario','Puede registrar un nuevo lote en el inventario'),(28,'editar_inventario','Puede actualizar el stock de algún producto en inventario'),(29,'eliminar_inventario','Puede eliminar cualquier lote existente en inventario'),(30,'crear_imprevisto','Puede reportar un imprevisto en inventario'),(31,'editar_imprevisto','Puede autorizar o rechazar imprevistos'),(32,'ver_imprevistos','Puede consultar los imprevistos registrados'),(33,'eliminar_imprevisto','Puede eliminar cualquier imprevisto'),(34,'ver_menu','Puede visualizar el menú de platillos');
>>>>>>> origin/main-v2
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
<<<<<<< HEAD
=======
INSERT INTO `permiso_rol` VALUES (1,13),(1,14),(1,15),(2,15),(3,15),(4,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(2,23),(1,24),(1,25),(1,26),(2,26),(1,27),(1,28),(2,28),(3,28),(4,28),(1,29),(1,30),(3,30),(1,31),(1,32),(1,33),(1,34),(4,34),(5,34);
>>>>>>> origin/main-v2
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
  `descripcion` varchar(1000) DEFAULT NULL,
  `id_categoria` varchar(255) DEFAULT NULL,
  `imagen` varchar(100) DEFAULT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` enum('disponible','agotado','descontinuado') NOT NULL DEFAULT 'disponible',
  `modificado` date DEFAULT NULL,
  PRIMARY KEY (`idPlatillo`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platillo`
--

LOCK TABLES `platillo` WRITE;
/*!40000 ALTER TABLE `platillo` DISABLE KEYS */;
INSERT INTO `platillo` VALUES (1,'Brocheta Empanizada de Pollo','','1',NULL,45.00,'disponible',NULL),(2,'Brocheta Empanizada de Camarón','','1',NULL,50.00,'disponible',NULL),(3,'Brocheta Empanizada de Surimi','','1',NULL,45.00,'disponible',NULL),(4,'Brocheta de Queso con Plátano Macho','','1',NULL,50.00,'disponible',NULL),(5,'Ensalada Sunomono Especial','Ensalada a base de kanikama, pepino, zanahoria, pimiento morrón y apio en julianas, con camarón, pulpo y callo de hacha sazonada con furikake, aderezada con vinagreta sunomono especial de la casa.','2',NULL,165.00,'disponible',NULL),(6,'MK Salad (Salmón 150 g)','Filete de salmón acompañado de una mezcla de lechugas, frutos rojos, manzana y pepino con vinagreta de frutos rojos.','2',NULL,175.00,'disponible',NULL),(7,'Tazón Especial con Pollo','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: pechuga de pollo empanizada.','2',NULL,165.00,'disponible',NULL),(8,'Tazón Especial con Sirloin','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: sirloin a la parrilla.','2',NULL,185.00,'disponible',NULL),(9,'Tazón Especial con Atún','Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: atún.','2',NULL,185.00,'disponible',NULL),(10,'Aros de Calamar (120g.)','Aros de calamar empanizados, acompañados de salsa BBQ.','3',NULL,138.00,'disponible',NULL),(11,'Aros de Cebolla (120g.)','Aros de cebolla capeados, acompañados de salsa sweet-spicy.','3',NULL,75.00,'disponible',NULL),(12,'Sampler Botanero','Con boneless de pollo, queso Chihuahua, camarones y aros de calamar empanizados, acompañados de aderezo srirasha.','3',NULL,165.00,'disponible',NULL),(13,'Chile Torito','Chile caribe relleno con camarones, queso Chihuahua, Philadelphia, envuelto con tocino y empanizado con panko.','3',NULL,69.00,'disponible',NULL),(14,'Edamames','Vainas de frijol de soya sofritas en ajo y mantequilla, salteadas en una salsa picosita a base de srirasha y shichimi.','3',NULL,95.00,'disponible',NULL),(15,'Tiradito Atún (120g.)','Finas rebanadas de atún marinadas con una deliciosa salsa negra de la casa.','3',NULL,185.00,'disponible',NULL),(16,'Tiradito Salmón (120g.)','Finas rebanadas de salmón marinadas con una deliciosa salsa negra de la casa.','3',NULL,205.00,'disponible',NULL),(17,'Tiradito Mixto (200g.)','Finas rebanadas combinadas de atún y salmón marinadas con una deliciosa salsa negra de la casa.','3',NULL,269.00,'disponible',NULL),(18,'Tostadita MK','Tostada Wonton con base de pepino, camarón, atún, salmón y callo de hacha marinados en salsa aguachile negra, con un toque de cebolla x\'nipec y rebanadas de aguacate.','3',NULL,69.00,'disponible',NULL),(19,'Tostadita de Aguachile','Camarones marinados en salsa de aguachile MK, con pepino, aguacate y cebolla x\'nipec sobre una tostada Wonton.','3',NULL,69.00,'disponible',NULL),(20,'Torres de Mariscos','Camarones, atún, pulpo, callo de hacha, pepino, aguacate y cebolla x\'nipec bañados con salsa negra y un toque de clamato.','3',NULL,225.00,'disponible',NULL),(21,'Gohan','Arroz al vapor con especias, salmón y tampico, acompañado con aguacate y queso Philadelphia.','4',NULL,145.00,'disponible',NULL),(22,'Yakimeshi','Arroz frito salteado con calabaza, zanahoria y cebollín, con sirloin y tocino, acompañado con tampico, aguacate y Philadelphia.','4',NULL,125.00,'disponible',NULL),(23,'Arrokis','Arroz frito salteado con camarón, calabaza y zanahoria, acompañado con tampico, aguacate y Philadelphia.','4',NULL,139.00,'disponible',NULL),(24,'Bomba Especial','Bola de arroz rellena de res, tocino y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.','4',NULL,149.00,'disponible',NULL),(25,'Bomba Marinera','Bola de arroz rellena de camarón, pulpo, tampico y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.','4',NULL,149.00,'disponible',NULL),(26,'Teppa Udon Sirloin (150g.)','Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.','5',NULL,209.00,'disponible',NULL),(27,'Teppa Udon Camarón (120g.)','Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.','5',NULL,225.00,'disponible',NULL),(28,'Wok Teriyaki Pollo (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,195.00,'disponible',NULL),(29,'Wok Teriyaki Camarón (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,225.00,'disponible',NULL),(30,'Wok Teriyaki Sirloin (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,209.00,'disponible',NULL),(31,'Wok Teriyaki Mixto (150g.)','Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.','5',NULL,235.00,'disponible',NULL),(32,'Wok Teppanyaki Pollo (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,195.00,'disponible',NULL),(33,'Wok Teppanyaki Camarón (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,225.00,'disponible',NULL),(34,'Wok Teppanyaki Sirloin (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,209.00,'disponible',NULL),(35,'Wok Teppanyaki Mixto (150g.)','Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.','5',NULL,235.00,'disponible',NULL),(36,'Roka Ebi (160g. Camarón)','Camarones empanizados con panko sobre arroz frito, con aderezo a elección (sweet-spicy, BBQ, mango-habanero).','5',NULL,185.00,'disponible',NULL),(37,'Yakisoba Sirloin (150g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,199.00,'disponible',NULL),(38,'Yakisoba Camarón (120g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,199.00,'disponible',NULL),(39,'Yakisoba Mixto (140g.)','Pasta delgada con vegetales salteados en salsa yakisoba de la casa.','5',NULL,205.00,'disponible',NULL),(40,'Chikin MK (150g. Pollo)','Fajitas de pollo salteadas con vegetales en salsa picosita a base de sriracha, sobre arroz frito.','5',NULL,175.00,'disponible',NULL),(41,'Chikin Strips (180g. Pollo)','Crujientes tiritas de pollo empanizadas acompañadas con salsa a elección (BBQ, Mango-Habanero).','5',NULL,165.00,'disponible',NULL),(42,'Fahítas (150g.)','Fajitas de sirloin con camarones, cebolla cambray, tomate y chiles en juliana con pasta Udón.','5',NULL,185.00,'disponible',NULL),(43,'Tun (220g. Atún)','Filete de atún fajeado y sellado con costra de ajonjolí, acompañado de vegetales y arroz al vapor.','5',NULL,225.00,'disponible',NULL),(44,'OrenjiChikin (200g. Pollo)','Boneless de pollo salteados con salsa de naranja sobre una cama de arroz.','5',NULL,175.00,'disponible',NULL),(45,'Tom Yum','Sopa con mariscos (camarón, pulpo, surimi) y vegetales en un caldo ligeramente picante.','6',NULL,139.00,'disponible',NULL),(46,'Kenko','Berenjena por dentro con cubierta de zanahoria al tempura y brócoli frito por fuera con aderezo cebollín.','7',NULL,115.00,'disponible',NULL),(47,'Fruit Roll','Kiwi por dentro con cubierta de Philadelphia, mango y ajonjolí garapiñado por fuera acompañado con salsa de fresa.','7',NULL,115.00,'disponible',NULL),(48,'Bigan Roll','Verduras al tempura, queso de hojuela de papa por dentro enrollado en alga de soya.','7',NULL,149.00,'disponible',NULL),(49,'Abokado Maki','Atún por dentro con cubierta de aguacate, rayado con anguila y espolvoreado con ajonjolí negro.','7',NULL,145.00,'disponible',NULL),(50,'Glass Maki','Camarón y surimi por dentro con cama de pepino por fuera, Philadelphia y ajonjolí negro.','7',NULL,145.00,'disponible',NULL),(51,'California Roll','Camarón por dentro con cubierta de mezcla de ajonjolís.','7',NULL,125.00,'disponible',NULL),(52,'Salmoncito Roll','Piel de salmón por dentro con cubierta de salmón y topping de tampico, cebollín y salsa de anguila.','7',NULL,155.00,'disponible',NULL),(53,'Phila','Camarón empanizado por dentro con cubierta de queso Philadelphia.','7',NULL,119.00,'disponible',NULL),(54,'Tako Maki','Surimi capeado por dentro con cubierta de pulpo rayado con aderezo cebollín.','7',NULL,145.00,'disponible',NULL),(55,'MK Roll','Camarón y salmón por dentro con cubierta mitad de queso Philadelphia y mitad de aguacate.','7',NULL,169.00,'disponible',NULL),(56,'Akuma Maki','Camarón empanizado a la diabla por dentro con cubierta de tampico y camarones, rayado con salsa sweet-spicy.','7',NULL,135.00,'disponible',NULL),(57,'Aguachile Roll','Pulpo por dentro con cubierta de aguacate y camarones en salsa de aguachile negra MK.','7',NULL,175.00,'disponible',NULL),(58,'Aguachile Mango-Habanero','Surimi por dentro con cubierta de aguacate y camarones en salsa de aguachile de mango.','7',NULL,175.00,'disponible',NULL),(59,'Sake Maki','Surimi frito por dentro con cubierta de Philadelphia y salmón.','7',NULL,165.00,'disponible',NULL),(60,'Masago Roll','Base de arroz con masago, salmón por dentro con topping de tampico y camarones fritos por fuera, rayado con aderezo cebollín.','7',NULL,175.00,'disponible',NULL),(61,'Umi Maki','Camarón por dentro con cubierta de Philadelphia y tiras de surimi empanizadas encima, rayado con aderezo sriracha y salsa de anguila.','7',NULL,129.00,'disponible',NULL),(62,'Hono Maki','Surimi por dentro con cubierta horneada de sirloin, tocino, tampico, queso manchego y Philadelphia.','7',NULL,160.00,'disponible',NULL),(63,'Ebi Roll','Camarón por dentro, cubierta de queso manchego (empanizado).','8',NULL,119.00,'disponible',NULL),(64,'Mar y Tierra','Sirloin y camarón por dentro (empanizado).','8',NULL,129.00,'disponible',NULL),(65,'Roka Chicken Roll','Tiras de pollo empanizadas, tocino y queso manchego por dentro, Philadelphia por fuera (capeado).','8',NULL,135.00,'disponible',NULL),(66,'Fat Roll','Res, pollo, camarón y tocino por dentro, con Philadelphia y manchego por fuera (capeado).','8',NULL,155.00,'disponible',NULL),(67,'Don Cangrejo','Camarón por dentro con Kanikama, aderezo chipotle y camarón frito por fuera, rayado con aderezo cebollín (empanizado).','8',NULL,175.00,'disponible',NULL),(68,'Yaki Maki','Cama de arroz frito con tocino, queso manchego por dentro, con tampico y tiras de pollo empanizado por fuera, rayado con aderezo sriracha (capeado).','8',NULL,139.00,'disponible',NULL),(69,'Nomi Maki','Camarón y salmón por dentro, láminas de queso manchego por fuera con topping de Philadelphia y sriracha (empanizado).','8',NULL,175.00,'disponible',NULL),(70,'Pike Roll','Sirloin marinado, tocino frito y chile serrano por dentro, gratinado con queso manchego (empanizado).','8',NULL,138.00,'disponible',NULL),(71,'Sumo Maki','Sirloin, pollo y tocino por dentro, manchego y Philadelphia por fuera empanizado pieza por pieza.','8',NULL,145.00,'disponible',NULL),(72,'Cheese Roll','Camarón y sirloin por dentro, gratinado con queso manchego, tocino picado y chile serrano (empanizado).','8',NULL,148.00,'disponible',NULL),(73,'Tampiko Roll','Camarón y pulpo por dentro, con topping de tampico y trocitos de aguacate por fuera (empanizado).','8',NULL,145.00,'disponible',NULL),(74,'Parrillero','Camarón y tocino por dentro, con topping de tampico y tiritas de sirloin empanizadas por fuera, rayado con salsa BBQ (empanizado).','8',NULL,149.00,'disponible',NULL),(75,'Té Helado 480 ML (3 refill)',' ','9',NULL,55.00,'disponible',NULL),(76,'Refrescos (355 ML)',' ','9',NULL,42.00,'disponible',NULL),(77,'Limonada (480 ML)',' ','9',NULL,55.00,'disponible',NULL),(78,'Limonada Pepino/Limón (480 ML)',' ','9',NULL,55.00,'disponible',NULL),(79,'Naranjada (562 ML)',' ','9',NULL,55.00,'disponible',NULL),(80,'Fresada (480 ML)',' ','9',NULL,65.00,'disponible',NULL),(81,'Piñada (480 ML)',' ','9',NULL,65.00,'disponible',NULL),(82,'Conga (480 ML)',' ','9',NULL,60.00,'disponible',NULL),(83,'Clamato Mineral (480 ML)',' ','9',NULL,65.00,'disponible',NULL),(84,'Café Americano (230 ML)',' ','9',NULL,40.00,'disponible',NULL),(85,'Capuchino (240 ML)',' ','9',NULL,65.00,'disponible',NULL),(86,'Café Expreso (30 ML)',' ','9',NULL,45.00,'disponible',NULL),(87,'Helado Tempura','Helado de vainilla capeado y frito, acompañado de crema batida y chocolate líquido Hershey\'s.','9',NULL,80.00,'disponible',NULL),(88,'Camelado','Gelatina de café en cubos con helado de vainilla y rompope.','9',NULL,79.00,'disponible',NULL),(89,'Copa de Helado','Helado de vainilla con chantilly y chocolate líquido Hershey\'s.','9',NULL,65.00,'disponible',NULL),(90,'Brownie con Chocolate','Brownie con chocolate líquido Hershey\'s.','9',NULL,79.00,'disponible',NULL),(91,'Brownie con Helado','Brownie con helado de vainilla y chocolate líquido Hershey\'s.','9',NULL,89.00,'disponible',NULL),(92,'Tecate 355 ML',' ','10',NULL,45.00,'disponible',NULL),(93,'Tecate Light 355 ML',' ','10',NULL,45.00,'disponible',NULL),(94,'Indio 355 ML',' ','10',NULL,45.00,'disponible',NULL),(95,'Carta Blanca 355 ML',' ','10',NULL,45.00,'disponible',NULL),(96,'XX Larger 355 ML',' ','10',NULL,45.00,'disponible',NULL),(97,'XX Ámbar 355 ML',' ','10',NULL,45.00,'disponible',NULL),(98,'Bohemia 355 ML',' ','10',NULL,55.00,'disponible',NULL),(99,'Bohemia Obscura 355 ML',' ','10',NULL,55.00,'disponible',NULL),(100,'Miller High Life 355 ML',' ','10',NULL,55.00,'disponible',NULL),(101,'Heineken 355 ML',' ','10',NULL,55.00,'disponible',NULL),(102,'Amstel Ultra 355 ML',' ','10',NULL,55.00,'disponible',NULL),(103,'Clamato MK 540 ML',' ','10',NULL,85.00,'disponible',NULL),(104,'Piña Colada 480 ML',' ','10',NULL,75.00,'disponible',NULL),(105,'Gin Tonic 480 ML',' ','10',NULL,65.00,'disponible',NULL),(106,'Gin de Frutos Rojos 480 ML',' ','10',NULL,65.00,'disponible',NULL),(107,'Mojito 360 ML',' ','10',NULL,65.00,'disponible',NULL),(108,'Mojito de Frutos Rojos 360 ML',' ','10',NULL,65.00,'disponible',NULL),(109,'Margarita MK 330 ML',' ','10',NULL,69.00,'disponible',NULL),(110,'Margarita 330 ML',' ','10',NULL,65.00,'disponible',NULL),(111,'Margarita de Mango 330 ML',' ','10',NULL,65.00,'disponible',NULL),(112,'Margarita de Fresa 330 ML',' ','10',NULL,65.00,'disponible',NULL),(113,'Sangría 480 ML',' ','10',NULL,65.00,'disponible',NULL),(114,'Clericot MK 480 ML',' ','10',NULL,69.00,'disponible',NULL),(115,'Carajillo 360 ML',' ','10',NULL,95.00,'disponible',NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb3;
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
  `Orden_idOrden` int NOT NULL,
  `Platillo_idPlatillo` int NOT NULL,
  `cantidad` int NOT NULL,
  `estado` enum('pendiente','entregado','preparacion','cancelado') NOT NULL DEFAULT 'pendiente',
  `precioUnitario` decimal(10,2) NOT NULL,
  PRIMARY KEY (`Orden_idOrden`,`Platillo_idPlatillo`),
  KEY `fk_Platillo_Orden_Orden1_idx` (`Orden_idOrden`),
  KEY `fk_Platillo_Orden_Platillo1_idx` (`Platillo_idPlatillo`),
  CONSTRAINT `fk_Platillo_Orden_Orden1` FOREIGN KEY (`Orden_idOrden`) REFERENCES `orden` (`idOrden`) ON DELETE CASCADE,
  CONSTRAINT `fk_Platillo_Orden_Platillo1` FOREIGN KEY (`Platillo_idPlatillo`) REFERENCES `platillo` (`idPlatillo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
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
) ENGINE=InnoDB AUTO_INCREMENT=14008 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1001,'CAMARÓN 51/50','vigente',9,2),(1002,'PULPO COCIDO','vigente',9,2),(1003,'CALLO DE HACHA MEDIA LUNA','vigente',9,2),(1004,'AROS DE CALAMAR','vigente',9,2),(1005,'SALMÓN AHUMADO','vigente',9,2),(1006,'SURIMI AQUAMAR','vigente',9,2),(1007,'STEAK DE ATÚN NACIONAL','vigente',9,2),(1008,'EDAMAMES CON VAINA','vigente',2,2),(1009,'CAMARÓN 26-30','vigente',9,2),(1010,'MASAGO HUEVA DE PEZ','vigente',4,1),(1011,'SALMÓN','vigente',9,2),(2001,'BROCOLÍ','vigente',7,2),(2022,'AJO','vigente',7,2),(2023,'MANGO PETACÓN','vigente',7,2),(2024,'CHILE SERRANO','vigente',7,2),(2025,'CEBOLLA MORADA','vigente',7,2),(2026,'CHILE MORRÓN','vigente',7,2),(2027,'COL MORADA','vigente',7,3),(2028,'APIO','vigente',7,3),(2029,'FRESA','vigente',7,2),(2030,'JITOMATE','vigente',7,2),(2031,'MANZANA','vigente',7,2),(2032,'CHILE POBLANO','vigente',7,2),(2033,'PIÑA MIEL','vigente',7,2),(2034,'HIERBABUENA','vigente',7,3),(2035,'CILANTRO','vigente',7,3),(2037,'JUGO DE NARANJA','vigente',7,1),(3001,'SIRLON','vigente',4,2),(3002,'TOCINO AHUMADO DE CERDO','vigente',4,2),(3003,'PECHUGA DE POLLO MEDIA MARIPOSA','vigente',10,2),(3004,'COCHINITA','vigente',4,2),(3005,'JUGO PARA CARNE','vigente',1,3),(3006,'BISTEK DE RES','vigente',4,2),(5001,'QUESO PHILADELPHIA','vigente',8,2),(5002,'QUESO CHIHUAHUA CHILCHOTA','vigente',8,2),(5003,'QUESO VEGANO','vigente',8,2),(5004,'QUESO MANCHEGO (GOUDA ALEMAN)','vigente',8,2),(5005,'MARGARINA','vigente',8,2),(6001,'COLIFLOR','vigente',7,2),(6002,'AGUACATE','vigente',7,2),(6003,'PEPINO','vigente',7,2),(6004,'CALABAZA','vigente',7,2),(6005,'CEBOLLA CAMBRAY','vigente',7,2),(6006,'CHAMPIÑÓN','vigente',7,2),(6007,'ZANAHORIA','vigente',7,2),(6008,'LIMÓN','vigente',7,2),(6009,'BERENJENA','vigente',7,2),(6010,'JENGIBRE','vigente',7,2),(6011,'LIMÓN S/S','vigente',7,2),(6012,'KIWI','vigente',7,2),(6013,'NARANJA','vigente',7,2),(6014,'CHILE UNGARO','vigente',7,2),(6015,'CEBOLLA','vigente',7,2),(6016,'PLATANO MACHO','vigente',7,2),(6017,'LECHUGA ITALIANA','vigente',7,3),(6018,'LECHUGA SANGRÍA','vigente',7,3),(6019,'CHILE JALAPEÑO','vigente',7,2),(6020,'CHILE HABANERO','vigente',7,2),(6021,'SALSA SRIRACHA','vigente',2,1),(6022,'ARROZ KOKUHO','vigente',2,2),(6023,'TEMPURA','vigente',2,2),(6024,'RAMEN','vigente',2,2),(6025,'WONTON','vigente',2,2),(6026,'ALGA NORI','vigente',2,3),(6027,'HUEVA DE PESCADO','vigente',2,2),(6028,'PASTA PARA TOM YUM','vigente',2,2),(6029,'FURIKAKE','vigente',2,2),(6030,'SALSA DE ANGUILA','vigente',2,1),(6031,'PANKO','vigente',2,2),(6032,'SALSA DE SOYA NATURAL','vigente',2,1),(6033,'VINAGRE BLANCO','vigente',1,1),(6034,'LECHE CARNATION','vigente',1,1),(6035,'FRESA CONGELADA','vigente',1,2),(6036,'CHILE CHIPOTLE','vigente',1,2),(6037,'HUEVO','vigente',1,3),(6038,'JUGO LIMÓN CONGELADO','vigente',1,1),(6039,'JUGO MAGGI','vigente',1,1),(6040,'JUPO PIÑA','vigente',1,1),(6041,'KANIKAMA','vigente',2,2),(6042,'JARABE NATURAL','vigente',1,1),(6043,'EDAMAMES','vigente',2,2),(6044,'SALSA INGLESA','vigente',1,1),(6045,'ADEREZO DE MAYONEZA','vigente',1,1),(6046,'PIMIENTA LIMÓN','vigente',1,2),(6047,'SALSA BBQ','vigente',1,1),(6048,'ALGA DE SOYA','vigente',2,3),(6049,'SALSA MANGO HABANERO','vigente',1,2),(6050,'GOMITAS','vigente',1,2),(6052,'PASTA NOODLE HOUSE FIDEO DELGADO','vigente',2,2),(6053,'OHASHI','vigente',2,3),(6054,'CALPI SUI','vigente',2,3),(6055,'AZUCAR','vigente',1,2),(6056,'TE HELADO KLAS','vigente',1,2),(6057,'ACEITE FREIDORA','vigente',1,1),(6058,'PASTA UDON','vigente',2,2),(6059,'JARABE DE MORAS','vigente',1,1),(6060,'CREMA DE COCO','vigente',1,1),(6061,'JARABE DE GRANADINA','vigente',1,1),(6062,'JUGO DE TORONJA','vigente',1,1),(6063,'SAL','vigente',1,2),(6064,'CREMA CHANTILLY','vigente',1,2),(6065,'VINO TINTO','vigente',1,1),(6066,'VINO BLANCO','vigente',1,1),(6067,'JUGO NARANJA','vigente',1,1),(6068,'JUGO NARANJA NATURAL','vigente',1,1),(6069,'PAN BOLLO','vigente',1,3),(6070,'ELOTE EN GRANO','vigente',1,2),(6071,'KIKOMAN SALSA DE SOYA BOTE 18.9 LT','vigente',2,1),(6072,'CAFE NESCAFE','vigente',1,2),(6073,'EDAMAMES SIN VAINA','vigente',2,2),(6074,'RICO POLLO','vigente',1,2),(6075,'GRENETINA','vigente',1,2),(6076,'AJONJOLÍ','vigente',1,2),(6077,'AJONJOLÍ NEGRO','vigente',1,2),(6078,'HARINA','vigente',1,2),(6079,'CATSUP','vigente',1,2),(6080,'SHICHIMI','vigente',2,2),(6081,'PASTA RAMEN','vigente',2,2),(6082,'CHOCOLATE LIQUIDO HERSHEY\'S','vigente',1,1),(6083,'AGUA GARRAFON','vigente',1,1),(6084,'CHILE TAJÍN','vigente',1,2),(6085,'KERMATO','vigente',1,1),(6086,'VINO TINTO CUATRO SOLES','vigente',1,1),(6087,'JARABE CONCENTRADO DE TAMARINDO','vigente',1,1),(6088,'CHAMOY','vigente',1,1),(6089,'CONCENTRADO DE MANGO','vigente',1,1),(6090,'CEREZAS','vigente',1,2),(6091,'SALSA DE OSTIÓN','vigente',2,2),(6092,'CLAMATO','vigente',1,1),(6093,'ADEREZO CEBOLLÍN','vigente',3,1),(6094,'ADEREZO CHIPOTLE','vigente',3,1),(6095,'ADEREZO SRIRACHA','vigente',3,1),(6096,'PONZU','vigente',13,1),(6097,'TAMPIKO','vigente',3,2),(6098,'SALSA AGUACHILE MAGO HABANERO','vigente',13,3),(6099,'SALSA DE XNIPEC','vigente',13,3),(6100,'PIMIENTA NEGRA','vigente',1,2),(6101,'OREGANO','vigente',1,2),(6102,'AZUCAR GLASS','vigente',1,2),(6103,'JUGO DE LIMÓN','vigente',7,1),(6104,'ENDULZANTE SPLENDIDA SOBRE 1 GRS','vigente',1,3),(6105,'SWEET SPICY','vigente',1,1),(6106,'CAFE MOLIDO TOSTADO','vigente',1,2),(6107,'VINAGRE DE ARROZ','vigente',1,1),(7001,'COCA','vigente',12,3),(7002,'AGUA MINERAL PEÑAFIEL 2 LT','vigente',12,3),(7003,'CIEL MINERAL','vigente',12,3),(7004,'AGUA CIEL 600 ML','vigente',12,3),(7005,'COCA SIN AZUCAR','vigente',12,3),(7006,'SIDRAL','vigente',12,3),(7007,'COCA LIGHT','vigente',12,3),(7008,'FRESCA','vigente',12,3),(7009,'SPRITE','vigente',12,3),(7010,'AGUA QUINA SCHWEPPPERS','vigente',12,3),(7011,'AGUA QUINA PEÑAFIEL','vigente',12,3),(7012,'SIDRAL PET','vigente',12,3),(7013,'AGUA QUINA','vigente',12,1),(8001,'SALSA DE AGUACHILE','vigente',13,3),(8003,'SALSA YAKISOBA','vigente',13,3),(8004,'VINAGRETA SUNOMONO','vigente',13,3),(8007,'CHILES TOREADOS','vigente',13,2),(8008,'SALSA DE FRESA','vigente',13,1),(9001,'HELADO VAINILLA','vigente',6,2),(9002,'FRUTOS ROJOS','vigente',6,2),(9003,'MANGO','vigente',1,3),(9004,'ENSALADA ITALIANA','vigente',6,2),(10001,'BROWNIE','vigente',11,3),(11001,'LICOR 43 750 ML','vigente',14,1),(11002,'BACARDI BLANCO 700 ML','vigente',14,1),(11003,'CONTROY 1 LT','vigente',14,1),(11004,'TEQUILA DESTILADO 1.5 LT','vigente',14,1),(11005,'GINEBRA OSO NEGRO 1 LT','vigente',14,1),(11006,'CARLO ROSI TINTO GARRAFA 4 LT','vigente',14,1),(11007,'GINEBRA LONDON DRY','vigente',14,1),(11008,'ROMPOPE LA HOLANDESA','vigente',14,1),(11009,'BACARDI BLANCO 1.750 LT','vigente',14,1),(11010,'VINO TINTO DON SIMÓN 5 LT','vigente',14,1),(11011,'TEQUILA CAZADORES','vigente',14,1),(12001,'BOHEMIA OBSCURA','vigente',5,3),(12002,'BOHEMIA CLARA','vigente',5,3),(12003,'HEINEKEN','vigente',5,3),(12004,'XX AMBAR','vigente',5,3),(12005,'XX LAGUER','vigente',5,3),(12006,'INDIO','vigente',5,3),(12007,'AMSTEL ULTRA','vigente',5,3),(12008,'CARTA BLANCA','vigente',5,3),(12009,'TECATE LIGHT','vigente',5,3),(12010,'TECATE','vigente',5,3),(12011,'HIGH LIFE','vigente',5,3),(14005,'VINAGRE MK','vigente',3,1),(14006,'Surimi','vigente',9,3),(14007,'Valentina','descontinuado',13,1);
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
INSERT INTO `producto_platillo` VALUES (94,3003,2,0),(94,6031,2,0),(94,6047,1,0),(95,1009,2,0),(95,6031,2,0),(95,6047,1,0),(96,1006,2,0),(96,6031,2,0),(96,6047,1,0),(97,5001,2,0),(97,6016,2,0),(97,6047,1,0),(98,6003,2,0),(98,6041,2,0),(98,8004,1,0),(99,1011,2,0),(99,6017,2,0),(99,9002,2,0),(100,2026,2,0),(100,3003,2,0),(100,6097,1,0),(101,2030,2,0),(101,3001,2,0),(101,6097,1,0),(102,1007,2,0),(102,2030,2,0),(102,6097,1,0),(103,1004,2,0),(103,6031,2,0),(103,6047,1,0),(104,6015,2,0),(104,6031,2,0),(104,6105,1,0),(105,1009,2,0),(105,3003,2,0),(105,5002,2,0),(106,2024,2,0),(106,3002,2,0),(106,5002,2,0),(107,2022,2,0),(107,6043,2,0),(107,6095,1,0),(108,1007,2,0),(108,1011,2,0),(108,6021,1,0),(109,1001,2,0),(109,6001,2,0),(109,8001,1,0),(110,1009,2,0),(110,6003,2,0),(110,6099,1,0),(111,1002,2,0),(111,1009,2,0),(111,6092,1,0),(114,1011,2,0),(114,5001,2,0),(114,6022,2,0),(115,3001,2,0),(115,3002,2,0),(115,6022,2,0),(116,1009,2,0),(116,5001,2,0),(116,6022,2,0),(117,3004,2,0),(117,5004,2,0),(117,6022,2,0),(118,1009,2,0),(118,5001,2,0),(118,6022,2,0),(119,6015,2,0),(119,6058,2,0),(119,6095,1,0),(120,3003,2,0),(120,6022,2,0),(120,6091,1,0),(121,3001,2,0),(121,6022,2,0),(121,6091,1,0),(122,1009,2,0),(122,6022,2,0),(122,6091,1,0),(123,3001,2,0),(123,6021,1,0),(123,6022,2,0),(124,1009,2,0),(124,6031,2,0),(124,6095,1,0),(125,5004,2,0),(125,6021,1,0),(125,6058,2,0),(126,3003,2,0),(126,6021,1,0),(126,6022,2,0),(127,3003,2,0),(127,6031,2,0),(127,6047,1,0),(128,1009,2,0),(128,3001,2,0),(128,6058,2,0),(129,1007,2,0),(129,6022,2,0),(129,6076,2,0),(130,3003,2,0),(130,6022,2,0),(130,6089,1,0),(138,1002,2,0),(138,1009,2,0),(138,6028,1,0),(139,6005,2,0),(139,6009,2,0),(139,6093,1,0),(140,5001,2,0),(140,6012,2,0),(140,8008,1,0),(141,5004,2,0),(141,6004,2,0),(141,6048,2,0),(142,1007,2,0),(142,6002,2,0),(142,6030,1,0),(168,10001,3,1),(169,7004,3,1),(170,7001,3,1),(171,7005,3,1),(172,7009,3,1),(173,7006,3,1),(174,7002,3,1),(175,7013,3,1),(176,6056,3,1),(177,6092,3,1),(178,6089,3,1),(179,6038,3,1),(180,6067,3,1),(181,6040,3,1),(182,5001,3,1),(183,9001,3,1),(184,6082,3,1),(185,12010,3,1),(186,12009,3,1),(187,12006,3,1),(188,12008,3,1),(189,12005,3,1),(190,12004,3,1),(191,12002,3,1),(192,12001,3,1),(193,12011,3,1),(194,12003,3,1),(195,12007,3,1),(196,6092,3,1),(197,6060,3,1),(198,11007,3,1),(199,9002,3,1),(200,11004,3,1),(201,11004,3,1),(202,11004,3,1),(203,11004,3,1),(204,11010,3,1),(205,11006,3,1),(206,11001,3,1),(207,11002,3,1),(208,11009,3,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `proveedor` VALUES (2,'ProveedorUno','1234567898','Su casa','correo@gmail.com','activo'),(3,'ProveedorDos','9876543210','Por allá','correo2@gmail.com','activo');
=======
INSERT INTO `proveedor` VALUES (2,'ProveedorUno','1234567898','Su casa','correo@gmail.com','inactivo'),(3,'ProveedorDos','9876543210','Por allá','correo2@gmail.com','activo');
>>>>>>> origin/main-v2
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
<<<<<<< HEAD
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
=======
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb3;
>>>>>>> origin/main-v2
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registroacceso`
--

LOCK TABLES `registroacceso` WRITE;
/*!40000 ALTER TABLE `registroacceso` DISABLE KEYS */;
<<<<<<< HEAD
=======
INSERT INTO `registroacceso` VALUES (1,'2025-11-05 18:39:14','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(2,'2025-11-05 18:39:30','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(3,'2025-11-05 18:43:04','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(4,'2025-11-05 18:43:04','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(5,'2025-11-05 18:43:05','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(6,'2025-11-05 18:43:25','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(7,'2025-11-05 18:43:25','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(8,'2025-11-05 18:43:26','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(9,'2025-11-05 18:47:40','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(10,'2025-11-05 19:01:25','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(11,'2025-11-05 19:01:49','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(12,'2025-11-05 19:03:56','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(13,'2025-11-05 19:04:26','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(14,'2025-11-05 19:05:43','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(15,'2025-11-05 19:08:44','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(16,'2025-11-05 19:08:45','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(17,'2025-11-05 19:10:46','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(18,'2025-11-05 19:10:47','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(19,'2025-11-05 19:10:47','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(20,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(21,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(22,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(23,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(24,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(25,'2025-11-05 19:10:48','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(26,'2025-11-05 19:10:49','::ffff:127.0.0.1','/api/platillos','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(27,'2025-11-05 19:11:05','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(28,'2025-11-05 19:11:11','::ffff:127.0.0.1','/api/auth/me','GET',NULL,NULL,NULL,'Token faltante','No se encontró token en cookies ni en Authorization'),(29,'2025-11-05 19:19:17','::ffff:127.0.0.1','/api/auth/login','POST','gerente',4,NULL,'Login fallido','Contraseña incorrecta'),(30,'2025-11-05 19:19:22','::ffff:127.0.0.1','/api/usuarios','GET','gerente',4,'ver_usuarios','Permiso insuficiente','Rol 1 no tiene permiso ver_usuarios'),(31,'2025-11-05 19:19:34','::ffff:127.0.0.1','/api/usuarios','GET','gerente',4,'ver_usuarios','Permiso insuficiente','Rol 1 no tiene permiso ver_usuarios'),(32,'2025-11-05 20:07:17','::ffff:127.0.0.1','/api/productos','GET','gerente',4,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(33,'2025-11-05 20:07:51','::ffff:127.0.0.1','/api/productos','GET','gerente',4,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(34,'2025-11-05 20:09:12','::ffff:127.0.0.1','/api/productos','GET','gerente',4,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(35,'2025-11-05 20:09:29','::ffff:127.0.0.1','/api/productos','GET','gerente',4,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(36,'2025-11-05 20:09:29','::ffff:127.0.0.1','/api/usuarios','GET','gerente',4,'ver_usuarios','Permiso insuficiente','Rol 1 no tiene permiso ver_usuarios'),(37,'2025-11-05 20:09:43','::ffff:127.0.0.1','/api/productos','GET','gerente',4,'ver_productos','Permiso insuficiente','Rol 1 no tiene permiso ver_productos'),(38,'2025-11-05 20:09:43','::ffff:127.0.0.1','/api/usuarios','GET','gerente',4,'ver_usuarios','Permiso insuficiente','Rol 1 no tiene permiso ver_usuarios');
>>>>>>> origin/main-v2
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
<<<<<<< HEAD
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
=======
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
>>>>>>> origin/main-v2
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
<<<<<<< HEAD
INSERT INTO `rol` VALUES (1,'Gerente',NULL),(3,'Chef',NULL),(4,'Mesero',NULL);
=======
INSERT INTO `rol` VALUES (1,'Gerente',NULL),(2,'Encargado_de_Inventario',NULL),(3,'Chef',NULL),(4,'Mesero',NULL),(5,'Cliente',NULL);
>>>>>>> origin/main-v2
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
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Arturo','Arturo','$2b$10$5QoJ//xsxcYzqBktSBh5WObkIn7Hndy9uqIDEi5.U51i95Z66px56','activo',4),(2,'user01','user01','$2b$10$Zv6ySPPAJ0YkOeizu5x1q.sO6/LhvarPgA1ReGRY//4dwKDVZSzVa','activo',4),(3,'user2','user2','$2b$10$LXCvKMuMQYGYY9Fd50NPBuxYr8bQyYD8fofWBIZCYl/zwNOEJ1GBO','activo',3),(4,'gerente','gerente','$2b$10$84fF.2QJMqcHVwv.FM1kf.lKfYbtM0ad9Cc586pTaz33eGQV3f43C','activo',1);
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

<<<<<<< HEAD
-- Dump completed on 2025-11-05 18:28:49
=======
-- Dump completed on 2025-11-05 20:25:40
>>>>>>> origin/main-v2

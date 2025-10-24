use makibase;

ALTER TABLE Platillo
modify COLUMN nombre varchar(255),
modify column descripcion varchar(1000),
modify AUTO_INCREMENT = 1;

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Brocheta Empanizada de Pollo", "", 45.00, "disponible"),
("Brocheta Empanizada de Camarón", "", 50.00, "disponible"),
("Brocheta Empanizada de Surimi", "", 45.00, "disponible"),
("Brocheta de Queso con Plátano Macho", "", 50.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Ensalada Sunomono Especial", "Ensalada a base de kanikama, pepino, zanahoria, pimiento morrón y apio en julianas, con camarón, pulpo y callo de hacha sazonada con furikake, aderezada con vinagreta sunomono especial de la casa.", 165.00, "disponible"),
("MK Salad (Salmón 150 g)", "Filete de salmón acompañado de una mezcla de lechugas, frutos rojos, manzana y pepino con vinagreta de frutos rojos.", 175.00, "disponible"),
("Tazón Especial con Pollo", "Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: pechuga de pollo empanizada.", 165.00, "disponible"),
("Tazón Especial con Sirloin", "Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: sirloin a la parrilla.", 185.00, "disponible"),
("Tazón Especial con Atún", "Arroz al vapor con mezcla de lechugas, pimiento morrón, apio, zanahoria, pepino, champiñones, edamames y elote en grano con aderezo cebollín MK. Proteína: atún.", 185.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Aros de Calamar (120g.)", "Aros de calamar empanizados, acompañados de salsa BBQ.", 138.00, "disponible"),
("Aros de Cebolla (120g.)", "Aros de cebolla capeados, acompañados de salsa sweet-spicy.", 75.00, "disponible"),
("Sampler Botanero", "Con boneless de pollo, queso Chihuahua, camarones y aros de calamar empanizados, acompañados de aderezo srirasha.", 165.00, "disponible"),
("Chile Torito", "Chile caribe relleno con camarones, queso Chihuahua, Philadelphia, envuelto con tocino y empanizado con panko.", 69.00, "disponible"),
("Edamames", "Vainas de frijol de soya sofritas en ajo y mantequilla, salteadas en una salsa picosita a base de srirasha y shichimi.", 95.00, "disponible"),
("Tiradito Atún (120g.)", "Finas rebanadas de atún marinadas con una deliciosa salsa negra de la casa.", 185.00, "disponible"),
("Tiradito Salmón (120g.)", "Finas rebanadas de salmón marinadas con una deliciosa salsa negra de la casa.", 205.00, "disponible"),
("Tiradito Mixto (200g.)", "Finas rebanadas combinadas de atún y salmón marinadas con una deliciosa salsa negra de la casa.", 269.00, "disponible"),
("Tostadita MK", "Tostada Wonton con base de pepino, camarón, atún, salmón y callo de hacha marinados en salsa aguachile negra, con un toque de cebolla x'nipec y rebanadas de aguacate.", 69.00, "disponible"),
("Tostadita de Aguachile", "Camarones marinados en salsa de aguachile MK, con pepino, aguacate y cebolla x'nipec sobre una tostada Wonton.", 69.00, "disponible"),
("Torres de Mariscos", "Camarones, atún, pulpo, callo de hacha, pepino, aguacate y cebolla x'nipec bañados con salsa negra y un toque de clamato.", 225.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Gohan", "Arroz al vapor con especias, salmón y tampico, acompañado con aguacate y queso Philadelphia.", 145.00, "disponible"),
("Yakimeshi", "Arroz frito salteado con calabaza, zanahoria y cebollín, con sirloin y tocino, acompañado con tampico, aguacate y Philadelphia.", 125.00, "disponible"),
("Arrokis", "Arroz frito salteado con camarón, calabaza y zanahoria, acompañado con tampico, aguacate y Philadelphia.", 139.00, "disponible"),
("Bomba Especial", "Bola de arroz rellena de res, tocino y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.", 149.00, "disponible"),
("Bomba Marinera", "Bola de arroz rellena de camarón, pulpo, tampico y mezcla de quesos, acompañada de aguacate y queso Philadelphia, empanizada.", 149.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Teppa Udon Sirloin (150g.)", "Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.", 209.00, "disponible"),
("Teppa Udon Camarón (120g.)", "Pasta Udon con vegetales salteados en wok con salsa picosita a base de sriracha.", 225.00, "disponible"),
("Wok Teriyaki Pollo (150g.)", "Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.", 195.00, "disponible"),
("Wok Teriyaki Camarón (150g.)", "Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.", 225.00, "disponible"),
("Wok Teriyaki Sirloin (150g.)", "Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.", 209.00, "disponible"),
("Wok Teriyaki Mixto (150g.)", "Platillo en wok con toque dulce, vegetales salteados en salsa teriyaki y especias sobre arroz frito.", 235.00, "disponible"),
("Wok Teppanyaki Pollo (150g.)", "Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.", 195.00, "disponible"),
("Wok Teppanyaki Camarón (150g.)", "Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.", 225.00, "disponible"),
("Wok Teppanyaki Sirloin (150g.)", "Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.", 209.00, "disponible"),
("Wok Teppanyaki Mixto (150g.)", "Platillo en wok con vegetales salteados en salsas oscuras, vino tinto y especias sobre arroz frito.", 235.00, "disponible"),
("Roka Ebi (160g. Camarón)", "Camarones empanizados con panko sobre arroz frito, con aderezo a elección (sweet-spicy, BBQ, mango-habanero).", 185.00, "disponible"),
("Yakisoba Sirloin (150g.)", "Pasta delgada con vegetales salteados en salsa yakisoba de la casa.", 199.00, "disponible"),
("Yakisoba Camarón (120g.)", "Pasta delgada con vegetales salteados en salsa yakisoba de la casa.", 199.00, "disponible"),
("Yakisoba Mixto (140g.)", "Pasta delgada con vegetales salteados en salsa yakisoba de la casa.", 205.00, "disponible"),
("Chikin MK (150g. Pollo)", "Fajitas de pollo salteadas con vegetales en salsa picosita a base de sriracha, sobre arroz frito.", 175.00, "disponible"),
("Chikin Strips (180g. Pollo)", "Crujientes tiritas de pollo empanizadas acompañadas con salsa a elección (BBQ, Mango-Habanero).", 165.00, "disponible"),
("Fahítas (150g.)", "Fajitas de sirloin con camarones, cebolla cambray, tomate y chiles en juliana con pasta Udón.", 185.00, "disponible"),
("Tun (220g. Atún)", "Filete de atún fajeado y sellado con costra de ajonjolí, acompañado de vegetales y arroz al vapor.", 225.00, "disponible"),
("OrenjiChikin (200g. Pollo)", "Boneless de pollo salteados con salsa de naranja sobre una cama de arroz.", 175.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Tom Yum", "Sopa con mariscos (camarón, pulpo, surimi) y vegetales en un caldo ligeramente picante.", 139.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Kenko", "Berenjena por dentro con cubierta de zanahoria al tempura y brócoli frito por fuera con aderezo cebollín.", 115.00, "disponible"),
("Fruit Roll", "Kiwi por dentro con cubierta de Philadelphia, mango y ajonjolí garapiñado por fuera acompañado con salsa de fresa.", 115.00, "disponible"),
("Bigan Roll", "Verduras al tempura, queso de hojuela de papa por dentro enrollado en alga de soya.", 149.00, "disponible"),
("Abokado Maki", "Atún por dentro con cubierta de aguacate, rayado con anguila y espolvoreado con ajonjolí negro.", 145.00, "disponible"),
("Glass Maki", "Camarón y surimi por dentro con cama de pepino por fuera, Philadelphia y ajonjolí negro.", 145.00, "disponible"),
("California Roll", "Camarón por dentro con cubierta de mezcla de ajonjolís.", 125.00, "disponible"),
("Salmoncito Roll", "Piel de salmón por dentro con cubierta de salmón y topping de tampico, cebollín y salsa de anguila.", 155.00, "disponible"),
("Phila", "Camarón empanizado por dentro con cubierta de queso Philadelphia.", 119.00, "disponible"),
("Tako Maki", "Surimi capeado por dentro con cubierta de pulpo rayado con aderezo cebollín.", 145.00, "disponible"),
("MK Roll", "Camarón y salmón por dentro con cubierta mitad de queso Philadelphia y mitad de aguacate.", 169.00, "disponible"),
("Akuma Maki", "Camarón empanizado a la diabla por dentro con cubierta de tampico y camarones, rayado con salsa sweet-spicy.", 135.00, "disponible"),
("Aguachile Roll", "Pulpo por dentro con cubierta de aguacate y camarones en salsa de aguachile negra MK.", 175.00, "disponible"),
("Aguachile Mango-Habanero", "Surimi por dentro con cubierta de aguacate y camarones en salsa de aguachile de mango.", 175.00, "disponible"),
("Sake Maki", "Surimi frito por dentro con cubierta de Philadelphia y salmón.", 165.00, "disponible"),
("Masago Roll", "Base de arroz con masago, salmón por dentro con topping de tampico y camarones fritos por fuera, rayado con aderezo cebollín.", 175.00, "disponible"),
("Umi Maki", "Camarón por dentro con cubierta de Philadelphia y tiras de surimi empanizadas encima, rayado con aderezo sriracha y salsa de anguila.", 129.00, "disponible"),
("Hono Maki", "Surimi por dentro con cubierta horneada de sirloin, tocino, tampico, queso manchego y Philadelphia.", 160.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Ebi Roll", "Camarón por dentro, cubierta de queso manchego (empanizado).", 119.00, "disponible"),
("Mar y Tierra", "Sirloin y camarón por dentro (empanizado).", 129.00, "disponible"),
("Roka Chicken Roll", "Tiras de pollo empanizadas, tocino y queso manchego por dentro, Philadelphia por fuera (capeado).", 135.00, "disponible"),
("Fat Roll", "Res, pollo, camarón y tocino por dentro, con Philadelphia y manchego por fuera (capeado).", 155.00, "disponible"),
("Don Cangrejo", "Camarón por dentro con Kanikama, aderezo chipotle y camarón frito por fuera, rayado con aderezo cebollín (empanizado).", 175.00, "disponible"),
("Yaki Maki", "Cama de arroz frito con tocino, queso manchego por dentro, con tampico y tiras de pollo empanizado por fuera, rayado con aderezo sriracha (capeado).", 139.00, "disponible"),
("Nomi Maki", "Camarón y salmón por dentro, láminas de queso manchego por fuera con topping de Philadelphia y sriracha (empanizado).", 175.00, "disponible"),
("Pike Roll", "Sirloin marinado, tocino frito y chile serrano por dentro, gratinado con queso manchego (empanizado).", 138.00, "disponible"),
("Sumo Maki", "Sirloin, pollo y tocino por dentro, manchego y Philadelphia por fuera empanizado pieza por pieza.", 145.00, "disponible"),
("Cheese Roll", "Camarón y sirloin por dentro, gratinado con queso manchego, tocino picado y chile serrano (empanizado).", 148.00, "disponible"),
("Tampiko Roll", "Camarón y pulpo por dentro, con topping de tampico y trocitos de aguacate por fuera (empanizado).", 145.00, "disponible"),
("Parrillero", "Camarón y tocino por dentro, con topping de tampico y tiritas de sirloin empanizadas por fuera, rayado con salsa BBQ (empanizado).", 149.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Té Helado 480 ML (3 refill)", " ", 55.00, "disponible"),
("Refrescos (355 ML)", " ", 42.00, "disponible"),
("Limonada (480 ML)", " ", 55.00, "disponible"),
("Limonada Pepino/Limón (480 ML)", " ", 55.00, "disponible"),
("Naranjada (562 ML)", " ", 55.00, "disponible"),
("Fresada (480 ML)", " ", 65.00, "disponible"),
("Piñada (480 ML)", " ", 65.00, "disponible"),
("Conga (480 ML)", " ", 60.00, "disponible"),
("Clamato Mineral (480 ML)", " ", 65.00, "disponible"),
("Café Americano (230 ML)", " ", 40.00, "disponible"),
("Capuchino (240 ML)", " ", 65.00, "disponible"),
("Café Expreso (30 ML)", " ", 45.00, "disponible"),
("Helado Tempura", "Helado de vainilla capeado y frito, acompañado de crema batida y chocolate líquido Hershey's.", 80.00, "disponible"),
("Camelado", "Gelatina de café en cubos con helado de vainilla y rompope.", 79.00, "disponible"),
("Copa de Helado", "Helado de vainilla con chantilly y chocolate líquido Hershey's.", 65.00, "disponible"),
("Brownie con Chocolate", "Brownie con chocolate líquido Hershey's.", 79.00, "disponible"),
("Brownie con Helado", "Brownie con helado de vainilla y chocolate líquido Hershey's.", 89.00, "disponible");

INSERT INTO Platillo (nombre, descripcion, precio, estado) VALUES
("Tecate 355 ML", " ", 45.00, "disponible"),
("Tecate Light 355 ML", " ", 45.00, "disponible"),
("Indio 355 ML", " ", 45.00, "disponible"),
("Carta Blanca 355 ML", " ", 45.00, "disponible"),
("XX Larger 355 ML", " ", 45.00, "disponible"),
("XX Ámbar 355 ML", " ", 45.00, "disponible"),
("Bohemia 355 ML", " ", 55.00, "disponible"),
("Bohemia Obscura 355 ML", " ", 55.00, "disponible"),
("Miller High Life 355 ML", " ", 55.00, "disponible"),
("Heineken 355 ML", " ", 55.00, "disponible"),
("Amstel Ultra 355 ML", " ", 55.00, "disponible"),
("Clamato MK 540 ML", " ", 85.00, "disponible"),
("Piña Colada 480 ML", " ", 75.00, "disponible"),
("Gin Tonic 480 ML", " ", 65.00, "disponible"),
("Gin de Frutos Rojos 480 ML", " ", 65.00, "disponible"),
("Mojito 360 ML", " ", 65.00, "disponible"),
("Mojito de Frutos Rojos 360 ML", " ", 65.00, "disponible"),
("Margarita MK 330 ML", " ", 69.00, "disponible"),
("Margarita 330 ML", " ", 65.00, "disponible"),
("Margarita de Mango 330 ML", " ", 65.00, "disponible"),
("Margarita de Fresa 330 ML", " ", 65.00, "disponible"),
("Sangría 480 ML", " ", 65.00, "disponible"),
("Clericot MK 480 ML", " ", 69.00, "disponible"),
("Carajillo 360 ML", " ", 95.00, "disponible");

UPDATE `makibase`.`platillo` SET `categoria` = 'Brochetas' WHERE (`idPlatillo` = '1');
UPDATE `makibase`.`platillo` SET `categoria` = 'Brochetas' WHERE (`idPlatillo` = '2');
UPDATE `makibase`.`platillo` SET `categoria` = 'Brochetas' WHERE (`idPlatillo` = '3');
UPDATE `makibase`.`platillo` SET `categoria` = 'Brochetas' WHERE (`idPlatillo` = '4');
UPDATE `makibase`.`platillo` SET `categoria` = 'Ensaladas' WHERE (`idPlatillo` = '5');
UPDATE `makibase`.`platillo` SET `categoria` = 'Ensaladas' WHERE (`idPlatillo` = '6');
UPDATE `makibase`.`platillo` SET `categoria` = 'Ensaladas' WHERE (`idPlatillo` = '7');
UPDATE `makibase`.`platillo` SET `categoria` = 'Ensaladas' WHERE (`idPlatillo` = '8');
UPDATE `makibase`.`platillo` SET `categoria` = 'Ensaladas' WHERE (`idPlatillo` = '9');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '10');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '11');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '12');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '13');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '14');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '15');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '16');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '17');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '18');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '19');
UPDATE `makibase`.`platillo` SET `categoria` = 'Entradas' WHERE (`idPlatillo` = '20');
UPDATE `makibase`.`platillo` SET `categoria` = 'Arroz' WHERE (`idPlatillo` = '21');
UPDATE `makibase`.`platillo` SET `categoria` = 'Arroz' WHERE (`idPlatillo` = '22');
UPDATE `makibase`.`platillo` SET `categoria` = 'Arroz' WHERE (`idPlatillo` = '23');
UPDATE `makibase`.`platillo` SET `categoria` = 'Arroz' WHERE (`idPlatillo` = '24');
UPDATE `makibase`.`platillo` SET `categoria` = 'Arroz' WHERE (`idPlatillo` = '25');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '26');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '27');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '28');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '29');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '30');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '31');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '32');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '33');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '34');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '35');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '36');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '37');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '38');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '39');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '40');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '41');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '42');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '43');
UPDATE `makibase`.`platillo` SET `categoria` = 'Platillos' WHERE (`idPlatillo` = '44');
UPDATE `makibase`.`platillo` SET `categoria` = 'Sopas' WHERE (`idPlatillo` = '45');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '46');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '47');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '48');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '49');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '50');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '51');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '52');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '53');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '54');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '55');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '56');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '57');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '58');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '59');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '60');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '61');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Naturales' WHERE (`idPlatillo` = '62');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '63');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '64');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '65');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '66');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '67');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '68');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '69');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '70');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '71');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '72');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '73');
UPDATE `makibase`.`platillo` SET `categoria` = 'Rollos Calientes' WHERE (`idPlatillo` = '74');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '75');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '76');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '77');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '78');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '79');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '80');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '81');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '82');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '83');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '84');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '85');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '86');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '87');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '88');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '89');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '90');
UPDATE `makibase`.`platillo` SET `categoria` = 'Postres y Bebidas' WHERE (`idPlatillo` = '91');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '92');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '93');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '94');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '95');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '96');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '97');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '98');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '99');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '100');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '101');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '102');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '103');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '104');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '105');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '106');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '107');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '108');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '109');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '110');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '111');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '112');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '113');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '114');
UPDATE `makibase`.`platillo` SET `categoria` = 'Cervezas' WHERE (`idPlatillo` = '115');
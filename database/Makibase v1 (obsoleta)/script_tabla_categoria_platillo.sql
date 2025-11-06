USE makibase;

CREATE TABLE IF NOT EXISTS platillo_categoria (
  id_categoria_platillo INT NOT NULL AUTO_INCREMENT,
  nombre VARCHAR(50) NOT NULL,
  descripcion VARCHAR(150) NULL,
  PRIMARY KEY (id_categoria_platillo),
  UNIQUE INDEX nombre_UNIQUE (nombre ASC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO platillo_categoria (nombre, descripcion) VALUES
('Brochetas', 'Categoría para las brochetas empanizadas con diferentes proteínas.'),
('Ensaladas', 'Categoría para ensaladas frescas con base de vegetales, frutas y proteínas.'),
('Entradas', 'Categoría para los aperitivos y botanas de inicio.'),
('Arroz', 'Categoría para los platillos elaborados a base de arroz.'),
('Platillos', 'Categoría para los platillos principales de la carta.'),
('Sopas', 'Categoría para las sopas y caldos especiales de la casa.'),
('Rollos Naturales', 'Categoría para los rollos fríos elaborados con ingredientes naturales.'),
('Rollos Calientes', 'Categoría para los rollos calientes o empanizados.'),
('Postres y Bebidas', 'Categoría para los postres dulces y bebidas frías o calientes.'),
('Cervezas', 'Categoría para las cervezas nacionales e importadas.');

USE makibase;

CREATE TABLE IF NOT EXISTS RegistroAcceso (
  idRegistro INT NOT NULL AUTO_INCREMENT,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ip VARCHAR(45) NULL,
  ruta VARCHAR(255) NULL,
  metodo VARCHAR(10) NULL,
  username_proporcionado VARCHAR(100) NULL,
  usuario_id INT NULL,              -- FK opcional si existe
  rol_requerido VARCHAR(100) NULL,
  motivo VARCHAR(255) NOT NULL,     -- e.g. "Token inválido", "Permiso insuficiente", "Login fallido"
  detalle TEXT NULL,
  PRIMARY KEY (idRegistro),
  INDEX (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

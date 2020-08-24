CREATE TABLE empresa(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(40) NOT NULL,
	nombre_impuesto VARCHAR(30),
	acronimo_impuesto VARCHAR(5),
	valor_impuesto DECIMAL,
	nombre_logo VARCHAR (100),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
     PRIMARY KEY (id)
);

CREATE TABLE tipo_documento(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	acronimo VARCHAR(256),
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)
	
);

CREATE TABLE sucursal(
	id INT NOT NULL AUTO_INCREMENT,
	empresa_id INT NOT NULL,
	tipo_documento_id INT NOT NULL,
	razon_social VARCHAR(256),
	numero_documento VARCHAR(256),
	serie VARCHAR(256),
	direccion VARCHAR(256),
	telefono VARCHAR(256),
	email VARCHAR(256),
	representante VARCHAR(256),
	url_logo VARCHAR(256),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (empresa_id) REFERENCES empresa(id),
	FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id)
	
);

CREATE TABLE tipo_usuario(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	acronimo VARCHAR(256),
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)
);

CREATE TABLE persona(
	id INT NOT NULL AUTO_INCREMENT,
	tipo_documento_id INT NOT NULL,
	nombres VARCHAR(256),
	apellidos VARCHAR(256),
	direccion VARCHAR(256),
	numero_documento VARCHAR(256),
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (tipo_documento_id) REFERENCES tipo_documento(id)
);

CREATE TABLE usuario(
	id INT NOT NULL AUTO_INCREMENT,
	persona_id INT NOT NULL,
	nombre_usuario VARCHAR(256),
	contrasenia VARCHAR(256), 
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (persona_id) REFERENCES persona(id)
);


CREATE TABLE unidad_de_medida(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	acronimo VARCHAR(256),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)

);

CREATE TABLE linea(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	acronimo VARCHAR(256),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)

);

CREATE TABLE marca(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	acronimo VARCHAR(256),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)

);


CREATE TABLE producto(
	id INT NOT NULL AUTO_INCREMENT,
	unidad_medida_id INT,
	marca_id INT,
	linea_id INT,
	nombre VARCHAR(256),
	codigo VARCHAR(256),
	descripcion TEXT,
	url_imagen VARCHAR(256),
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (unidad_medida_id) REFERENCES unidad_de_medida(id),
	FOREIGN KEY (linea_id) REFERENCES linea(id),
	FOREIGN KEY (marca_id) REFERENCES marca(id)
);

CREATE TABLE articulo(
	id INT NOT NULL AUTO_INCREMENT,
	producto_id INT NOT NULL,
	sucursal_id INT NOT NULL,
	
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (producto_id) REFERENCES producto(id),
	FOREIGN KEY (sucursal_id) REFERENCES sucursal(id)
	
);

CREATE TABLE tipo_comprobante(
	id INT NOT NULL AUTO_INCREMENT,
	nombre VARCHAR(256),
	codigo VARCHAR(256),
	acronimo VARCHAR(256),
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id)
);

CREATE TABLE comprobante_cab(
	id INT NOT NULL AUTO_INCREMENT,
	sucursal_id INT,
	tipo_comprobante_id INT,
	usuario_id INT,
	numero_comprobante INT,
	monto_total float,
	fecha TIMESTAMP,
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (tipo_comprobante_id) REFERENCES tipo_comprobante(id),
	FOREIGN KEY (usuario_id) REFERENCES usuario(id),
	FOREIGN KEY (sucursal_id) REFERENCES sucursal(id)
	
);

CREATE TABLE comprobante_det(
	id INT NOT NULL AUTO_INCREMENT,
	comprobante_cab_id INT,
	producto_id INT,
	cantidad INT,
	precio_unitario FLOAT,
	usuario_creacion INT,
	usuario_modificacion INT,
	fecha_creacion TIMESTAMP,
	fecha_modificacion TIMESTAMP,
	estado INT,
	PRIMARY KEY (id),
	FOREIGN KEY (comprobante_cab_id) REFERENCES comprobante_cab(id),
	FOREIGN KEY (producto_id) REFERENCES producto(id)
	
);

INSERT INTO tipo_usuario VALUES (DEFAULT, 'ADMINISTRADOR', 'ADMIN', NOW(), NOW() ,2);
INSERT INTO tipo_documento VALUES (DEFAULT, 'DOCUMENTO NACIONAL DE INDENTIDAD', 'DNI', NOW(), NOW() ,2);
INSERT INTO persona VALUES (DEFAULT, 1, 'DIEGO ALONO', 'JAVIER QUISE', 'CALLE BOLOGNESI 107', '72141522', NOW(), NOW() ,2);
INSERT INTO empresa VALUES (DEFAULT, 'JAVIER HERMANOS', 'IMPUESTO GENERAL A LAS VENTAS', 'IGV', 18.00, 'IMAGEN', 1, 1, NOW(), NOW() ,2);
INSERT INTO sucursal VALUES (DEFAULT, 1, 1, 'JAVIER HERMANOS S.A.', '12314141515', '001', 'CALLE NUEVA 109', '912313', 'correo@correo', 'DIEGO JAVIER', 'IMAGEN', 1, 1, NOW(), NOW() ,2);
INSERT INTO tipo_comprobante VALUES (DEFAULT, 'VENTA', '001', 'VNT', NOW(), NOW() ,2);




-- Inserciones de Bryam 
-- Roles
INSERT INTO Roles (id_rol, nombre_rol)
VALUES
(1, 'UsuarioFinal'),
(2, 'Artista'),
(3, 'Administrador');

-- Usuarios
INSERT INTO usuarios (id_usuario, nombre, apellido, email, clave, telefono, fecha_registro, estado_cuenta, id_rol)
VALUES
(1,'Juan','Perez','juan1@gmail.com','1234',3001111111,'2024-01-01',1,1),
(2,'Maria','Gomez','maria2@gmail.com','1234',3001111112,'2024-01-02',1,2),
(3,'Carlos','Lopez','carlos3@gmail.com','1234',3001111113,'2024-01-03',1,1),
(4,'Ana','Martinez','ana4@gmail.com','1234',3001111114,'2024-01-04',1,2),
(5,'Luis','Rodriguez','luis5@gmail.com','1234',3001111115,'2024-01-05',1,1),
(6,'Sofia','Hernandez','sofia6@gmail.com','1234',3001111116,'2024-01-06',1,2),
(7,'Pedro','Diaz','pedro7@gmail.com','1234',3001111117,'2024-01-07',1,1),
(8,'Laura','Torres','laura8@gmail.com','1234',3001111118,'2024-01-08',1,2),
(9,'Diego','Ramirez','diego9@gmail.com','1234',3001111119,'2024-01-09',1,1),
(10,'Valentina','Castro','vale10@gmail.com','1234',3001111120,'2024-01-10',1,2),

(11,'Andres','Morales','andres11@gmail.com','1234',3001111121,'2024-01-11',1,1),
(12,'Camila','Vargas','camila12@gmail.com','1234',3001111122,'2024-01-12',1,2),
(13,'Jorge','Rojas','jorge13@gmail.com','1234',3001111123,'2024-01-13',1,1),
(14,'Paula','Ortega','paula14@gmail.com','1234',3001111124,'2024-01-14',1,2),
(15,'Miguel','Suarez','miguel15@gmail.com','1234',3001111125,'2024-01-15',1,1),
(16,'Daniela','Mendez','daniela16@gmail.com','1234',3001111126,'2024-01-16',1,2),
(17,'Ricardo','Castillo','ricardo17@gmail.com','1234',3001111127,'2024-01-17',1,1),
(18,'Natalia','Guerrero','natalia18@gmail.com','1234',3001111128,'2024-01-18',1,2),
(19,'Fernando','Vega','fernando19@gmail.com','1234',3001111129,'2024-01-19',1,1),
(20,'Luisa','Pineda','luisa20@gmail.com','1234',3001111130,'2024-01-20',1,2),

(21,'Oscar','Cruz','oscar21@gmail.com','1234',3001111131,'2024-01-21',1,1),
(22,'Angela','Campos','angela22@gmail.com','1234',3001111132,'2024-01-22',1,2),
(23,'Sebastian','Reyes','seb23@gmail.com','1234',3001111133,'2024-01-23',1,1),
(24,'Juliana','Navarro','juli24@gmail.com','1234',3001111134,'2024-01-24',1,2),
(25,'David','Silva','david25@gmail.com','1234',3001111135,'2024-01-25',1,1),
(26,'Sara','Acosta','sara26@gmail.com','1234',3001111136,'2024-01-26',1,2),
(27,'Kevin','Peña','kevin27@gmail.com','1234',3001111137,'2024-01-27',1,1),
(28,'Laura','Gil','laura28@gmail.com','1234',3001111138,'2024-01-28',1,2),
(29,'Cristian','Arias','cris29@gmail.com','1234',3001111139,'2024-01-29',1,1),
(30,'Tatiana','Figueroa','tati30@gmail.com','1234',3001111140,'2024-01-30',1,2),

(31,'Alberto','Leon','alberto31@gmail.com','1234',3001111141,'2024-02-01',1,1),
(32,'Diana','Salazar','diana32@gmail.com','1234',3001111142,'2024-02-02',1,2),
(33,'Raul','Cortes','raul33@gmail.com','1234',3001111143,'2024-02-03',1,1),
(34,'Elena','Mejia','elena34@gmail.com','1234',3001111144,'2024-02-04',1,2),
(35,'Victor','Cardenas','victor35@gmail.com','1234',3001111145,'2024-02-05',1,1),
(36,'Monica','Bautista','monica36@gmail.com','1234',3001111146,'2024-02-06',1,2),
(37,'Hugo','Parra','hugo37@gmail.com','1234',3001111147,'2024-02-07',1,1),
(38,'Claudia','Espinosa','claudia38@gmail.com','1234',3001111148,'2024-02-08',1,2),
(39,'Ivan','Montoya','ivan39@gmail.com','1234',3001111149,'2024-02-09',1,1),
(40,'Patricia','Naranjo','patricia40@gmail.com','1234',3001111150,'2024-02-10',1,2),

(41,'Brayan','Rincon','brayan41@gmail.com','1234',3001111151,'2024-02-11',1,1),
(42,'Karen','Zapata','karen42@gmail.com','1234',3001111152,'2024-02-12',1,2),
(43,'Esteban','Soto','esteban43@gmail.com','1234',3001111153,'2024-02-13',1,1),
(44,'Yuli','Quintero','yuli44@gmail.com','1234',3001111154,'2024-02-14',1,2),
(45,'Mateo','Galindo','mateo45@gmail.com','1234',3001111155,'2024-02-15',1,1),
(46,'Valeria','Londoño','vale46@gmail.com','1234',3001111156,'2024-02-16',1,2),
(47,'Nicolas','Beltran','nico47@gmail.com','1234',3001111157,'2024-02-17',1,1),
(48,'Daniel','Barrios','daniel48@gmail.com','1234',3001111158,'2024-02-18',1,2),
(49,'Jessica','Muñoz','jessi49@gmail.com','1234',3001111159,'2024-02-19',1,1),
(50,'Felipe','Trujillo','felipe50@gmail.com','1234',3001111160,'2024-02-20',1,2);

-- Perfiles
INSERT INTO Perfiles
(id_perfil, foto_perfil, descripcion, ocupacion, id_usuario)
VALUES
(1,'foto1.jpg','Amante del arte digital','Diseñador',1),
(2,'foto2.jpg','Pintora apasionada','Artista',2),
(3,'foto3.jpg','Escultor moderno','Escultor',3),
(4,'foto4.jpg','Fan del cine independiente','Cineasta',4),
(5,'foto5.jpg','Explorando la música','Músico',5),
(6,'foto6.jpg','Arte urbano y graffiti','Artista urbano',6),
(7,'foto7.jpg','Fotógrafo creativo','Fotógrafo',7),
(8,'foto8.jpg','Diseño gráfico minimalista','Diseñador',8),
(9,'foto9.jpg','Pintura abstracta','Artista',9),
(10,'foto10.jpg','Creador audiovisual','Editor',10),

(11,'foto11.jpg','Apasionado por la danza','Bailarín',11),
(12,'foto12.jpg','Escritora de historias','Escritora',12),
(13,'foto13.jpg','Arte contemporáneo','Artista',13),
(14,'foto14.jpg','Diseño UX/UI','Diseñador',14),
(15,'foto15.jpg','Ilustrador freelance','Ilustrador',15),
(16,'foto16.jpg','Música electrónica','DJ',16),
(17,'foto17.jpg','Cine y fotografía','Cineasta',17),
(18,'foto18.jpg','Arte conceptual','Artista',18),
(19,'foto19.jpg','Escultura en madera','Escultor',19),
(20,'foto20.jpg','Diseño publicitario','Publicista',20),

(21,'foto21.jpg','Arte digital y 3D','Modelador 3D',21),
(22,'foto22.jpg','Pintura clásica','Artista',22),
(23,'foto23.jpg','Diseño industrial','Diseñador',23),
(24,'foto24.jpg','Animación 2D','Animador',24),
(25,'foto25.jpg','Arte urbano','Grafitero',25),
(26,'foto26.jpg','Fotografía de retrato','Fotógrafo',26),
(27,'foto27.jpg','Producción musical','Productor',27),
(28,'foto28.jpg','Arte experimental','Artista',28),
(29,'foto29.jpg','Diseño web','Desarrollador',29),
(30,'foto30.jpg','Arte digital','Ilustrador',30),

(31,'foto31.jpg','Escultura moderna','Escultor',31),
(32,'foto32.jpg','Diseño editorial','Diseñador',32),
(33,'foto33.jpg','Arte y cultura','Gestor cultural',33),
(34,'foto34.jpg','Cine documental','Cineasta',34),
(35,'foto35.jpg','Arte abstracto','Artista',35),
(36,'foto36.jpg','Diseño de moda','Diseñador',36),
(37,'foto37.jpg','Música clásica','Músico',37),
(38,'foto38.jpg','Fotografía urbana','Fotógrafo',38),
(39,'foto39.jpg','Arte digital','Artista',39),
(40,'foto40.jpg','Animación 3D','Animador',40),

(41,'foto41.jpg','Diseño creativo','Diseñador',41),
(42,'foto42.jpg','Arte contemporáneo','Artista',42),
(43,'foto43.jpg','Producción audiovisual','Productor',43),
(44,'foto44.jpg','Arte y tecnología','Desarrollador',44),
(45,'foto45.jpg','Escultura artística','Escultor',45),
(46,'foto46.jpg','Diseño gráfico','Diseñador',46),
(47,'foto47.jpg','Fotografía artística','Fotógrafo',47),
(48,'foto48.jpg','Arte moderno','Artista',48),
(49,'foto49.jpg','Música urbana','Músico',49),
(50,'foto50.jpg','Cine independiente','Cineasta',50);

-- Inserciones de Jorge 
-- Categorías
INSERT INTO Categorias
(id_categoria, nombreCategoria, descripcion)
VALUES
(1,'Escultura','Arte tridimensional en diferentes materiales'),
(2,'Pintura','Arte sobre lienzo o superficies diversas'),
(3,'Música','Expresión artística a través del sonido'),
(4,'Danza','Arte del movimiento corporal'),
(5,'Literatura','Expresión artística escrita'),
(6,'Cine','Arte audiovisual y cinematográfico'),
(7,'Fotografía','Captura artística de imágenes'),
(8,'Arte Digital','Creaciones realizadas con herramientas digitales'),
(9,'Diseño Gráfico','Comunicación visual y diseño creativo'),
(10,'Animación','Creación de imágenes en movimiento'),
(11,'Arte Urbano','Expresiones artísticas en espacios públicos'),
(12,'Teatro','Arte escénico en vivo'),
(13,'Moda','Diseño y expresión a través de vestimenta'),
(14,'Arquitectura','Diseño y construcción de espacios'),
(15,'Ilustración','Representación gráfica de ideas'),
(16,'Arte Conceptual','Arte enfocado en ideas y conceptos');

-- Publicaciónes
INSERT INTO Publicaciones
(id_publicacion, titulo, contenido, descripcion, estado, id_categoria, id_usuario_artista)
VALUES
(1,'Obra 1','contenido1.jpg','Arte digital moderno',1,1,2),
(2,'Obra 2','contenido2.jpg','Pintura abstracta',1,2,2),
(3,'Obra 3','contenido3.jpg','Escultura en madera',1,1,4),
(4,'Obra 4','contenido4.jpg','Corto cinematográfico',1,6,4),
(5,'Obra 5','contenido5.jpg','Composición musical',1,3,6),
(6,'Obra 6','contenido6.jpg','Graffiti urbano',1,1,6),
(7,'Obra 7','contenido7.jpg','Fotografía artística',1,2,8),
(8,'Obra 8','contenido8.jpg','Diseño minimalista',1,2,8),
(9,'Obra 9','contenido9.jpg','Pintura surrealista',1,2,10),
(10,'Obra 10','contenido10.jpg','Video creativo',1,6,10),

(11,'Obra 11','contenido11.jpg','Danza contemporánea',1,4,12),
(12,'Obra 12','contenido12.jpg','Poema visual',1,5,12),
(13,'Obra 13','contenido13.jpg','Arte conceptual',1,1,14),
(14,'Obra 14','contenido14.jpg','UI moderno',1,2,14),
(15,'Obra 15','contenido15.jpg','Ilustración digital',1,2,16),
(16,'Obra 16','contenido16.jpg','Beat electrónico',1,3,16),
(17,'Obra 17','contenido17.jpg','Fotografía cine',1,6,18),
(18,'Obra 18','contenido18.jpg','Concept art',1,1,18),
(19,'Obra 19','contenido19.jpg','Escultura clásica',1,1,20),
(20,'Obra 20','contenido20.jpg','Publicidad creativa',1,2,20),

(21,'Obra 21','contenido21.jpg','Modelado 3D',1,1,22),
(22,'Obra 22','contenido22.jpg','Pintura óleo',1,2,22),
(23,'Obra 23','contenido23.jpg','Diseño industrial',1,2,24),
(24,'Obra 24','contenido24.jpg','Animación 2D',1,6,24),
(25,'Obra 25','contenido25.jpg','Arte callejero',1,1,26),
(26,'Obra 26','contenido26.jpg','Retrato fotográfico',1,2,26),
(27,'Obra 27','contenido27.jpg','Producción musical',1,3,28),
(28,'Obra 28','contenido28.jpg','Arte experimental',1,1,28),
(29,'Obra 29','contenido29.jpg','Diseño web',1,2,30),
(30,'Obra 30','contenido30.jpg','Ilustración creativa',1,2,30),

(31,'Obra 31','contenido31.jpg','Escultura moderna',1,1,32),
(32,'Obra 32','contenido32.jpg','Revista editorial',1,5,32),
(33,'Obra 33','contenido33.jpg','Gestión cultural',1,5,34),
(34,'Obra 34','contenido34.jpg','Documental',1,6,34),
(35,'Obra 35','contenido35.jpg','Arte abstracto',1,2,36),
(36,'Obra 36','contenido36.jpg','Diseño moda',1,2,36),
(37,'Obra 37','contenido37.jpg','Música clásica',1,3,38),
(38,'Obra 38','contenido38.jpg','Foto urbana',1,2,38),
(39,'Obra 39','contenido39.jpg','Arte digital',1,1,40),
(40,'Obra 40','contenido40.jpg','Animación 3D',1,6,40),

(41,'Obra 41','contenido41.jpg','Diseño creativo',1,2,42),
(42,'Obra 42','contenido42.jpg','Arte moderno',1,2,42),
(43,'Obra 43','contenido43.jpg','Producción video',1,6,44),
(44,'Obra 44','contenido44.jpg','Arte tech',1,1,44),
(45,'Obra 45','contenido45.jpg','Escultura artística',1,1,46),
(46,'Obra 46','contenido46.jpg','Diseño gráfico',1,2,46),
(47,'Obra 47','contenido47.jpg','Fotografía arte',1,2,48),
(48,'Obra 48','contenido48.jpg','Arte contemporáneo',1,2,48),
(49,'Obra 49','contenido49.jpg','Música urbana',1,3,50),
(50,'Obra 50','contenido50.jpg','Cine indie',1,6,50);

-- Comentarios
INSERT INTO Comentarios
(id_comentario, contenido, id_usuario_final, id_publicacion)
VALUES
(1,'Increíble obra 🔥',1,1),
(2,'Me encantó este estilo',2,1),
(3,'Muy creativo',3,2),
(4,'Gran trabajo',4,2),
(5,'Me inspira mucho',5,3),
(6,'Brutal 💯',6,3),
(7,'Excelente composición',7,4),
(8,'Muy original',8,4),
(9,'Hermoso detalle',9,5),
(10,'Top 🔝',10,5),

(11,'Me gusta mucho',11,6),
(12,'Buen concepto',12,6),
(13,'Se ve profesional',13,7),
(14,'Gran talento',14,7),
(15,'Súper creativo',15,8),
(16,'Muy buen trabajo',16,8),
(17,'Esto es arte',17,9),
(18,'Me encanta 😍',18,9),
(19,'Buenísimo',19,10),
(20,'Muy top',20,10),

(21,'Impresionante',21,11),
(22,'Sigue así',22,11),
(23,'Gran detalle',23,12),
(24,'Excelente idea',24,12),
(25,'Muy artístico',25,13),
(26,'Wow 🔥',26,13),
(27,'Muy bien logrado',27,14),
(28,'Buen diseño',28,14),
(29,'Esto es genial',29,15),
(30,'Gran inspiración',30,15),

(31,'Perfecto',31,16),
(32,'Buenísimo 👏',32,16),
(33,'Me gusta el estilo',33,17),
(34,'Muy pro',34,17),
(35,'Hermoso trabajo',35,18),
(36,'Arte puro',36,18),
(37,'Muy interesante',37,19),
(38,'Buen concepto',38,19),
(39,'Excelente',39,20),
(40,'Muy creativo',40,20),

(41,'Top nivel',41,21),
(42,'Me encanta este arte',42,21),
(43,'Buen trabajo',43,22),
(44,'Muy bonito',44,22),
(45,'Genial 😎',45,23),
(46,'Muy bien hecho',46,23),
(47,'Impresionante obra',47,24),
(48,'Gran creatividad',48,24),
(49,'Excelente pieza',49,25),
(50,'Muy inspirador',50,25);

-- Inserciones de Nossa

-- Reacciones
INSERT INTO Reacciones (tipo, id_usuario, id_publicacion) 
VALUES
('Me gusta', 1, 1),
('Me encanta', 2, 1),
('Me gusta', 3, 2),
('Me encanta', 4, 2),
('Me gusta', 5, 3),
('Me encanta', 6, 3),
('Me gusta', 7, 4),
('Me encanta', 8, 4),
('Me gusta', 9, 5),
('Me encanta', 10, 5),

('Me gusta', 11, 6),
('Me encanta', 12, 6),
('Me gusta', 13, 7),
('Me encanta', 14, 7),
('Me gusta', 15, 8),
('Me encanta', 16, 8),
('Me gusta', 17, 9),
('Me encanta', 18, 9),
('Me gusta', 19, 10),
('Me encanta', 20, 10),

('Me gusta', 21, 11),
('Me encanta', 22, 11),
('Me gusta', 23, 12),
('Me encanta', 24, 12),
('Me gusta', 25, 13),
('Me encanta', 26, 13),
('Me gusta', 27, 14),
('Me encanta', 28, 14),
('Me gusta', 29, 15),
('Me encanta', 30, 15),

('Me gusta', 31, 16),
('Me encanta', 32, 16),
('Me gusta', 33, 17),
('Me encanta', 34, 17),
('Me gusta', 35, 18),
('Me encanta', 36, 18),
('Me gusta', 37, 19),
('Me encanta', 38, 19),
('Me gusta', 39, 20),
('Me encanta', 40, 20),

('Me gusta', 41, 21),
('Me encanta', 42, 21),
('Me gusta', 43, 22),
('Me encanta', 44, 22),
('Me gusta', 45, 23),
('Me encanta', 46, 23),
('Me gusta', 47, 24),
('Me encanta', 48, 24),
('Me gusta', 49, 25),
('Me encanta', 50, 25);

-- Notificaciones
INSERT INTO Notificaciones (asunto, tipo_notificacion, id_usuario) 
VALUES
('Nuevo mensaje recibido', 'Mensaje', 1),
('Alguien reaccionó a tu publicación', 'Reaccion', 2),
('Nuevo comentario en tu post', 'Comentario', 3),
('Actualización del sistema', 'Informativo', 4),
('Tienes un nuevo seguidor', 'Informativo', 5),
('Mensaje sin leer', 'Mensaje', 6),
('Reacción a tu foto', 'Reaccion', 7),
('Comentario destacado', 'Comentario', 8),
('Noticia importante', 'Informativo', 9),
('Nuevo chat iniciado', 'Mensaje', 10),

('Reacción reciente', 'Reaccion', 11),
('Comentario reciente', 'Comentario', 12),
('Aviso general', 'Informativo', 13),
('Nuevo mensaje', 'Mensaje', 14),
('Alguien le dio like', 'Reaccion', 15),
('Nuevo comentario', 'Comentario', 16),
('Actualización disponible', 'Informativo', 17),
('Mensaje recibido', 'Mensaje', 18),
('Reacción en publicación', 'Reaccion', 19),
('Comentario nuevo', 'Comentario', 20),

('Información del sistema', 'Informativo', 21),
('Nuevo inbox', 'Mensaje', 22),
('Like recibido', 'Reaccion', 23),
('Comentario agregado', 'Comentario', 24),
('Evento importante', 'Informativo', 25),
('Mensaje directo', 'Mensaje', 26),
('Reacción destacada', 'Reaccion', 27),
('Comentario popular', 'Comentario', 28),
('Actualización general', 'Informativo', 29),
('Mensaje urgente', 'Mensaje', 30),

('Reacción nueva', 'Reaccion', 31),
('Comentario reciente', 'Comentario', 32),
('Aviso del sistema', 'Informativo', 33),
('Nuevo mensaje recibido', 'Mensaje', 34),
('Me gusta en tu publicación', 'Reaccion', 35),
('Comentario añadido', 'Comentario', 36),
('Información relevante', 'Informativo', 37),
('Chat nuevo', 'Mensaje', 38),
('Reacción importante', 'Reaccion', 39),
('Comentario destacado', 'Comentario', 40),

('Aviso importante', 'Informativo', 41),
('Mensaje privado', 'Mensaje', 42),
('Reacción reciente', 'Reaccion', 43),
('Comentario nuevo', 'Comentario', 44),
('Notificación del sistema', 'Informativo', 45),
('Nuevo mensaje', 'Mensaje', 46),
('Reacción en tu post', 'Reaccion', 47),
('Comentario agregado', 'Comentario', 48),
('Actualización', 'Informativo', 49),
('Mensaje recibido', 'Mensaje', 50);

-- Solicitudes
INSERT INTO Solicitudes (tipoSolicitud, estadoSolicitud, id_usuario) 
VALUES
('Verificacion', 'Pendiente', 1),
('Artista', 'Aceptada', 2),
('Verificacion', 'Rechazada', 3),
('Artista', 'Pendiente', 4),
('Verificacion', 'Aceptada', 5),
('Artista', 'Rechazada', 6),
('Verificacion', 'Pendiente', 7),
('Artista', 'Aceptada', 8),
('Verificacion', 'Rechazada', 9),
('Artista', 'Pendiente', 10),

('Verificacion', 'Aceptada', 11),
('Artista', 'Rechazada', 12),
('Verificacion', 'Pendiente', 13),
('Artista', 'Aceptada', 14),
('Verificacion', 'Rechazada', 15),
('Artista', 'Pendiente', 16),
('Verificacion', 'Aceptada', 17),
('Artista', 'Rechazada', 18),
('Verificacion', 'Pendiente', 19),
('Artista', 'Aceptada', 20),

('Verificacion', 'Rechazada', 21),
('Artista', 'Pendiente', 22),
('Verificacion', 'Aceptada', 23),
('Artista', 'Rechazada', 24),
('Verificacion', 'Pendiente', 25),
('Artista', 'Aceptada', 26),
('Verificacion', 'Rechazada', 27),
('Artista', 'Pendiente', 28),
('Verificacion', 'Aceptada', 29),
('Artista', 'Rechazada', 30),

('Verificacion', 'Pendiente', 31),
('Artista', 'Aceptada', 32),
('Verificacion', 'Rechazada', 33),
('Artista', 'Pendiente', 34),
('Verificacion', 'Aceptada', 35),
('Artista', 'Rechazada', 36),
('Verificacion', 'Pendiente', 37),
('Artista', 'Aceptada', 38),
('Verificacion', 'Rechazada', 39),
('Artista', 'Pendiente', 40),

('Verificacion', 'Aceptada', 41),
('Artista', 'Rechazada', 42),
('Verificacion', 'Pendiente', 43),
('Artista', 'Aceptada', 44),
('Verificacion', 'Rechazada', 45),
('Artista', 'Pendiente', 46),
('Verificacion', 'Aceptada', 47),
('Artista', 'Rechazada', 48),
('Verificacion', 'Pendiente', 49),
('Artista', 'Aceptada', 50);

-- Inserciones de Johan

-- Conversaciones
INSERT INTO Conversaciones (fechaCreacion) VALUES
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW());

-- Participantes
INSERT INTO Participantes (id_conversacion, id_usuario) VALUES
(1,1),(1,2),
(2,3),(2,4),
(3,5),(3,6),
(4,7),(4,8),
(5,9),(5,10),
(6,11),(6,12),
(7,13),(7,14),
(8,15),(8,16),
(9,17),(9,18),
(10,19),(10,20),
(11,21),(11,22),
(12,23),(12,24),
(13,25),(13,26),
(14,27),(14,28),
(15,29),(15,30),
(16,31),(16,32),
(17,33),(17,34),
(18,35),(18,36),
(19,37),(19,38),
(20,39),(20,40),
(21,41),(21,42),
(22,43),(22,44),
(23,45),(23,46),
(24,47),(24,48),
(25,49),(25,50);

-- Mensajes
INSERT INTO Mensajes (contenido, id_conversacion, id_usuario) VALUES
-- Conversación 1
('Hola, me gusta tu trabajo',1,1),
('Gracias! ¿Qué necesitas?',1,2),
('Quiero un retrato digital',1,1),
('Claro, te cuesta 50 USD',1,2),

-- Conversación 2
('Hola, haces logos?',2,3),
('Sí, claro',2,4),
('Necesito uno para mi negocio',2,3),

-- Conversación 3
('Buenas, manejas ilustraciones anime?',3,5),
('Sí, es mi especialidad',3,6),

-- Conversación 4
('Hola, haces tatuajes?',4,7),
('Sí, tengo agenda abierta',4,8),

-- Conversación 5
('Hola artista!',5,9),
('Hola! cuéntame',5,10),

-- Conversación 6
('Necesito portada para música',6,11),
('Te puedo ayudar',6,12),

-- Conversación 7
('Hola, haces caricaturas?',7,13),
('Sí 😄',7,14),

-- Conversación 8
('Precio por ilustración?',8,15),
('Depende del detalle',8,16),

-- Conversación 9
('Hola, tienes portafolio?',9,17),
('Sí, te lo envío',9,18),

-- Conversación 10
('Cuánto tardas en entregar?',10,19),
('2 a 3 días',10,20),

-- Conversación 11
('Trabajas con Photoshop?',11,21),
('Sí, y Procreate',11,22),

-- Conversación 12
('Hola, haces animaciones?',12,23),
('Solo básicas',12,24),

-- Conversación 13
('Me interesa un diseño',13,25),
('Perfecto',13,26),

-- Conversación 14
('Haces arte realista?',14,27),
('Sí, bastante',14,28),

-- Conversación 15
('Hola, precios?',15,29),
('Desde 30 USD',15,30),

-- Conversación 16
('Necesito un banner',16,31),
('Claro, dime medidas',16,32),

-- Conversación 17
('Hola artista',17,33),
('Hola!',17,34),

-- Conversación 18
('Haces retratos?',18,35),
('Sí',18,36),

-- Conversación 19
('Disponible?',19,37),
('Sí',19,38),

-- Conversación 20
('Hola',20,39),
('Hola!',20,40),

-- Conversación 21
('Precio ilustración?',21,41),
('40 USD',21,42),

-- Conversación 22
('Trabajas rápido?',22,43),
('Sí',22,44),

-- Conversación 23
('Hola!',23,45),
('Hola 😄',23,46),

-- Conversación 24
('Necesito arte',24,47),
('Te ayudo',24,48),

-- Conversación 25
('Hola, disponible?',25,49),
('Sí, dime',25,50);
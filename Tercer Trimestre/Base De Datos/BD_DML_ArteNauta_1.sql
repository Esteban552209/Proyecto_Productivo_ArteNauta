-- ======================================================
-- SCRIPT DML COMPLETO - ARTENAUTA (50 REGISTROS X TABLA)
-- RESTRICCIONES DE ENUM APLICADAS Y DATOS ÚNICOS
-- ======================================================

-- 1. ROLES
INSERT INTO Roles (nombre_rol) 
VALUES ('Usuario_Final'), ('Artista'), ('Administrador');

-- 2. USUARIOS (50 registros únicos)
INSERT INTO Usuarios (nombre, apellido, email, clave, telefono, fecha_registro, estado_cuenta, id_rol)
VALUES
('Mateo', 'Villamizar', 'mateo.v@gmail.com', 'sc_hash_01', 3102224455, '2024-01-05', 1, 1),
('Valeria', 'Quintana', 'val.art@gmail.com', 'sc_hash_02', 3158889900, '2024-01-06', 1, 2),
('Sebastian', 'Holguín', 'seb.dev@gmail.com', 'sc_hash_03', 3004445566, '2024-01-10', 1, 1),
('Isabella', 'Rengifo', 'isa.studio@gmail.com', 'sc_hash_04', 3201112233, '2024-01-12', 1, 2),
('Santiago', 'Cifuentes', 'santi.cif@gmail.com', 'sc_hash_05', 3117778899, '2024-01-15', 1, 1),
('Camila', 'Zuleta', 'cami.paint@gmail.com', 'sc_hash_06', 3123334455, '2024-01-18', 1, 2),
('Felipe', 'Montoya', 'pipe.m@gmail.com', 'sc_hash_07', 3145556677, '2024-01-20', 1, 1),
('Daniela', 'Ossa', 'dani.photo@gmail.com', 'sc_hash_08', 3012223344, '2024-01-22', 1, 2),
('Andrés', 'Castro', 'andres.c@gmail.com', 'sc_hash_09', 3169990011, '2024-01-25', 1, 1),
('Paula', 'Méndez', 'paula.art@gmail.com', 'sc_hash_10', 3178881122, '2024-01-28', 1, 2),
('Lucas', 'Ríos', 'lucas.r@gmail.com', 'sc_hash_11', 3187772233, '2024-02-01', 1, 1),
('Elena', 'Torres', 'elena.t@gmail.com', 'sc_hash_12', 3196663344, '2024-02-03', 1, 2),
('Diego', 'Sánchez', 'diego.s@gmail.com', 'sc_hash_13', 3205554455, '2024-02-05', 1, 1),
('Sara', 'Giraldo', 'sara.g@gmail.com', 'sc_hash_14', 3214445566, '2024-02-08', 1, 2),
('Nicolás', 'Peña', 'nico.p@gmail.com', 'sc_hash_15', 3223336677, '2024-02-10', 1, 1),
('Sofía', 'Vargas', 'sofia.v@gmail.com', 'sc_hash_16', 3232227788, '2024-02-12', 1, 2),
('Julián', 'Marín', 'julian.m@gmail.com', 'sc_hash_17', 3241118899, '2024-02-15', 1, 1),
('Mónica', 'López', 'monica.l@gmail.com', 'sc_hash_18', 3250009900, '2024-02-18', 1, 2),
('Ricardo', 'Díaz', 'ricardo.d@gmail.com', 'sc_hash_19', 3009998877, '2024-02-20', 1, 1),
('Beatriz', 'Cano', 'bea.c@gmail.com', 'sc_hash_20', 3018887766, '2024-02-22', 1, 2),
('Hugo', 'Bermúdez', 'hugo.b@gmail.com', 'sc_hash_21', 3027776655, '2024-02-25', 1, 1),
('Clara', 'Pineda', 'clara.p@gmail.com', 'sc_hash_22', 3036665544, '2024-02-28', 1, 2),
('Samuel', 'Echeverri', 'samu.e@gmail.com', 'sc_hash_23', 3045554433, '2024-03-01', 1, 1),
('Jimena', 'Rojas', 'jime.r@gmail.com', 'sc_hash_24', 3054443322, '2024-03-03', 1, 2),
('Óscar', 'Navarro', 'oscar.n@gmail.com', 'sc_hash_25', 3063332211, '2024-03-05', 1, 1),
('Alicia', 'Suárez', 'alicia.s@gmail.com', 'sc_hash_26', 3072221100, '2024-03-08', 1, 2),
('Gabriel', 'Acosta', 'gabi.a@gmail.com', 'sc_hash_27', 3081110099, '2024-03-10', 1, 1),
('Lina', 'Ramírez', 'lina.r@gmail.com', 'sc_hash_28', 3090009988, '2024-03-12', 1, 2),
('Tomás', 'Orozco', 'tomas.o@gmail.com', 'sc_hash_29', 3109998877, '2024-03-15', 1, 1),
('Rosa', 'Murillo', 'rosa.m@gmail.com', 'sc_hash_30', 3118887766, '2024-03-18', 1, 2),
('Iván', 'Correa', 'ivan.c@gmail.com', 'sc_hash_31', 3127776655, '2024-03-20', 1, 1),
('Carmen', 'Hoyos', 'carmen.h@gmail.com', 'sc_hash_32', 3136665544, '2024-03-22', 1, 2),
('Luis', 'Arcila', 'luis.a@gmail.com', 'sc_hash_33', 3145554433, '2024-03-25', 1, 1),
('Marta', 'Bedoya', 'marta.b@gmail.com', 'sc_hash_34', 3154443322, '2024-03-28', 1, 2),
('Pablo', 'Cardona', 'pablo.c@gmail.com', 'sc_hash_35', 3163332211, '2024-04-01', 1, 1),
('Gloria', 'Duque', 'gloria.d@gmail.com', 'sc_hash_36', 3172221100, '2024-04-03', 1, 2),
('Jorge', 'Estrada', 'jorge.e@gmail.com', 'sc_hash_37', 3181110099, '2024-04-05', 1, 1),
('Inés', 'Franco', 'ines.f@gmail.com', 'sc_hash_38', 3190009988, '2024-04-08', 1, 2),
('Raúl', 'Gallego', 'raul.g@gmail.com', 'sc_hash_39', 3108887766, '2024-04-10', 1, 1),
('Silvia', 'Hincapié', 'silvia.h@gmail.com', 'sc_hash_40', 3117776655, '2024-04-12', 1, 2),
('Mario', 'Jaramillo', 'mario.j@gmail.com', 'sc_hash_41', 3126665544, '2024-04-15', 1, 1),
('Adriana', 'Kerguelén', 'adri.k@gmail.com', 'sc_hash_42', 3135554433, '2024-04-18', 1, 2),
('Víctor', 'León', 'victor.l@gmail.com', 'sc_hash_43', 3144443322, '2024-04-20', 1, 1),
('Patricia', 'Mejía', 'patri.m@gmail.com', 'sc_hash_44', 3153332211, '2024-04-22', 1, 2),
('César', 'Osorio', 'cesar.o@gmail.com', 'sc_hash_45', 3162221100, '2024-04-25', 1, 1),
('Ángela', 'Palacio', 'angie.p@gmail.com', 'sc_hash_46', 3171110099, '2024-04-28', 1, 2),
('Fabio', 'Quintero', 'fabio.q@gmail.com', 'sc_hash_47', 3180009988, '2024-05-01', 1, 1),
('Verónica', 'Restrepo', 'vero.r@gmail.com', 'sc_hash_48', 3198887766, '2024-05-03', 1, 2),
('Hernán', 'Serna', 'hernan.s@gmail.com', 'sc_hash_49', 3107776655, '2024-05-05', 1, 1),
('Luisa', 'Tamayo', 'luisa.t@gmail.com', 'sc_hash_50', 3116665544, '2024-05-08', 1, 2);

-- 3. PERFILES
INSERT INTO Perfiles (foto_perfil, descripcion, ocupacion, id_usuario)
VALUES
('p01.jpg', 'Obsesionado con la luz.', 'Fotógrafo', 1), ('p02.png', 'Pinto lo que siento.', 'Pintora', 2),
('p03.webp', 'Arquitecto de pixeles.', 'Dev', 3), ('p04.jpg', 'Capturando almas.', 'Fotógrafa', 4),
('p05.png', 'Líneas y sombras.', 'Ilustrador', 5), ('p06.jpg', 'Color y caribe.', 'Artista', 6),
('p07.jpg', 'Diseño gótico.', 'Diseñador', 7), ('p08.png', 'Minimalismo puro.', 'Fotógrafa', 8),
('p09.jpg', 'Curaduría moderna.', 'Curador', 9), ('p10.png', 'Dibujo a tinta.', 'Artista', 10),
('p11.jpg', 'Ritmos visuales.', 'Vj', 11), ('p12.png', 'Lienzos infinitos.', 'Pintora', 12),
('p13.webp', 'Cine y estética.', 'Cineasta', 13), ('p14.jpg', 'Murales urbanos.', 'Muralista', 14),
('p15.png', 'Escultura 3D.', 'Modelador', 15), ('p16.jpg', 'Moda editorial.', 'Diseñadora', 16),
('p17.png', 'Web y arte.', 'Designer', 17), ('p18.jpg', 'Naturaleza viva.', 'Fotógrafa', 18),
('p19.webp', 'Formas brutas.', 'Escultor', 19), ('p20.jpg', 'Expresión lírica.', 'Pintora', 20),
('p21.png', 'Calle y vida.', 'Fotógrafo', 21), ('p22.jpg', 'Historias mudas.', 'Ilustradora', 22),
('p23.png', 'Geometría.', 'Artista', 23), ('p24.jpg', 'Acuarela.', 'Pintora', 24),
('p25.webp', 'Arte efímero.', 'Tallerista', 25), ('p26.png', 'Retratista.', 'Dibujante', 26),
('p27.jpg', 'Sonidos.', 'Músico', 27), ('p28.png', 'Bronce.', 'Escultora', 28),
('p29.webp', 'Noche.', 'Fotógrafo', 29), ('p30.jpg', 'Pigmentos.', 'Artesana', 30),
('p31.png', 'Retro.', 'Ilustrador', 31), ('p32.jpg', 'Flora.', 'Fotógrafa', 32),
('p33.webp', 'Futurismo.', 'Diseñador', 33), ('p34.png', 'Barro.', 'Alfarera', 34),
('p35.jpg', 'Urbano.', 'Fotógrafo', 35), ('p36.png', 'Bodegón.', 'Pintora', 36),
('p37.webp', 'Teoría.', 'Estudiante', 37), ('p38.jpg', 'Papel.', 'Artista', 38),
('p39.png', 'Historia.', 'Historiador', 39), ('p40.jpg', 'Pop Art.', 'Artista', 40),
('p41.webp', 'Anatomía.', 'Profesor', 41), ('p42.png', 'Textil.', 'Diseñadora', 42),
('p43.jpg', 'Técnico.', 'Dibujante', 43), ('p44.png', 'Tejidos.', 'Tejedora', 44),
('p45.webp', 'Graffiti.', 'Urbano', 45), ('p46.jpg', 'Libros.', 'Ilustradora', 46),
('p47.png', 'Metales.', 'Escultor', 47), ('p48.jpg', 'Performance.', 'Performer', 48),
('p49.webp', 'Grabado.', 'Grabador', 49), ('p50.png', 'Video.', 'Audiovisual', 50);

-- 4. CATEGORIAS
INSERT INTO Categorias (nombreCategoria, descripcion)
VALUES
('Escultura', 'Obras 3D.'), ('Pintura', 'Lienzos.'), ('Música', 'Audio.'),
('Cine', 'Video.'), ('Fotografía', 'Luz.'), ('Arte Digital', 'Software.'),
('Arte Urbano', 'Calle.'), ('Animación', 'Movimiento.'), ('Diseño Gráfico', 'Visual.'),
('Teatro', 'Escénica.'), ('Literatura', 'Poesía.'), ('Danza', 'Cuerpo.'),
('Moda', 'Vestuario.'), ('Arquitectura', 'Espacios.'), ('Ilustración', 'Concepto.'),
('Arte Conceptual', 'Ideas.');

-- 5. PUBLICACIONES (50 registros únicos)
INSERT INTO Publicaciones (titulo, contenido, descripcion, estado, id_categoria, id_usuario_artista)
VALUES
('Selva Viva', 'v1.jpg', 'Amazonas.', 1, 2, 2), ('Montaña', 'v2.png', 'Andes.', 1, 5, 4),
('Eco', 'v3.mp3', 'Sueño.', 1, 3, 6), ('Barrio', 'v4.jpg', 'Mural.', 1, 7, 6),
('Hierro', 'v5.webp', 'Forja.', 1, 1, 8), ('Luz', 'v6.png', 'Sombra.', 1, 5, 10),
('Ciudad', 'v7.mp4', 'Loop.', 1, 4, 12), ('Caos', 'v8.jpg', 'Óleo.', 1, 2, 14),
('Bogotá', 'v9.png', 'Cyber.', 1, 6, 16), ('Páramo', 'v10.jpg', 'Frío.', 1, 5, 18),
('Cristal', 'v11.webp', 'Frágil.', 1, 1, 20), ('Memoria', 'v12.png', 'Tinta.', 1, 15, 22),
('Latido', 'v13.wav', 'Tambor.', 1, 3, 24), ('Vuelo', 'v14.jpg', 'Macro.', 1, 5, 26),
('Pixel', 'v15.png', 'Retro.', 1, 6, 28), ('Mar', 'v16.jpg', 'Olas.', 1, 2, 30),
('Brutal', 'v17.webp', 'Gris.', 1, 14, 32), ('Versos', 'v18.pdf', 'Libro.', 1, 11, 34),
('Error', 'v19.png', 'Glitch.', 1, 6, 36), ('Café', 'v20.jpg', 'Grano.', 1, 16, 38),
('Pasos', 'v21.mp4', 'Baile.', 1, 12, 40), ('Zócalo', 'v22.png', '3D.', 1, 6, 42),
('Tierra', 'v23.jpg', 'Telar.', 1, 13, 44), ('Barro', 'v24.webp', 'Mitos.', 1, 1, 46),
('Embera', 'v25.ai', 'Vector.', 1, 9, 48), ('Playa', 'v26.png', 'Foto.', 1, 5, 50),
('Acero', 'v27.jpg', 'Metal.', 1, 1, 2), ('Centro', 'v28.png', 'Sketch.', 1, 2, 4),
('Bosque', 'v29.ogg', 'Audio.', 1, 3, 6), ('Noche', 'v30.jpg', 'Luces.', 1, 5, 8),
('Utopía', 'v31.webp', 'Mundo.', 1, 6, 10), ('Gesto', 'v32.png', 'Cuerpo.', 1, 15, 12),
('Cero', 'v33.mp4', 'VFX.', 1, 8, 14), ('Flores', 'v34.jpg', 'Calle.', 1, 5, 16),
('Nubes', 'v35.png', 'Idea.', 1, 16, 18), ('Ocre', 'v36.jpg', 'Arte.', 1, 2, 20),
('Raíz', 'v37.webp', 'Obra.', 1, 1, 22), ('Tinta', 'v38.png', 'Trazo.', 1, 15, 24),
('Planos', 'v39.jpg', 'Casa.', 1, 14, 26), ('Cielo', 'v40.png', 'Rojo.', 1, 5, 28),
('Espacio', 'v41.webp', '3D.', 1, 6, 30), ('Coral', 'v42.mp3', 'Voz.', 1, 3, 32),
('Teatro', 'v43.mp4', 'Obra.', 1, 10, 34), ('Macro', 'v44.jpg', 'Ala.', 1, 5, 36),
('Muro', 'v45.png', 'Spray.', 1, 7, 38), ('Vidrio', 'v46.jpg', 'Luz.', 1, 1, 40),
('Leño', 'v47.webp', 'Casa.', 1, 14, 42), ('Bokeh', 'v48.png', 'Luz.', 1, 5, 44),
('Océano', 'v49.jpg', 'Azul.', 1, 2, 46), ('Ruido', 'v50.wav', 'Asfalto.', 1, 3, 48);

-- 6. COMENTARIOS
INSERT INTO Comentarios (contenido, id_usuario_final, id_publicacion)
VALUES
('Genial color.', 1, 1), ('Mucha paz.', 3, 2), ('Buen sonido.', 5, 3),
('Increíble muro.', 7, 4), ('Buen metal.', 9, 5), ('Luz top.', 11, 6),
('Gran video.', 13, 7), ('Qué textura.', 15, 8), ('Futurista.', 17, 9),
('Hermoso.', 19, 10), ('Original.', 21, 11), ('Buen dibujo.', 23, 12),
('Ritmo top.', 25, 13), ('Foto pro.', 27, 14), ('Amo el pixel.', 29, 15),
('Siento el mar.', 31, 16), ('Gris potente.', 33, 17), ('Poético.', 35, 18),
('Impacta.', 37, 19), ('Huele a café.', 39, 20), ('Gran baile.', 41, 21),
('Buen 3D.', 43, 22), ('Qué tejido.', 45, 23), ('Tradición.', 47, 24),
('Hipnótico.', 49, 25), ('Luz bella.', 1, 26), ('Brilla mucho.', 3, 27),
('Elegante.', 5, 28), ('Audio real.', 7, 29), ('Noche pro.', 9, 30),
('Sólido.', 11, 31), ('Fuerza.', 13, 32), ('Fluido.', 15, 33),
('Realista.', 17, 34), ('Visual.', 19, 35), ('Energía.', 21, 36),
('Potente.', 23, 37), ('Tinta pro.', 25, 38), ('Técnico.', 27, 39),
('Cielo top.', 29, 40), ('Infinito.', 31, 41), ('Voz pro.', 33, 42),
('Escena top.', 35, 43), ('Simetría.', 37, 44), ('Mensaje.', 39, 45),
('Vibrante.', 41, 46), ('Rústico.', 43, 47), ('Detalle.', 45, 48),
('Óleo top.', 47, 49), ('Urbano.', 49, 50);

-- 7. REACCIONES
INSERT INTO Reacciones (tipo, id_usuario, id_publicacion)
VALUES ('Me gusta', 1, 1), ('Me gusta', 3, 2), ('Me gusta', 5, 3), ('Me gusta', 7, 4),
('Me gusta', 9, 5), ('Me gusta', 11, 6), ('Me gusta', 13, 7), ('Me gusta', 15, 8),
('Me gusta', 17, 9), ('Me gusta', 19, 10), ('Me gusta', 21, 11), ('Me gusta', 23, 12),
('Me gusta', 25, 13), ('Me gusta', 27, 14), ('Me gusta', 29, 15), ('Me gusta', 31, 16),
('Me gusta', 33, 17), ('Me gusta', 35, 18), ('Me gusta', 37, 19), ('Me gusta', 39, 20),
('Me gusta', 41, 21), ('Me gusta', 43, 22), ('Me gusta', 45, 23), ('Me gusta', 47, 24),
('Me gusta', 49, 25), ('Me gusta', 2, 26), ('Me gusta', 4, 27), ('Me gusta', 6, 28),
('Me gusta', 8, 29), ('Me gusta', 10, 30), ('Me gusta', 12, 31), ('Me gusta', 14, 32),
('Me gusta', 16, 33), ('Me gusta', 18, 34), ('Me gusta', 20, 35), ('Me gusta', 22, 36),
('Me gusta', 24, 37), ('Me gusta', 26, 38), ('Me gusta', 28, 39), ('Me gusta', 30, 40),
('Me gusta', 32, 41), ('Me gusta', 34, 42), ('Me gusta', 36, 43), ('Me gusta', 38, 44),
('Me gusta', 40, 45), ('Me gusta', 42, 46), ('Me gusta', 44, 47), ('Me gusta', 46, 48),
('Me gusta', 48, 49), ('Me gusta', 50, 50);

-- 8. NOTIFICACIONES ('Informativo', 'Mensaje', 'Reaccion', 'Comentario')
INSERT INTO Notificaciones (asunto, tipo_notificacion, id_usuario)
VALUES
('Bienvenida', 'Informativo', 1), ('Nuevo Chat', 'Mensaje', 2), ('Gusta', 'Reaccion', 3), ('Comento', 'Comentario', 4),
('Info', 'Informativo', 5), ('Chat', 'Mensaje', 6), ('Like', 'Reaccion', 7), ('Nota', 'Comentario', 8),
('Mantenimiento', 'Informativo', 9), ('Texto', 'Mensaje', 10), ('Corazón', 'Reaccion', 11), ('Opinión', 'Comentario', 12),
('Aviso', 'Informativo', 13), ('Respuesta', 'Mensaje', 14), ('Fan', 'Reaccion', 15), ('Review', 'Comentario', 16),
('Evento', 'Informativo', 17), ('Inbox', 'Mensaje', 18), ('Fuego', 'Reaccion', 19), ('Debate', 'Comentario', 20),
('Verificado', 'Informativo', 21), ('DM', 'Mensaje', 22), ('Like!', 'Reaccion', 23), ('Pregunta', 'Comentario', 24),
('Tip', 'Informativo', 25), ('Escrito', 'Mensaje', 26), ('Plus', 'Reaccion', 27), ('Chat Art', 'Comentario', 28),
('Update', 'Informativo', 29), ('Ping', 'Mensaje', 30), ('Applause', 'Reaccion', 31), ('Crítica', 'Comentario', 32),
('News', 'Informativo', 33), ('Directo', 'Mensaje', 34), ('Fav', 'Reaccion', 35), ('Punto', 'Comentario', 36),
('Config', 'Informativo', 37), ('Cliente', 'Mensaje', 38), ('Reacción', 'Reaccion', 39), ('Idea', 'Comentario', 40),
('Reporte', 'Informativo', 41), ('Alerta', 'Mensaje', 42), ('Interés', 'Reaccion', 43), ('Feedback', 'Comentario', 44),
('Guía', 'Informativo', 45), ('Aviso DM', 'Mensaje', 46), ('Star', 'Reaccion', 47), ('Charla', 'Comentario', 48),
('Activo', 'Informativo', 49), ('Mensaje Art', 'Mensaje', 50);

-- 9. SOLICITUDES (tipoSolicitud: 'Verificacion', 'Artista' | estadoSolicitud: 'Aceptada', 'Rechazada', 'Pendiente')
INSERT INTO Solicitudes (tipoSolicitud, estadoSolicitud, id_usuario)
VALUES
('Verificacion', 'Pendiente', 1), ('Artista', 'Aceptada', 2), ('Verificacion', 'Rechazada', 3), ('Artista', 'Pendiente', 4),
('Verificacion', 'Aceptada', 5), ('Artista', 'Rechazada', 6), ('Verificacion', 'Pendiente', 7), ('Artista', 'Aceptada', 8),
('Verificacion', 'Rechazada', 9), ('Artista', 'Pendiente', 10), ('Verificacion', 'Aceptada', 11), ('Artista', 'Rechazada', 12),
('Verificacion', 'Pendiente', 13), ('Artista', 'Aceptada', 14), ('Verificacion', 'Rechazada', 15), ('Artista', 'Pendiente', 16),
('Verificacion', 'Aceptada', 17), ('Artista', 'Rechazada', 18), ('Verificacion', 'Pendiente', 19), ('Artista', 'Aceptada', 20),
('Verificacion', 'Rechazada', 21), ('Artista', 'Pendiente', 22), ('Verificacion', 'Aceptada', 23), ('Artista', 'Rechazada', 24),
('Verificacion', 'Pendiente', 25), ('Artista', 'Aceptada', 26), ('Verificacion', 'Rechazada', 27), ('Artista', 'Pendiente', 28),
('Verificacion', 'Aceptada', 29), ('Artista', 'Rechazada', 30), ('Verificacion', 'Pendiente', 31), ('Artista', 'Aceptada', 32),
('Verificacion', 'Rechazada', 33), ('Artista', 'Pendiente', 34), ('Verificacion', 'Aceptada', 35), ('Artista', 'Rechazada', 36),
('Verificacion', 'Pendiente', 37), ('Artista', 'Aceptada', 38), ('Verificacion', 'Rechazada', 39), ('Artista', 'Pendiente', 40),
('Verificacion', 'Aceptada', 41), ('Artista', 'Rechazada', 42), ('Verificacion', 'Pendiente', 43), ('Artista', 'Aceptada', 44),
('Verificacion', 'Rechazada', 45), ('Artista', 'Pendiente', 46), ('Verificacion', 'Aceptada', 47), ('Artista', 'Rechazada', 48),
('Verificacion', 'Pendiente', 49), ('Artista', 'Aceptada', 50);

-- 10. CONVERSACIONES
INSERT INTO Conversaciones (fechaCreacion) VALUES 
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()), (NOW()),
(NOW()), (NOW()), (NOW()), (NOW()), (NOW());

-- 11. PARTICIPANTES
INSERT INTO Participantes (id_conversacion, id_usuario) 
VALUES 
(1,1), (1,2), (2,3), (2,4), (3,5), (3,6), (4,7), (4,8), (5,9), (5,10),
(6,11), (6,12), (7,13), (7,14), (8,15), (8,16), (9,17), (9,18), (10,19), (10,20),
(11,21), (11,22), (12,23), (12,24), (13,25), (13,26), (14,27), (14,28), (15,29), (15,30),
(16,31), (16,32), (17,33), (17,34), (18,35), (18,36), (19,37), (19,38), (20,39), (20,40),
(21,41), (21,42), (22,43), (22,44), (23,45), (23,46), (24,47), (24,48), (25,49), (25,50);

-- 12. MENSAJES
INSERT INTO Mensajes (contenido, id_conversacion, id_usuario)
VALUES
('Hola, ¿comisión?', 1, 1), ('Sí, dime.', 1, 2),
('Lindo cuadro.', 2, 3), ('Gracias!', 2, 4),
('¿Técnica?', 3, 5), ('Óleo.', 3, 6),
('¿Envío?', 4, 7), ('Sí, Medellín.', 4, 8),
('¿Precio?', 5, 9), ('Te escribo.', 5, 10),
('M11', 6, 11), ('M12', 6, 12), ('M13', 7, 13), ('M14', 7, 14), ('M15', 8, 15),
('M16', 8, 16), ('M17', 9, 17), ('M18', 9, 18), ('M19', 10, 19), ('M20', 10, 20),
('M21', 11, 21), ('M22', 11, 22), ('M23', 12, 23), ('M24', 12, 24), ('M25', 13, 25),
('M26', 13, 26), ('M27', 14, 27), ('M28', 14, 28), ('M29', 15, 29), ('M30', 15, 30),
('M31', 16, 31), ('M32', 16, 32), ('M33', 17, 33), ('M34', 17, 34), ('M35', 18, 35),
('M36', 18, 36), ('M37', 19, 37), ('M38', 19, 38), ('M39', 20, 39), ('M40', 20, 40),
('M41', 21, 41), ('M42', 21, 42), ('M43', 22, 43), ('M44', 22, 44), ('M45', 23, 45),
('M46', 23, 46), ('M47', 24, 47), ('M48', 24, 48), ('M49', 25, 49), ('M50', 25, 50);
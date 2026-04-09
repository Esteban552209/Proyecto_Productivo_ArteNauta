use artenauta;

-- CONSULTAS SENCILLAS
-- Listar todos los artistas activos
SELECT nombre, apellido FROM Usuarios WHERE id_rol = 2 AND estado_cuenta = 1;

-- Ver las categorías disponibles
SELECT nombreCategoria FROM Categorias ORDER BY nombreCategoria ASC;

-- Contar cuántos usuarios totales hay
SELECT COUNT(*) AS total_usuarios FROM Usuarios;

-- Buscar publicaciones de una categoría específica (ej. id 2)
SELECT titulo, descripcion FROM Publicaciones WHERE id_categoria = 2;

-- Ver las solicitudes que están "Pendientes"
SELECT * FROM Solicitudes WHERE estadoSolicitud = 'Pendiente';

-- Listar usuarios registrados en una fecha específica
SELECT nombre, email FROM Usuarios WHERE fecha_registro >= '2024-01-01';

-- Ver los nombres de los roles existentes
SELECT DISTINCT nombre_rol FROM Roles;

-- Obtener el perfil de un usuario por su ID
SELECT ocupacion, descripcion FROM Perfiles WHERE id_usuario = 1;

-- Contar cuántas reacciones tiene una publicación específica
SELECT COUNT(*) FROM Reacciones WHERE id_publicacion = 1;

-- Listar las notificaciones de tipo 'Mensaje'
SELECT asunto, fecha_notificacion FROM Notificaciones WHERE tipo_notificacion = 'Mensaje';

-- JOINS
-- Mostrar publicaciones con el nombre del artista y su categoría
SELECT p.titulo, u.nombre, c.nombreCategoria FROM Publicaciones p 
JOIN Usuarios u ON p.id_usuario_artista = u.id_usuario 
JOIN Categorias c ON p.id_categoria = c.id_categoria;

-- Ver todos los comentarios de una publicación junto con el nombre de quien comentó
SELECT c.contenido, u.nombre FROM Comentarios c 
JOIN Usuarios u ON c.id_usuario_final = u.id_usuario 
WHERE c.id_publicacion = 1;

-- Listar usuarios y el nombre de su Rol
SELECT u.nombre, r.nombre_rol FROM Usuarios u 
JOIN Roles r ON u.id_rol = r.id_rol;

-- Ver los mensajes de una conversación con el nombre del remitente
SELECT m.contenido, u.nombre FROM Mensajes m 
JOIN Usuarios u ON m.id_usuario = u.id_usuario 
WHERE m.id_conversacion = 1;

-- Obtener el perfil completo de un artista (Usuario + Perfil)
SELECT u.nombre, p.foto_perfil, p.ocupacion FROM Usuarios u 
LEFT JOIN Perfiles p ON u.id_usuario = p.id_usuario 
WHERE u.id_rol = 2;

-- Listar reacciones indicando qué usuario reaccionó y a qué obra
SELECT u.nombre, p.titulo, r.tipo FROM Reacciones r 
JOIN Usuarios u ON r.id_usuario = u.id_usuario 
JOIN Publicaciones p ON r.id_publicacion = p.id_publicacion;

-- Ver qué participantes están en cada conversación
SELECT c.id_conversacion, u.nombre FROM Participantes p 
JOIN Conversaciones c ON p.id_conversacion = c.id_conversacion 
JOIN Usuarios u ON p.id_usuario = u.id_usuario;

-- Listar solicitudes junto con el correo del usuario que la pidió
SELECT s.tipoSolicitud, u.email FROM Solicitudes s 
JOIN Usuarios u ON s.id_usuario = u.id_usuario;

-- Mostrar el total de publicaciones por cada categoría
SELECT c.nombreCategoria, COUNT(p.id_publicacion) FROM Categorias c 
LEFT JOIN Publicaciones p ON c.id_categoria = p.id_categoria 
GROUP BY c.nombreCategoria;

-- Ver las notificaciones de un usuario específico por su nombre
SELECT n.asunto FROM Notificaciones n 
JOIN Usuarios u ON n.id_usuario = u.id_usuario 
WHERE u.nombre = 'Juan';

-- SUBCONSULTAS
-- El artista con más publicaciones (El más activo)
SELECT nombre, apellido FROM Usuarios 
WHERE id_usuario = (SELECT id_usuario_artista FROM Publicaciones 
GROUP BY id_usuario_artista ORDER BY COUNT(*) DESC LIMIT 1);

-- Publicaciones que no han recibido ningún comentario
SELECT titulo FROM Publicaciones 
WHERE id_publicacion NOT IN (SELECT id_publicacion FROM Comentarios);

-- Usuarios que tienen el rol de 'Administrador' 
SELECT nombre FROM Usuarios 
WHERE id_rol = (SELECT id_rol FROM Roles WHERE nombre_rol = 'Administrador');

-- La publicación que tiene más likes
SELECT titulo FROM Publicaciones 
WHERE id_publicacion = (SELECT id_publicacion FROM Reacciones 
WHERE tipo = 'Me gusta' GROUP BY id_publicacion ORDER BY COUNT(*) DESC LIMIT 1);

-- Usuarios que han hecho más de 5 comentarios
SELECT nombre FROM Usuarios 
WHERE id_usuario IN (SELECT id_usuario_final FROM Comentarios 
GROUP BY id_usuario_final HAVING COUNT(*) > 5);

-- Artistas que pertenecen a la categoría 'Escultura'
SELECT nombre FROM Usuarios 
WHERE id_usuario IN (SELECT id_usuario_artista FROM Publicaciones 
WHERE id_categoria = (SELECT id_categoria FROM Categorias WHERE nombreCategoria = 'Escultura'));

-- Última notificación recibida por el usuario 1
SELECT asunto FROM Notificaciones 
WHERE id_notificacion = (SELECT MAX(id_notificacion) FROM Notificaciones WHERE id_usuario = 1);

-- Categoría con menos de 2 publicaciones
SELECT nombreCategoria FROM Categorias 
WHERE id_categoria IN (SELECT id_categoria FROM Publicaciones 
GROUP BY id_categoria HAVING COUNT(*) < 2);

-- Usuarios que nunca han enviado un mensaje
SELECT nombre FROM Usuarios WHERE id_usuario NOT IN (SELECT id_usuario FROM Mensajes);

-- Encontrar la obra con el ID de comentario más reciente
SELECT titulo FROM Publicaciones 
WHERE id_publicacion = (SELECT id_publicacion FROM Comentarios 
ORDER BY fecha_comentario DESC LIMIT 1);
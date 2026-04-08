CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_crear_publicacion`(
    IN p_titulo VARCHAR(45),
    IN p_contenido VARCHAR(255),
    IN p_descripcion VARCHAR(250),
    IN p_id_categoria INT,
    IN p_id_artista INT
)
BEGIN
    INSERT INTO Publicaciones (titulo, contenido, descripcion, id_categoria, id_usuario_artista)
    VALUES (p_titulo, p_contenido, p_descripcion, p_id_categoria, p_id_artista);
    
    SELECT LAST_INSERT_ID() as id_nueva_publicacion;
END
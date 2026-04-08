CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_eliminar_publicacion`(
    IN p_id_publicacion INT,
    IN p_id_artista INT -- Por seguridad: solo el dueño puede borrar
)
BEGIN
    DELETE FROM Publicaciones 
    WHERE id_publicacion = p_id_publicacion AND id_usuario_artista = p_id_artista;
    
    IF ROW_COUNT() > 0 THEN
        SELECT TRUE as success, 'Publicación eliminada' as mensaje;
    ELSE
        SELECT FALSE as success, 'No se encontró la publicación o no tienes permiso' as mensaje;
    END IF;
END
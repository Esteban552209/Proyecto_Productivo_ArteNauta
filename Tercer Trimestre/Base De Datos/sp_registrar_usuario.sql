CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_registrar_usuario_artenauta`(
    IN p_nombre VARCHAR(45),
    IN p_apellido VARCHAR(45),
    IN p_email VARCHAR(80),
    IN p_password VARCHAR(250),
    IN p_telefono VARCHAR(20), 
    IN p_nombre_rol VARCHAR(20),
    IN p_ocupacion VARCHAR(40)
)
BEGIN
    DECLARE v_id_usuario INT;
    DECLARE v_id_rol INT;
    DECLARE v_password_hash VARCHAR(255);
    
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT FALSE as success, 'Error en el registro. Email duplicado o datos inválidos.' as mensaje;
    END;

    START TRANSACTION;
        -- Obtener ID del Rol
        SELECT id_rol INTO v_id_rol FROM Roles WHERE nombre_rol = p_nombre_rol LIMIT 1;
        
        -- Encriptar
        CALL sp_encriptar_password(p_password, v_password_hash);
        
        -- Insertar en Usuarios
        INSERT INTO Usuarios (nombre, apellido, email, clave, telefono, id_rol, estado_cuenta)
        VALUES (p_nombre, p_apellido, p_email, v_password_hash, p_telefono, v_id_rol, TRUE);
        
        SET v_id_usuario = LAST_INSERT_ID();
        
        -- Crear Perfil básico automáticamente
        INSERT INTO Perfiles (ocupacion, id_usuario, descripcion)
        VALUES (p_ocupacion, v_id_usuario, '¡Hola! Soy nuevo en Artenauta.');
        
    COMMIT;
    SELECT TRUE as success, 'Usuario y Perfil creados correctamente' as mensaje, v_id_usuario as id;
END
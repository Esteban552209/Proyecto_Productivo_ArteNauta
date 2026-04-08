CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_encriptar_password`(
    IN p_password VARCHAR(250),
    OUT p_password_hash VARCHAR(250)
)
BEGIN
    DECLARE v_salt VARCHAR(64);
    DECLARE v_hash_combinado VARCHAR(128);
    
    IF p_password IS NULL OR p_password = '' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'La contraseña no puede estar vacía';
    END IF;
    
    SET v_salt = SHA2(CONCAT(UUID(), NOW()), 251);
    SET v_hash_combinado = SHA2(CONCAT(p_password, v_salt), 251);
    SET p_password_hash = CONCAT(v_salt, ':', v_hash_combinado);
END
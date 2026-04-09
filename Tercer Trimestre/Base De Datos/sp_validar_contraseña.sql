CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_validar_password`(
    IN p_password_intento VARCHAR(255),
    IN p_password_hash_almacenado VARCHAR(255),
    OUT p_es_valida BOOLEAN
)
BEGIN
    DECLARE v_salt_almacenado VARCHAR(64);
    DECLARE v_hash_almacenado VARCHAR(128);
    DECLARE v_hash_calculado VARCHAR(128);
    
    -- Extraemos el salt (lo que está antes de los :)
    SET v_salt_almacenado = SUBSTRING_INDEX(p_password_hash_almacenado, ':', 1);
    -- Extraemos el hash (lo que está después de los :)
    SET v_hash_almacenado = SUBSTRING_INDEX(p_password_hash_almacenado, ':', -1);
    
    -- Calculamos el hash con lo que el usuario escribió
    SET v_hash_calculado = SHA2(CONCAT(p_password_intento, v_salt_almacenado), 256);
    
    -- Comparamos
    IF v_hash_calculado = v_hash_almacenado THEN
        SET p_es_valida = TRUE;
    ELSE
        SET p_es_valida = FALSE;
    END IF;
END
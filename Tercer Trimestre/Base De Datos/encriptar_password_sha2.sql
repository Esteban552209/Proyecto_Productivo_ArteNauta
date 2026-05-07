CREATE DEFINER=`root`@`localhost` PROCEDURE `p_encriptar_password_sha2`(
    IN  p_password       VARCHAR(255),
    OUT p_password_hash  VARCHAR(255)
)
BEGIN
    DECLARE v_salt           VARCHAR(64);
    DECLARE v_hash_combinado VARCHAR(128);
    DECLARE v_uuid           VARCHAR(36);

    IF p_password IS NULL OR TRIM(p_password) = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'La contraseña no puede estar vacía';
    END IF;

    SET v_uuid = UUID();
    SET v_salt = SHA2(CONCAT(v_uuid, NOW()), 256);
    SET v_hash_combinado = SHA2(CONCAT(p_password, v_salt), 256);
    SET p_password_hash = CONCAT(v_salt, ':', v_hash_combinado);
END
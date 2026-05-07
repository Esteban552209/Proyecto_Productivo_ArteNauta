Use Artenauta;

-- PASO 1: Encriptar contraseña y guardarla en la BD

SET @email_usuario  = 'juan1@gmail.com';   
SET @password_plain = '1234';              

-- Encriptar
CALL p_encriptar_password_sha2(@password_plain, @hash_generado);

-- Actualizar la clave del usuario con el hash generado
UPDATE Usuarios
SET clave = @hash_generado
WHERE email = @email_usuario;

SELECT 
    @email_usuario   AS usuario,
    @hash_generado   AS hash_guardado;


-- PASO 2: Validar la contraseña contra la BD

SET @password_probar = '1234';   

-- Recuperar el hash almacenado para ese usuario
SELECT clave
INTO @hash_almacenado
FROM Usuarios
WHERE email = @email_usuario
LIMIT 1;

-- Llamar al procedimiento de validación
SET @resultado = FALSE;
CALL p_validar_password_sha2(@password_probar, @hash_almacenado, @resultado);


-- PASO 3: Mostrar resultado final

SELECT 
    @email_usuario   AS usuario,
    @password_probar AS contrasena_probada,
    @resultado       AS es_valida,
    CASE @resultado 
        WHEN 1 THEN 'CONTRASEÑA CORRECTA'
        WHEN 0 THEN 'CONTRASEÑA INCORRECTA'
    END AS resultado_legible;


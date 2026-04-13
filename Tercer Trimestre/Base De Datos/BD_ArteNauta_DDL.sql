CREATE DATABASE artenauta;
USE artenauta;

CREATE TABLE Roles (
	id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol ENUM('Usuario_Final', 'Artista', 'Administrador')
);

CREATE TABLE Usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    email VARCHAR(80) UNIQUE NOT NULL,
    clave VARCHAR(250) NOT NULL,
    telefono bigint,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado_cuenta BOOLEAN,
    id_rol int,

        
	FOREIGN KEY (id_rol)
        REFERENCES Roles(id_rol)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);

CREATE TABLE Perfiles (
    id_perfil INT AUTO_INCREMENT PRIMARY KEY,
    foto_perfil VARCHAR(255),
    descripcion VARCHAR(255),
    ocupacion VARCHAR(40) NOT NULL,
    id_usuario int,
    
    
    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Categorias (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombreCategoria VARCHAR(50) UNIQUE NOT NULL,
    descripcion VARCHAR(250) NOT NULL
);

CREATE TABLE Publicaciones (
    id_publicacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(45) NOT NULL,
    contenido VARCHAR(255),
    descripcion VARCHAR(250) NOT NULL,
    fechaPublicacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    estado BOOLEAN DEFAULT TRUE,
    id_categoria INT,
    id_usuario_artista INT,

    FOREIGN KEY (id_categoria)
        REFERENCES Categorias(id_categoria)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_usuario_artista)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Reacciones (
    id_reaccion INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipo ENUM('Me gusta', 'Me encanta') NOT NULL,
    id_usuario INT,
    id_publicacion INT,

    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    FOREIGN KEY (id_publicacion)
        REFERENCES Publicaciones(id_publicacion)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Comentarios (
    id_comentario INT AUTO_INCREMENT PRIMARY KEY,
    contenido VARCHAR(255) NOT NULL,
    fecha_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_Publicacion INT,
    id_usuario_final INT,

    FOREIGN KEY (id_publicacion)
        REFERENCES Publicaciones(id_publicacion)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	    FOREIGN KEY (id_usuario_final)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);


CREATE TABLE Conversaciones (
    id_conversacion INT AUTO_INCREMENT PRIMARY KEY,
    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Participantes (
    id_participante INT AUTO_INCREMENT PRIMARY KEY,
	id_conversacion int,
    id_usuario int,
    
		foreign key (id_conversacion) 
        references Conversaciones(id_conversacion)
        on delete cascade
		on update cascade,
        
		foreign key (id_usuario) 
        references Usuarios(id_usuario)
        on delete cascade
        on update cascade
);

CREATE TABLE Solicitudes (
    id_solicitud INT AUTO_INCREMENT PRIMARY KEY,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    tipoSolicitud ENUM('Verificacion', 'Artista'),
    estadoSolicitud ENUM('Aceptada', 'Rechazada', 'Pendiente'),
    id_usuario INT,

    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);

CREATE TABLE Mensajes (
    id_mensaje INT AUTO_INCREMENT PRIMARY KEY,
    contenido VARCHAR(255) NOT NULL,
    fecha_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_conversacion INT,
    id_usuario int,

    FOREIGN KEY (id_conversacion)
        REFERENCES Conversaciones(id_conversacion)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
        
	 FOREIGN KEY (id_usuario)
        REFERENCES Usuarios (id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE Notificaciones (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    asunto VARCHAR(255) NOT NULL,
    tipo_notificacion ENUM('Informativo', 'Mensaje', 'Reaccion', 'Comentario'),
    fecha_notificacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT,
    
    FOREIGN KEY (id_usuario)
        REFERENCES Usuarios(id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
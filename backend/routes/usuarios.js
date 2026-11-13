import express from "express";
import bcrypt from 'bcrypt';
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// PETICION POST REGISTRO DE USUARIOS
router.post('/usuario/registro', async (req, res) => {
    const { nombre, apellido, telefono, email, clave, id_rol } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(clave, saltRounds);
        
        const querySql = `
            INSERT INTO usuarios (nombre, apellido, telefono, email, clave, id_rol) 
            VALUES ($1, $2, $3, $4, $5, $6)
        `;
        await pool.query(querySql, [nombre, apellido, telefono, email, hashedPassword, id_rol]);

        res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });

    } catch (error) {
        console.error("Error en el registro del backend:", error);
        res.status(500).json({ error: error.message || 'Hubo un error al registrar el usuario' });
    }
});

// PETICIÓN QUERY USUARIOS: ESTADO, BÚSQUEDA Y ROL
router.get("/usuarios", verificarToken, async (req, res) => {
    try {
        const { estado, buscar, rol } = req.query;

        let querySql = `
            SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.estado_cuenta, u.id_rol, u.fecha_registro,
                   json_build_object(
                       'id_rol', r.id_rol, 
                       'nombre_rol', r.nombre_rol
                   ) AS roles
            FROM usuarios u
            LEFT JOIN roles r ON u.id_rol = r.id_rol
            WHERE 1=1
        `;
        let queryParams = [];
        let paramIndex = 1;

        // Filtro por estado
        if (estado === "true") {
            querySql += ` AND u.estado_cuenta = true`;
        } else if (estado === "false") {
            querySql += ` AND u.estado_cuenta = false`;
        }

        if (buscar && buscar.trim() !== "") {
            querySql += ` AND (u.nombre ILIKE $${paramIndex} OR u.apellido ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
            queryParams.push(`%${buscar}%`);
            paramIndex++;
        }

        if (rol && rol.trim() !== "") {
            querySql += ` AND u.id_rol = $${paramIndex}`;
            queryParams.push(rol);
            paramIndex++;
        }

        querySql += " ORDER BY u.id_usuario ASC";

        const result = await pool.query(querySql, queryParams);

        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PETICIÓN PATCH USUARIOS
router.patch("/usuarios/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, estado_cuenta, id_rol } = req.body;
o
        const querySql = `
            WITH updated AS (
                UPDATE usuarios 
                SET nombre = $1, apellido = $2, estado_cuenta = $3, id_rol = $4
                WHERE id_usuario = $5
                RETURNING id_usuario, nombre, apellido, email, estado_cuenta, id_rol, fecha_registro
            )
            SELECT u.*, 
                   json_build_object(
                       'nombre_rol', r.nombre_rol
                   ) AS roles
            FROM updated u
            LEFT JOIN roles r ON u.id_rol = r.id_rol;
        `;
        
        const queryParams = [nombre, apellido, estado_cuenta, parseInt(id_rol), id];
        const result = await pool.query(querySql, queryParams);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
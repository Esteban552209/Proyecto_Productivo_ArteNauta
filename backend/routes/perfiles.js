import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET: obtener el perfil completo del usuario autenticado (usuario + perfil, si existe)
router.get("/perfil", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;

        const querySql = `
            SELECT u.id_usuario, u.nombre, u.apellido, u.email, u.telefono,
                   p.foto_perfil, p.descripcion, p.ocupacion
            FROM usuarios u
            LEFT JOIN perfiles p ON u.id_usuario = p.id_usuario
            WHERE u.id_usuario = $1
        `;

        const result = await pool.query(querySql, [id_usuario]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const data = result.rows[0];

        res.status(200).json({
            id_usuario: data.id_usuario,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono,
            foto_perfil: data.foto_perfil ?? null,
            descripcion: data.descripcion ?? "",
            ocupacion: data.ocupacion ?? "",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH: crear o actualizar el perfil extendido del usuario
router.patch("/perfil", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const { descripcion, ocupacion } = req.body;

        const querySql = `
            INSERT INTO perfiles (id_usuario, descripcion, ocupacion) 
            VALUES ($1, $2, $3)
            ON CONFLICT (id_usuario) 
            DO UPDATE SET 
                descripcion = EXCLUDED.descripcion, 
                ocupacion = EXCLUDED.ocupacion
            RETURNING *;
        `;

        const result = await pool.query(querySql, [id_usuario, descripcion, ocupacion]);

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH: actualizar nombre, apellido y teléfono del usuario autenticado
router.patch("/perfil/usuario", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;
        const { nombre, apellido, telefono } = req.body;

        const querySql = `
            UPDATE usuarios 
            SET nombre = $1, apellido = $2, telefono = $3 
            WHERE id_usuario = $4 
            RETURNING id_usuario, nombre, apellido, email, telefono, id_rol;
        `;

        const result = await pool.query(querySql, [nombre, apellido, telefono, id_usuario]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Usuario no encontrado para actualizar" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
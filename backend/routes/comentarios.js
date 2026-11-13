import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET: Obtener comentarios de una publicación específica
router.get("/comentarios/:id_publicacion", verificarToken, async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        const querySql = `
            SELECT c.*, 
                   json_build_object(
                       'id_usuario', u.id_usuario, 
                       'nombre', u.nombre
                   ) AS usuarios
            FROM comentarios c
            LEFT JOIN usuarios u ON c.id_usuario_final = u.id_usuario
            WHERE c.id_publicacion = $1
            ORDER BY c.fecha_comentario ASC;
        `;

        const result = await pool.query(querySql, [id_publicacion]);

        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Guardar un nuevo comentario
router.post("/comentarios", verificarToken, async (req, res) => {
    try {
        const { id_publicacion, id_usuario_final, contenido } = req.body;

        if (!id_publicacion || !id_usuario_final || !contenido) {
            return res
                .status(400)
                .json({
                    error: "Faltan campos requeridos (id_publicacion, id_usuario_final, contenido)",
                });
        }

        const fecha_comentario = new Date().toISOString();

        const querySql = `
            WITH inserted AS (
                INSERT INTO comentarios (id_publicacion, id_usuario_final, contenido, fecha_comentario) 
                VALUES ($1, $2, $3, $4) 
                RETURNING *
            )
            SELECT i.*, 
                   json_build_object(
                       'id_usuario', u.id_usuario, 
                       'nombre', u.nombre
                   ) AS usuarios
            FROM inserted i
            LEFT JOIN usuarios u ON i.id_usuario_final = u.id_usuario;
        `;

        const queryParams = [
            id_publicacion,
            id_usuario_final,
            contenido,
            fecha_comentario,
        ];
        const result = await pool.query(querySql, queryParams);

        if (result.rowCount === 0) {
            throw new Error("No se pudo obtener el comentario insertado.");
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener TODOS los comentarios de la plataforma (Para la tabla de Admin)
router.get("/admin/comentarios", verificarToken, async (req, res) => {
    try {
        const querySql = `
            SELECT c.*, 
                   json_build_object(
                       'id_usuario', u.id_usuario, 
                       'nombre', u.nombre, 
                       'email', u.email
                   ) AS usuarios,
                   json_build_object(
                       'id_publicacion', p.id_publicacion, 
                       'titulo', p.titulo
                   ) AS publicaciones
            FROM comentarios c
            LEFT JOIN usuarios u ON c.id_usuario_final = u.id_usuario
            LEFT JOIN publicaciones p ON c.id_publicacion = p.id_publicacion
            ORDER BY c.fecha_comentario DESC;
        `;

        const result = await pool.query(querySql);

        res.status(200).json(result.rows || []);
    } catch (error) {
        console.error("Error en GET /admin/comentarios:", error);
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Eliminar un comentario específico por su ID
router.delete(
    "/comentarios/:id_comentario",
    verificarToken,
    async (req, res) => {
        try {
            const { id_comentario } = req.params;

            const querySql = "DELETE FROM comentarios WHERE id_comentario = $1";
            await pool.query(querySql, [id_comentario]);

            res.status(200).json({ mensaje: "Comentario eliminado con éxito" });
        } catch (error) {
            console.error(
                "Error en DELETE /comentarios/:id_comentario:",
                error,
            );
            res.status(500).json({ error: error.message });
        }
    },
);

export default router;

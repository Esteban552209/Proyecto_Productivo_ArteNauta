import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// POST: Agregar o retirar like de una publicacion
router.post("/publicaciones/:id_publicacion/like", verificarToken, async (req, res) => {
    const { id_publicacion } = req.params;
    const { id_usuario } = req.body;
    const tipoReaccion = "like";

    if (!id_usuario) {
        return res.status(400).json({ error: "El id_usuario es requerido." });
    }

    try {
        const checkSql = "SELECT id_reaccion FROM reacciones WHERE id_publicacion = $1 AND id_usuario = $2 AND tipo = $3";
        const checkResult = await pool.query(checkSql, [id_publicacion, id_usuario, tipoReaccion]);

        if (checkResult.rowCount > 0) {
            const deleteSql = "DELETE FROM reacciones WHERE id_publicacion = $1 AND id_usuario = $2 AND tipo = $3";
            await pool.query(deleteSql, [id_publicacion, id_usuario, tipoReaccion]);

            return res.json({
                registrado: false,
                mensaje: "Like retirado con éxito"
            });
        }

        const insertSql = "INSERT INTO reacciones (fecha, tipo, id_usuario, id_publicacion) VALUES ($1, $2, $3, $4)";
        await pool.query(insertSql, [new Date().toISOString(), tipoReaccion, id_usuario, id_publicacion]);

        return res.json({
            registrado: true,
            mensaje: "Like registrado con éxito"
        });

    } catch (error) {
        console.error("Error en POST /like:", error);
        return res.status(500).json({ error: "Error interno al procesar el me gusta." });
    }
});


// GET: Obtener información de likes
router.get("/publicaciones/:id_publicacion/likes-info", async (req, res) => {
    const { id_publicacion } = req.params;
    const { id_usuario } = req.query;
    const tipoReaccion = "like";

    try {
        if (id_usuario) {
            const querySql = `
                SELECT 
                    COUNT(*) AS "totalLikes",
                    COUNT(CASE WHEN id_usuario = $2 THEN 1 END) > 0 AS "usuarioDioLike"
                FROM reacciones
                WHERE id_publicacion = $1 AND tipo = $3
            `;
            const result = await pool.query(querySql, [id_publicacion, id_usuario, tipoReaccion]);
            const row = result.rows[0];

            return res.json({
                totalLikes: parseInt(row.totalLikes, 10) || 0,
                usuarioDioLike: row.usuarioDioLike
            });
        } else {
            const querySql = `
                SELECT COUNT(*) AS "totalLikes" 
                FROM reacciones 
                WHERE id_publicacion = $1 AND tipo = $2
            `;
            const result = await pool.query(querySql, [id_publicacion, tipoReaccion]);

            return res.json({
                totalLikes: parseInt(result.rows[0].totalLikes, 10) || 0,
                usuarioDioLike: false
            });
        }

    } catch (error) {
        console.error("Error en GET /likes-info:", error);
        return res.status(500).json({ error: "Error al obtener estadísticas de reacciones." });
    }
});

export default router;
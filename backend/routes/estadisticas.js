import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js"; 

const router = express.Router();

// GET: Obtener métricas consolidadas para el Dashboard de Admin
router.get("/dashboard/estadisticas", verificarToken, async (req, res) => {
    try {
        const [
            usersCountResult, 
            artistsCountResult, 
            postsCountResult, 
            commentsCountResult
        ] = await Promise.all([
            pool.query("SELECT COUNT(*) FROM usuarios"),
            pool.query("SELECT COUNT(*) FROM usuarios WHERE id_rol = 2"),
            pool.query("SELECT COUNT(*) FROM publicaciones"),
            pool.query("SELECT COUNT(*) FROM comentarios")
        ]);

        res.status(200).json({
            totalUsuarios: parseInt(usersCountResult.rows[0].count, 10) || 0,
            totalArtistas: parseInt(artistsCountResult.rows[0].count, 10) || 0,
            totalPublicaciones: parseInt(postsCountResult.rows[0].count, 10) || 0,
            totalComentarios: parseInt(commentsCountResult.rows[0].count, 10) || 0
        });

    } catch (error) {
        console.error("Error en endpoint estadisticas:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
import express from "express";
import axios from "axios";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

router.get("/Muro-Publicaciones", verificarToken, async (req, res) => {
    try {
        const { buscar, ordenFecha, ordenLikes } = req.query;

        let querySql = `
            SELECT p.*,
                   json_build_object(
                       'id_usuario', u.id_usuario,
                       'nombre', u.nombre,
                       'email', u.email
                   ) AS usuarios,
                   COUNT(r.id_reaccion) AS "totalLikes"
            FROM publicaciones p
            LEFT JOIN usuarios u ON p.id_usuario_artista = u.id_usuario
            LEFT JOIN reacciones r ON p.id_publicacion = r.id_publicacion
        `;
        let queryParams = [];

        // Filtro de búsqueda
        if (buscar && buscar.trim() !== "") {
            querySql += " WHERE (p.titulo ILIKE $1 OR p.descripcion ILIKE $1)";
            queryParams.push(`%${buscar}%`);
        }

        querySql += " GROUP BY p.id_publicacion, u.id_usuario";

        // Ordenamiento
        if (ordenLikes) {
            querySql += ordenLikes === "asc" ? ' ORDER BY "totalLikes" ASC' : ' ORDER BY "totalLikes" DESC';
        } else {
            querySql += ordenFecha === "asc" ? ' ORDER BY p.fecha_publicacion ASC' : ' ORDER BY p.fecha_publicacion DESC';
        }

        const result = await pool.query(querySql, queryParams);

        const publicacionesConLikes = result.rows.map(pub => ({
            ...pub,
            totalLikes: parseInt(pub.totalLikes, 10)
        }));

        res.status(200).json(publicacionesConLikes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener publicaciones de un artista específico
router.get("/publicaciones/artista/:id_artista", verificarToken, async (req, res) => {
    try {
        const { id_artista } = req.params;
        const querySql = "SELECT * FROM publicaciones WHERE id_usuario_artista = $1 ORDER BY fecha_publicacion DESC";
        const result = await pool.query(querySql, [id_artista]);

        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Crear una nueva publicación + api sightengine
router.post("/publicaciones", verificarToken, async (req, res) => {
    try {
        const { titulo, contenido, descripcion, id_usuario_artista, id_categoria } = req.body;
        
        if (!titulo || !id_usuario_artista) {
            return res.status(400).json({
                error: "Faltan campos obligatorios (titulo, id_usuario_artista)",
            });
        }

        // Validación con Sightengine
        if (contenido && contenido.trim() !== "") {
            try {
                const MODELS = "nudity-2.1,weapon,alcohol,recreational_drug,gore-2.0,violence,self-harm";
                const sightengineRes = await axios.get("https://api.sightengine.com/1.0/check.json", {
                    params: {
                        url: contenido,
                        models: MODELS,
                        api_user: process.env.SIGHTENGINE_USER,
                        api_secret: process.env.SIGHTENGINE_SECRET,
                    },
                });

                const dataApi = sightengineRes.data;

                if (dataApi.status === "failure") {
                    return res.status(522).json({ error: `Error de Sightengine: ${dataApi.error.message}` });
                }

                const nudity = dataApi.nudity?.raw ?? 0;
                const violence = dataApi.violence?.prob ?? 0;
                const gore = dataApi.gore?.prob ?? 0;
                const drugs = dataApi.recreational_drug?.prob ?? 0;
                
                if (nudity > 0.5 || violence > 0.5 || gore > 0.5 || drugs > 0.5) {
                    return res.status(422).json({
                        error: "La imagen contiene contenido inapropiado y no cumple con las normas de ArteNauta.",
                    });
                }
            } catch (errSight) {
                console.error("Error conectando con Sightengine:", errSight.response?.data || errSight.message);
                return res.status(500).json({
                    error: "No se pudo verificar la seguridad de la imagen.",
                });
            }
        }

        const querySql = `
            WITH inserted AS (
                INSERT INTO publicaciones (titulo, contenido, descripcion, fecha_publicacion, id_usuario_artista, id_categoria) 
                VALUES ($1, $2, $3, $4, $5, $6) 
                RETURNING *
            )
            SELECT i.*, 
                   json_build_object(
                       'id_usuario', u.id_usuario, 
                       'nombre', u.nombre, 
                       'email', u.email
                   ) AS usuarios
            FROM inserted i
            LEFT JOIN usuarios u ON i.id_usuario_artista = u.id_usuario;
        `;
        const queryParams = [titulo, contenido, descripcion, new Date().toISOString(), id_usuario_artista, id_categoria];
        const result = await pool.query(querySql, queryParams);

        if (result.rowCount === 0) {
            throw new Error("No se pudo obtener la publicación creada.");
        }
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Get: publicaciones del perfil
router.get("/mis-publicaciones/:id_usuario", async (req, res) => {
    try {
        const { id_usuario } = req.params;
        const querySql = "SELECT * FROM publicaciones WHERE id_usuario_artista = $1 ORDER BY id_publicacion DESC";
        const result = await pool.query(querySql, [id_usuario]);

        res.json(result.rows || []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Edita título y descripción de una publicación
router.put("/publicaciones/:id_publicacion", async (req, res) => {
    try {
        const { id_publicacion } = req.params;
        const { titulo, descripcion } = req.body;

        const querySql = `
            UPDATE publicaciones 
            SET titulo = $1, descripcion = $2 
            WHERE id_publicacion = $3 
            RETURNING *
        `;
        const result = await pool.query(querySql, [titulo, descripcion, id_publicacion]);

        res.json({
            message: "Publicación editada correctamente",
            data: result.rows[0],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: eliminar publicaciones
router.delete("/publicaciones/:id_publicacion", async (req, res) => {
    try {
        const { id_publicacion } = req.params;

        const deleteSql = "DELETE FROM publicaciones WHERE id_publicacion = $1";
        await pool.query(deleteSql, [id_publicacion]);

        res.json({ message: "Publicación eliminada con éxito" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
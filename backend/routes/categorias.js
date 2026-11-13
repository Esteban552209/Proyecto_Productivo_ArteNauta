import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET: Obtener todas las categorías fijas ordenadas alfabéticamente
router.get("/categorias", verificarToken, async (req, res) => {
    try {
        const { buscar } = req.query;
        let querySql = "SELECT * FROM categorias";
        let queryParams = [];

        if (buscar) {
            querySql += " WHERE nombre_categoria ILIKE $1";
            queryParams.push(`%${buscar}%`);
        }
        
        querySql += " ORDER BY nombre_categoria ASC";

        const result = await pool.query(querySql, queryParams);
        
        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Crear categorias
router.post("/categorias", verificarToken, async (req, res) => {
    try {
        const { nombre_categoria, descripcion } = req.body;

        if (!nombre_categoria || !descripcion) {
            return res.status(400).json({
                error: "Faltan campos obligatorios (Nombre Categoria, Descripcion)",
            });
        }

        const querySql = `
            INSERT INTO categorias (nombre_categoria, descripcion) 
            VALUES ($1, $2) 
            RETURNING *;
        `;
        const queryParams = [nombre_categoria, descripcion];

        const result = await pool.query(querySql, queryParams);

        if (result.rowCount === 0) {
            throw new Error("No se pudo obtener la categoria creada.");
        }

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH: Editar categorias por su ID
router.patch("/categorias/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_categoria, descripcion } = req.body;

        const querySql = `
            UPDATE categorias 
            SET nombre_categoria = $1, descripcion = $2 
            WHERE id_categoria = $3 
            RETURNING *;
        `;
        const queryParams = [nombre_categoria, descripcion, id];

        const result = await pool.query(querySql, queryParams);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }

        res.status(200).json({
            mensaje: "Categoría actualizada con éxito",
            categoria: result.rows[0],
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
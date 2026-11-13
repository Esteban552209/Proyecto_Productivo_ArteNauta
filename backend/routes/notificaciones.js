import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// Metodos GET

// GET — obtener notificaciones de un usuario
router.get("/notificaciones", verificarToken, async (req, res) => {
    try {
        const { id_usuario } = req.query;

        if (!id_usuario) {
            return res.status(400).json({ error: "id_usuario es requerido" });
        }

        const querySql = `
            SELECT * FROM notificaciones 
            WHERE id_usuario = $1 
            ORDER BY fecha_notificacion DESC 
            LIMIT 20
        `;
        const result = await pool.query(querySql, [id_usuario]);

        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET — obtener solicitudes pendientes (solo admin)
router.get("/notificaciones/solicitudes", verificarToken, async (req, res) => {
    try {

        const querySql = `
            SELECT s.*, 
                   json_build_object(
                       'nombre', u.nombre, 
                       'apellido', u.apellido
                   ) AS usuarios
            FROM solicitudes s
            LEFT JOIN usuarios u ON s.id_usuario = u.id_usuario
            WHERE s.tipo_solicitud = 'artista' 
              AND s.estado_solicitud = 'Pendiente'
            ORDER BY s.fecha_solicitud DESC
        `;
        const result = await pool.query(querySql);

        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Metodos PATCH

// PATCH — aprobar solicitud (Adaptado y unificado)
router.patch("/notificaciones/solicitudes/:id/aprobar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const buscarSql = "SELECT id_usuario FROM solicitudes WHERE id_solicitud = $1";
        const resultBusqueda = await pool.query(buscarSql, [id]);

        if (resultBusqueda.rowCount === 0) {
            return res.status(404).json({ error: "La solicitud no existe o ya fue procesada." });
        }

        const id_usuario = resultBusqueda.rows[0].id_usuario;

        const updateSolicitudSql = "UPDATE solicitudes SET estado_solicitud = 'Aceptada' WHERE id_solicitud = $1 RETURNING *";
        const resultUpdate = await pool.query(updateSolicitudSql, [id]);

        const updateRolSql = "UPDATE usuarios SET id_rol = 2 WHERE id_usuario = $1";
        await pool.query(updateRolSql, [id_usuario]);

        let notificacionEstado = "Creada correctamente";
        try {
            const insertNotifSql = `
                INSERT INTO notificaciones (id_usuario, asunto, tipo_notificacion, fecha_notificacion) 
                VALUES ($1, $2, $3, $4)
            `;
            await pool.query(insertNotifSql, [
                id_usuario, 
                "¡Tu solicitud para ser artista fue aprobada!", 
                "solicitud_aprobada", 
                new Date().toISOString()
            ]);
        } catch (errNotif) {
            console.log("Aviso: No se creó la fila de notificación por conflicto de ENUM, pero el rol y la solicitud sí se guardaron.");
            notificacionEstado = "No creada (Revisar ENUM en DB local)";
        }

        res.status(200).json({
            mensaje: "¡Solicitud aprobada y rol actualizado con éxito!",
            notificacion: notificacionEstado,
            solicitud: resultUpdate.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PATCH — rechazar solicitud (Adaptado)
router.patch("/notificaciones/solicitudes/:id/rechazar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const buscarSql = "SELECT id_usuario FROM solicitudes WHERE id_solicitud = $1";
        const resultBusqueda = await pool.query(buscarSql, [id]);

        if (resultBusqueda.rowCount === 0) {
            return res.status(404).json({ error: "La solicitud no existe o ya fue procesada." });
        }

        const id_usuario = resultBusqueda.rows[0].id_usuario;

        const updateSql = "UPDATE solicitudes SET estado_solicitud = 'Rechazada' WHERE id_solicitud = $1";
        await pool.query(updateSql, [id]);

        let notificacionEstado = "Creada correctamente";
        try {
            const insertNotifSql = `
                INSERT INTO notificaciones (id_usuario, asunto, tipo_notificacion, fecha_notificacion) 
                VALUES ($1, $2, $3, $4)
            `;
            await pool.query(insertNotifSql, [
                id_usuario, 
                "Tu solicitud para ser artista fue rechazada.", 
                "solicitud_rechazada", 
                new Date().toISOString()
            ]);
        } catch (errNotif) {
            console.log("Aviso: No se creó la notificación por conflicto de ENUM, pero la solicitud se rechazó con éxito.");
            notificacionEstado = "No creada (Revisar ENUM en DB local)";
        }

        res.status(200).json({ 
            mensaje: "Solicitud rechazada correctamente en base de datos local.",
            notificacion: notificacionEstado
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Metodos POST
// Crear una nueva solicitud (POST)
router.post('/notificaciones/solicitudes', verificarToken, async (req, res) => {
    const { tipo_solicitud, id_usuario } = req.body;

    try {
        const insertSql = `
            INSERT INTO solicitudes (tipo_solicitud, id_usuario, estado_solicitud) 
            VALUES ($1, $2, 'Pendiente') 
            RETURNING *
        `;
        const result = await pool.query(insertSql, [tipo_solicitud, id_usuario]);

        res.status(201).json({
            mensaje: "¡Solicitud creada con éxito!",
            solicitud: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

// Metodos DELETE

// DELETE — eliminar una notificación específica
router.delete("/notificaciones/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteSql = "DELETE FROM notificaciones WHERE id_notificacion = $1";
        await pool.query(deleteSql, [id]);

        res.status(200).json({ mensaje: "Notificación eliminada correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE — eliminar una solicitud específica 
router.delete("/solicitudes/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const deleteSql = "DELETE FROM solicitudes WHERE id_solicitud = $1";
        await pool.query(deleteSql, [id]);

        res.status(200).json({ mensaje: "Solicitud eliminada correctamente." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET — obtener notificaciones de un usuario
// Ejemplo: GET /notificaciones?id_usuario=5
router.get("/notificaciones", verificarToken, async (req, res) => {
    try {
        const { id_usuario } = req.query;

        if (!id_usuario) {
            return res.status(400).json({ error: "id_usuario es requerido" });
        }

        const { data, error } = await supabase
            .from("notificaciones")
            .select("*")
            .eq("id_usuario", id_usuario)
            .order("fecha_notificacion", { ascending: false })
            .limit(20);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET — obtener solicitudes pendientes (solo admin)
// Ejemplo: GET /notificaciones/solicitudes
router.get("/notificaciones/solicitudes", verificarToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("solicitudes")
            .select("*, usuarios(nombre, apellido)")
            .eq("tipo_solicitud", "artista")
            .eq("estado_solicitud", "Pendiente")
            .order("fecha_solicitud", { ascending: false });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH — aprobar solicitud
// Ejemplo: PATCH /notificaciones/solicitudes/:id/aprobar
router.patch("/notificaciones/solicitudes/:id/aprobar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;  // path param — id de la solicitud
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: "id_usuario es requerido" });
        }

        // 1. Actualizar estado solicitud
        const { error: e1 } = await supabase
            .from("solicitudes")
            .update({ estado_solicitud: "Aceptada" })
            .eq("id_solicitud", id);
        if (e1) throw e1;

        // 2. Cambiar rol a artista
        const { error: e2 } = await supabase
            .from("usuarios")
            .update({ id_rol: 2 })
            .eq("id_usuario", id_usuario);
        if (e2) throw e2;

        // 3. Crear notificación para el usuario
        const { error: e3 } = await supabase
            .from("notificaciones")
            .insert({
                id_usuario,
                asunto: "¡Tu solicitud para ser artista fue aprobada!",
                tipo_notificacion: "solicitud_aprobada",
                fecha_notificacion: new Date().toISOString(),
            });
        if (e3) throw e3;

        res.status(200).json({ mensaje: "Solicitud aprobada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH — rechazar solicitud
// Ejemplo: PATCH /notificaciones/solicitudes/:id/rechazar
router.patch("/notificaciones/solicitudes/:id/rechazar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;  // path param
        const { id_usuario } = req.body;

        if (!id_usuario) {
            return res.status(400).json({ error: "id_usuario es requerido" });
        }

        // 1. Actualizar estado solicitud
        const { error: e1 } = await supabase
            .from("solicitudes")
            .update({ estado_solicitud: "Rechazada" })
            .eq("id_solicitud", id);
        if (e1) throw e1;

        // 2. Crear notificación para el usuario
        const { error: e2 } = await supabase
            .from("notificaciones")
            .insert({
                id_usuario,
                asunto: "Tu solicitud para ser artista fue rechazada.",
                tipo_notificacion: "solicitud_rechazada",
                fecha_notificacion: new Date().toISOString(),
            });
        if (e2) throw e2;

        res.status(200).json({ mensaje: "Solicitud rechazada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
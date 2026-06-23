import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();


router.get("/conversaciones", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario;

        
        const { data, error } = await supabase
            .from("participantes")
            .select(`
                id_conversacion,
                conversaciones!id_conversacion (
                    id_conversacion,
                    fecha_creacion
                )
            `)
            .eq("id_usuario", id_usuario);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.get("/conversaciones/:id/mensajes", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("mensajes")
            .select(`
                id_mensaje,
                contenido,
                fecha_envio,
                id_usuario,
                usuarios!id_usuario (nombre, apellido)
            `)
            .eq("id_conversacion", id)
            .order("fecha_envio", { ascending: true });

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/conversaciones", verificarToken, async (req, res) => {
    try {
        const { id_usuario_destino } = req.body;
        const id_usuario_origen = req.usuario.id_usuario;

        
        const { data: conv, error: convError } = await supabase
            .from("conversaciones")
            .insert({ fecha_creacion: new Date() })
            .select()
            .single();

        if (convError) throw convError;

        
        const { error: partError } = await supabase
            .from("participantes")
            .insert([
                { id_conversacion: conv.id_conversacion, id_usuario: id_usuario_origen },
                { id_conversacion: conv.id_conversacion, id_usuario: id_usuario_destino },
            ]);

        if (partError) throw partError;

        res.status(201).json(conv);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.post("/conversaciones/:id/mensajes", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const { data, error } = await supabase
            .from("mensajes")
            .insert({
                contenido,
                id_conversacion: id,
                id_usuario,
                fecha_envio: new Date(),
            })
            .select(`
                id_mensaje,
                contenido,
                fecha_envio,
                id_usuario,
                usuarios!id_usuario (nombre, apellido)
            `)
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.patch("/mensajes/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { contenido } = req.body;
        const id_usuario = req.usuario.id_usuario;

        const { data, error } = await supabase
            .from("mensajes")
            .update({ contenido })
            .eq("id_mensaje", id)
            .eq("id_usuario", id_usuario) // solo puede editar el remitente
            .select()
            .single();

        if (error) throw error;
        if (!data) return res.status(403).json({ error: "No autorizado o mensaje no encontrado" });

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.delete("/mensajes/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const id_usuario = req.usuario.id_usuario;

        const { error } = await supabase
            .from("mensajes")
            .delete()
            .eq("id_mensaje", id)
            .eq("id_usuario", id_usuario); // solo puede borrar el remitente

        if (error) throw error;

        res.status(200).json({ mensaje: "Mensaje eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
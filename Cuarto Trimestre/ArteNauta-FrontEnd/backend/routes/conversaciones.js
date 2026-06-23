import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// GET: Buscar usuario por correo para iniciar chat
router.get("/usuarios/buscar", async (req, res) => {
    try {
        const { email, correo } = req.query;
        const targetEmail = email || correo;

        if (!targetEmail) {
            return res.status(400).json({ error: "Se requiere un correo para la búsqueda" });
        }

        const { data, error } = await supabase
            .from("usuarios")
            .select("id_usuario, nombre, apellido, email")
            .eq("email", targetEmail)
            .maybeSingle();

        if (error) throw error;
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener las conversaciones de un usuario específico
router.get("/conversaciones/usuario/:id_usuario", async (req, res) => {
    try {
        const { id_usuario } = req.params;

        // 1. Obtener todas las participaciones del usuario
        const { data: misParticipaciones, error: err1 } = await supabase
            .from("participantes")
            .select("id_conversacion")
            .eq("id_usuario", id_usuario);

        if (err1) throw err1;

        if (!misParticipaciones || misParticipaciones.length === 0) {
            return res.status(200).json([]);
        }

        const idsConversaciones = misParticipaciones.map(p => p.id_conversacion);

        // 2. Obtener los otros participantes de esas conversaciones
        const { data: otrosParticipantes, error: err2 } = await supabase
            .from("participantes")
            .select(`
                id_conversacion,
                id_usuario,
                usuarios (
                    id_usuario,
                    nombre,
                    apellido
                )
            `)
            .in("id_conversacion", idsConversaciones)
            .neq("id_usuario", id_usuario);

        if (err2) throw err2;

        const resultado = otrosParticipantes.map(p => ({
            id_conversacion: p.id_conversacion,
            id_usuario_otro: p.id_usuario,
            nombre_otro: p.usuarios?.nombre 
                ? `${p.usuarios.nombre} ${p.usuarios.apellido || ""}`.trim() 
                : "Usuario"
        }));

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Iniciar o recuperar una conversación entre dos usuarios
router.post("/conversaciones", async (req, res) => {
    try {
        const { id_usuario_1, id_usuario_2 } = req.body;

        if (!id_usuario_1 || !id_usuario_2) {
            return res.status(400).json({ error: "Faltan campos requeridos (id_usuario_1, id_usuario_2)" });
        }

        // 1. Verificar si ya existe una conversación
        const { data: part1, error: err1 } = await supabase
            .from("participantes")
            .select("id_conversacion")
            .eq("id_usuario", id_usuario_1);

        if (err1) throw err1;

        if (part1 && part1.length > 0) {
            const idsConversaciones = part1.map(p => p.id_conversacion);

            const { data: part2, error: err2 } = await supabase
                .from("participantes")
                .select("id_conversacion")
                .in("id_conversacion", idsConversaciones)
                .eq("id_usuario", id_usuario_2);

            if (err2) throw err2;

            if (part2 && part2.length > 0) {
                return res.status(200).json({ 
                    id_conversacion: part2[0].id_conversacion,
                    existe: true 
                });
            }
        }

        // 2. Si no existe, crear la conversación
        const { data: nuevaConv, error: err3 } = await supabase
            .from("conversaciones")
            .insert({ fecha_creacion: new Date().toISOString() })
            .select("id_conversacion")
            .single();

        if (err3) throw err3;

        const id_conversacion = nuevaConv.id_conversacion;

        // 3. Crear los participantes
        const { error: err4 } = await supabase
            .from("participantes")
            .insert([
                { id_conversacion, id_usuario: id_usuario_1 },
                { id_conversacion, id_usuario: id_usuario_2 }
            ]);

        if (err4) throw err4;

        res.status(201).json({ id_conversacion, existe: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener mensajes de una conversación
router.get("/mensajes/:id_conversacion", async (req, res) => {
    try {
        const { id_conversacion } = req.params;
        const { data, error } = await supabase
            .from("mensajes")
            .select("*")
            .eq("id_conversacion", id_conversacion)
            .order("fecha_envio", { ascending: true });

        if (error) throw error;
        res.status(200).json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Enviar un mensaje
router.post("/mensajes", async (req, res) => {
    try {
        const { id_conversacion, id_usuario, contenido } = req.body;

        if (!id_conversacion || !id_usuario || !contenido) {
            return res.status(400).json({ error: "Faltan campos (id_conversacion, id_usuario, contenido)" });
        }

        const { data, error } = await supabase
            .from("mensajes")
            .insert({
                id_conversacion,
                id_usuario,
                contenido,
                fecha_envio: new Date().toISOString()
            })
            .select("*")
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

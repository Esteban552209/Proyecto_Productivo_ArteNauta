import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET — obtener notificaciones de un usuario (no se si funciona)
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

// GET — obtener solicitudes pendientes (solo admin) (funciona)
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

// PATCH — aprobar solicitud (funciona)
router.patch("/notificaciones/solicitudes/:id/aprobar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params; 
        
        // Esto te mostrará en la terminal de VS Code el número que estás probando
        console.log("Intentando aprobar la solicitud con ID:", id);

        // Actualizar usando tus columnas tal cual
        const { data, error } = await supabase
            .from("solicitudes")
            .update({ estado_solicitud: "Aceptada" })
            .eq("id_solicitud", id) // <-- Se queda con tu columna original
            .select();

        if (error) throw error;

        // Si entra aquí, es porque el número de ID no existe en la tabla de Supabase
        if (!data || data.length === 0) {
            return res.status(404).json({ 
                error: `No se encontró ninguna solicitud donde id_solicitud sea igual a ${id}` 
            });
        }

        res.status(200).json({ 
            mensaje: "¡Estado cambiado en Supabase correctamente!",
            solicitud: data[0]
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PATCH — rechazar solicitud
router.patch("/notificaciones/solicitudes/:id/rechazar", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;  // ID de la solicitud desde la URL

        // 1. Buscamos la solicitud primero para obtener el id_usuario automáticamente
        const { data: solicitud, error: errorBusqueda } = await supabase
            .from("solicitudes")
            .select("id_usuario")
            .eq("id_solicitud", id)
            .single(); // Trae un solo objeto en vez de un array

        if (errorBusqueda || !solicitud) {
            return res.status(404).json({ error: "La solicitud no existe o ya fue procesada." });
        }

        const id_usuario = solicitud.id_usuario; // Guardamos el ID del dueño de la solicitud

        // 2. Actualizar estado de la solicitud a Rechazada
        const { error: e1 } = await supabase
            .from("solicitudes")
            .update({ estado_solicitud: "Rechazada" })
            .eq("id_solicitud", id);
        if (e1) throw e1;

        // 3. Crear notificación para el usuario de manera automática
        const { error: e2 } = await supabase
            .from("notificaciones")
            .insert({
                id_usuario, // Usamos el ID que encontramos en el paso 1
                asunto: "Tu solicitud para ser artista fue rechazada.",
                tipo_notificacion: "solicitud_rechazada",
                fecha_notificacion: new Date().toISOString(),
            });
        if (e2) throw e2;

        res.status(200).json({ mensaje: "Solicitud rechazada correctamente en Supabase y notificación enviada." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// PATH - Crear una nueva solicitud (Probando con Thunder Client)

// Crear una nueva solicitud (POST)
// Si usas el middleware de token lo dejas, si no, se lo quitas
router.post('/notificaciones/solicitudes', verificarToken, async (req, res) => {
    const { tipo_solicitud, id_usuario } = req.body;

    try {
        const { data, error } = await supabase
            .from('solicitudes')
            .insert([
                { 
                    tipo_solicitud, 
                    id_usuario, 
                    estado_solicitud: 'Pendiente' // Se crea automáticamente en "Pendiente"
                }
            ])
            .select();

        if (error) {
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({
            mensaje: "¡Solicitud creada con éxito!",
            solicitud: data[0]
        });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor" });
    }
});

export default router;  
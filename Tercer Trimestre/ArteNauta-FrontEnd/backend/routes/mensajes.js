import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();



//Metodo get
router.get("/:id_conversacion", verificarToken, async (req, res) => {
    try {
        const { id_conversacion } = req.params;

        // Trae los mensajes adaptados a tus 4 columnas reales
        const { data, error } = await supabase
            .from("mensajes")
            .select(`
                id_mensaje,
                id_conversacion,
                id_usuario,
                contenido
            `)
            .eq("id_conversacion", id_conversacion); 

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Metodo post
router.post("/", verificarToken, async (req, res) => {
    try {
        const id_usuario = req.usuario.id_usuario; // Extraído del token
        const { id_conversacion, contenido } = req.body;

        if (!contenido || contenido.trim() === "") {
            return res.status(400).json({ error: "El mensaje no puede estar vacío" });
        }

        // Inserta solo en las columnas existentes en tu Supabase
        const { data, error } = await supabase
            .from("mensajes")
            .insert({
                id_conversacion: id_conversacion,
                id_usuario: id_usuario,
                contenido: contenido.trim()
            })
            .select()
            .single();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// metodo patch
router.patch('/:id_mensaje', async (req, res) => {
    const { id_mensaje } = req.params;
    const { contenido } = req.body;

    // 1. Validar que el nuevo contenido no venga vacío
    if (!contenido || contenido.trim() === '') {
        return res.status(400).json({ error: 'El campo contenido es obligatorio para editar el mensaje.' });
    }

    try {
        // 2. Actualizar el mensaje en Supabase
        const { data, error } = await supabase
            .from('mensajes')
            .update({ contenido: contenido }) // Actualizamos solo la columna contenido
            .eq('id_mensaje', id_mensaje)     // Filtramos por el ID del mensaje que viene en la URL
            .select();                        // .select() para que Supabase nos devuelva el registro modificado

        // Si ocurre un error con Supabase
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        // Si el mensaje no existe o no se modificó nada
        if (!data || data.length === 0) {
            return res.status(404).json({ error: 'Mensaje no encontrado.' });
        }

        // 3. Devolver el mensaje ya editado con éxito
        return res.status(200).json({
            mensaje: 'Mensaje editado con éxito',
            data: data[0]
        });

    } catch (err) {
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

export default router;
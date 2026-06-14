import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// PETICION MURO DE PUBLICACIONES CON DATOS DEL ARTISTA
router.get("/Muro-Publicaciones", async (req, res) => {
    try {
        const { data, error } = await supabase.from("publicaciones").select(`
                *,
                usuarios (
                    id_usuario,
                    nombre,
                    email
                )
            `);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
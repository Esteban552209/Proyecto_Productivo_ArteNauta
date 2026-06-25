import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET: Obtener todas las categorías fijas ordenadas alfabéticamente
router.get("/categorias", verificarToken, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("categorias")
            .select("*")
            .order("nombre_categoria", { ascending: true });

        if (error) throw error;
        res.status(200).json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
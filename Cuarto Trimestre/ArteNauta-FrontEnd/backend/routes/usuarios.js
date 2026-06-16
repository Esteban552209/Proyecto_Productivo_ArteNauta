import express from "express";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// PETICIÓN QUERY USUARIOS ACTIVOS O DESACTIVADOS
router.get("/usuarios", async (req, res) => {
    try {
        const estadoQuery = req.query.estado;

        let consulta = supabase
            .from("usuarios")
            .select(`id_usuario, nombre, apellido, email, estado_cuenta, roles!id_rol (nombre_rol), fecha_registro`)
            .order('id_usuario', { ascending: true });

        if (estadoQuery === "true") {
            consulta = consulta.eq("estado_cuenta", true);
        } else if (estadoQuery === "false") {
            consulta = consulta.eq("estado_cuenta", false);
        }

        const { data, error } = await consulta;

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PETICIÓN PATCH USUARIOS
router.patch("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellido, estado_cuenta, id_rol } = req.body;

        const { data, error } = await supabase
            .from("usuarios")
            .update({ 
                nombre, 
                apellido, 
                estado_cuenta, 
                id_rol: parseInt(id_rol)
            })
            .eq("id_usuario", id)
            .select(`id_usuario, nombre, apellido, email, estado_cuenta, id_rol, roles!id_rol (nombre_rol), fecha_registro`); 

        if (error) throw error;

        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
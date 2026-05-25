import express from "express";
import cors from "cors";
import { supabase } from "./config/supabase.js";

const app = express();

app.use(cors());
app.use(express.json());

// PETICION MURO DE PUBLICACIONES CON DATOS DEL ARTISTA
app.get("/Muro-Publicaciones", async (req, res) => {
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

// PETICIONES VISTA ADMINISTRADOR

// PETICION QUERY USUARIOS ACTIVOS O DESACTIVADOS
app.get("/usuarios", async (req, res) => {
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

// PETICION PATCH USUARIOS
app.patch("/usuarios/:id", async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

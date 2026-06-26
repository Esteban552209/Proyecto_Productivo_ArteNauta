import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET: Muro de publicaciones con Buscador y Filtros Avanzados
router.get("/Muro-Publicaciones", verificarToken, async (req, res) => {
    try {
        const { buscar, ordenFecha, ordenLikes } = req.query;

        let consulta = supabase
            .from("publicaciones")
            .select(`
                *,
                usuarios (
                    id_usuario,
                    nombre,
                    email
                )
            `);

        // Busqueda
        if (buscar && buscar.trim() !== "") {
            consulta = consulta.or(`titulo.ilike.%${buscar}%,descripcion.ilike.%${buscar}%`);
        }

        // filtrado 
        if (ordenLikes) {
            // ordenLikes
            consulta = consulta.order("likes", { ascending: ordenLikes === "asc" });
        } else if (ordenFecha) {
            // ordenFecha puede ser 'asc' o 'desc'
            consulta = consulta.order("fecha_publicacion", { ascending: ordenFecha === "asc" });
        } else {
            // Más recientes primero
            consulta = consulta.order("fecha_publicacion", { ascending: false });
        }

        const { data, error } = await consulta;

        if (error) throw error;

        res.status(200).json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Obtener publicaciones de un artista específico
router.get("/publicaciones/artista/:id_artista", verificarToken, async (req, res) => {
    try {
        const { id_artista } = req.params;
        const { data, error } = await supabase
            .from("publicaciones")
            .select("*")
            .eq("id_usuario_artista", id_artista)
            .order("fecha_publicacion", { ascending: false });

        if (error) throw error;

        res.status(200).json(data || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Crear una nueva publicación
router.post("/publicaciones", verificarToken, async (req, res) => {
    try {
        const { titulo, contenido, descripcion, id_usuario_artista, id_categoria } = req.body;

        if (!titulo || !id_usuario_artista) {
            return res.status(400).json({ error: "Faltan campos obligatorios (titulo, id_usuario_artista)" });
        }

        const { data, error } = await supabase
            .from("publicaciones")
            .insert([
                {
                    titulo,
                    contenido,
                    descripcion,
                    fecha_publicacion: new Date().toISOString(),
                    id_usuario_artista,
                    id_categoria

                }
            ])
            .select(`
                *,
                usuarios (
                    id_usuario,
                    nombre,
                    email
                )
            `);

        if (error) throw error;

        if (!data || data.length === 0) {
            throw new Error("No se pudo obtener la publicación creada.");
        }

        res.status(201).json(data[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Eliminar una publicación
router.delete("/publicaciones/:id", verificarToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from("publicaciones")
            .delete()
            .eq("id_publicacion", id);

        if (error) throw error;

        res.status(200).json({ message: "Publicación eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get publicaciones del perfil
router.get('/mis-publicaciones/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params
        const { data, error } = await supabase
            .from('publicaciones')
            .select('*')
            .eq('id_usuario_artista', id_usuario)
            .order('id_publicacion', { ascending: false })

        if (error) throw error
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


// Edita título y descripción de una publicación
router.put('/publicaciones/:id_publicacion', async (req, res) => {
    try {
        const { id_publicacion } = req.params
        const { titulo, descripcion } = req.body

        const { data, error } = await supabase
            .from('publicaciones')
            .update({ titulo, descripcion })
            .eq('id_publicacion', id_publicacion)
            .select()

        if (error) throw error
        res.json({ message: 'Publicación editada correctamente', data: data[0] })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE 
router.delete('/publicaciones/:id_publicacion', async (req, res) => {
    try {
        const { id_publicacion } = req.params

        const { error } = await supabase
            .from('publicaciones')
            .delete()
            .eq('id_publicacion', id_publicacion)

        if (error) throw error
        res.json({ message: 'Publicación eliminada con éxito' })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})


export default router;
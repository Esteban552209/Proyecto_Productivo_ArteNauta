import express from "express";
import { supabase } from "../config/supabase.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// POST: Agregar o retirar me gusta de una publicación
router.post(
    "/publicaciones/:id_publicacion/like",
    verificarToken,
    async (req, res) => {
        const { id_publicacion } = req.params;
        const { id_usuario } = req.body;
        const tipoReaccion = "like";

        if (!id_usuario) {
            return res.status(400).json({
                error: "El id_usuario es requerido."
            });
        }

        try {
            // 1. Verificar si ya dio me gusta
            const { data: existente, error: errorBusqueda } = await supabase
                .from("reacciones")
                .select("*")
                .eq("id_publicacion", id_publicacion)
                .eq("id_usuario", id_usuario)
                .eq("tipo", tipoReaccion);

            if (errorBusqueda) throw errorBusqueda;

            // Si ya existe → quitar me gusta
            if (existente && existente.length > 0) {
                const { error: errorDelete } = await supabase
                    .from("reacciones")
                    .delete()
                    .eq("id_publicacion", id_publicacion)
                    .eq("id_usuario", id_usuario)
                    .eq("tipo", tipoReaccion);

                if (errorDelete) throw errorDelete;

                return res.json({
                    registrado: false,
                    mensaje: "Me gusta retirado con éxito"
                });
            }

            // 2. Buscar el artista de la publicación antes de insertar
            // CORREGIDO: Se quitó la tilde de id_publicacion
            const { data: publicacion, error: errorPub } = await supabase
                .from("publicaciones")
                .select("id_usuario_artista")
                .eq("id_publicacion", id_publicacion)
                .maybeSingle();

            if (errorPub) throw errorPub;

            // 3. Insertar me gusta
            const { error: errorInsert } = await supabase
                .from("reacciones")
                .insert([
                    {
                        fecha: new Date().toISOString(), // CORREGIDO: Formato ISO para timestamp de Postgres
                        tipo: tipoReaccion,
                        id_usuario,
                        id_publicacion
                    }
                ]);

            if (errorInsert) throw errorInsert;

            // Devolver id_usuario_artista para que el frontend pueda notificar
            return res.json({
                registrado: true,
                mensaje: "Me gusta registrado con éxito",
                id_usuario_artista: publicacion.id_usuario_artista
            });

        } catch (error) {
            console.error("Error detallado en POST /like:", error);
            return res.status(500).json({
                error: "Error interno al procesar el me gusta."
            });
        }
    }
);

// GET: Obtener información de likes
router.get(
    "/publicaciones/:id_publicacion/likes-info",
    async (req, res) => {
        const { id_publicacion } = req.params;
        const { id_usuario } = req.query;
        const tipoReaccion = "like";

        try {
            const { data: likes, error: errorLikes } = await supabase
                .from("reacciones")
                .select("*")
                .eq("id_publicacion", id_publicacion)
                .eq("tipo", tipoReaccion);

            if (errorLikes) throw errorLikes;

            const totalLikes = likes ? likes.length : 0;

            let usuarioDioLike = false;
            if (id_usuario && likes) {
                usuarioDioLike = likes.some(
                    reaccion => reaccion.id_usuario == id_usuario
                );
            }

            return res.json({
                totalLikes,
                usuarioDioLike
            });

        } catch (error) {
            console.error("Error en GET /likes-info:", error);
            return res.status(500).json({
                error: "Error al obtener estadísticas de reacciones."
            });
        }
    }
);

export default router;
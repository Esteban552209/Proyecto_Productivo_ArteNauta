import express from "express";
import { pool } from "../config/db.js";
import { verificarToken } from "../middlewares/verificarToken.js";

const router = express.Router();

// GET Buscar usuarios para iniciar conversacion
router.get("/usuarios/buscar", verificarToken, async (req, res) => {
    try {
        const { email, correo } = req.query;
        const targetEmail = email || correo;
        if (!targetEmail) return res.status(400).json({ error: "Se requiere un correo" });

        const querySql = "SELECT id_usuario, nombre, apellido, email FROM usuarios WHERE email = $1";
        const result = await pool.query(querySql, [targetEmail]);

        res.status(200).json(result.rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Buscar conversacion de un ID
router.get("/conversaciones/usuario/:id_usuario", verificarToken, async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        if (!id_usuario) return res.status(400).json({ error: "id_usuario inválido" });

        const querySql = `
            SELECT 
                p2.id_conversacion,
                p2.id_usuario AS id_usuario_otro,
                u.nombre,
                u.apellido
            FROM participantes p1
            JOIN participantes p2 ON p1.id_conversacion = p2.id_conversacion AND p1.id_usuario != p2.id_usuario
            JOIN usuarios u ON p2.id_usuario = u.id_usuario
            WHERE p1.id_usuario = $1
        `;

        const { rows } = await pool.query(querySql, [id_usuario]);

        const resultado = rows.map(r => ({
            id_conversacion: r.id_conversacion,
            id_usuario_otro: r.id_usuario_otro,
            nombre_otro: r.nombre 
                ? `${r.nombre} ${r.apellido || ""}`.trim() 
                : "Usuario"
        }));

        res.status(200).json(resultado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Iniciar la conversacion con Validacion de existencia
router.post("/conversaciones", verificarToken, async (req, res) => {
    try {
        const { id_usuario_1, id_usuario_2 } = req.body;
        if (!id_usuario_1 || !id_usuario_2) return res.status(400).json({ error: "Faltan campos" });

        const checkSql = `
            SELECT p1.id_conversacion 
            FROM participantes p1
            JOIN participantes p2 ON p1.id_conversacion = p2.id_conversacion
            WHERE p1.id_usuario = $1 AND p2.id_usuario = $2
            LIMIT 1
        `;
        const checkResult = await pool.query(checkSql, [id_usuario_1, id_usuario_2]);

        if (checkResult.rowCount > 0) {
            return res.status(200).json({ 
                id_conversacion: checkResult.rows[0].id_conversacion, 
                existe: true 
            });
        }

        const convSql = `INSERT INTO conversaciones (fecha_creacion) VALUES ($1) RETURNING id_conversacion`;
        const convResult = await pool.query(convSql, [new Date().toISOString()]);
        const id_conversacion = convResult.rows[0].id_conversacion;

        const partSql = `INSERT INTO participantes (id_conversacion, id_usuario) VALUES ($1, $2), ($1, $3)`;
        await pool.query(partSql, [id_conversacion, id_usuario_1, id_usuario_2]);

        res.status(201).json({ id_conversacion, existe: false });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Muestra mensajes de una conversacion
router.get("/mensajes/:id_conversacion", verificarToken, async (req, res) => {
    try {
        const { id_conversacion } = req.params;
        
        const querySql = "SELECT * FROM mensajes WHERE id_conversacion = $1 ORDER BY fecha_envio ASC";
        const result = await pool.query(querySql, [id_conversacion]);
        
        res.status(200).json(result.rows || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Crea notificaciones de los mensajes
router.post("/mensajes", verificarToken, async (req, res) => {
    try {
        const { id_conversacion, id_usuario, contenido } = req.body;

        if (!id_conversacion || !id_usuario || !contenido) {
            return res.status(400).json({ error: "Datos incompletos" });
        }

        const msgSql = `
            INSERT INTO mensajes (id_conversacion, id_usuario, contenido, fecha_envio) 
            VALUES ($1, $2, $3, $4) 
            RETURNING *
        `;
        const msgParams = [id_conversacion, id_usuario, contenido, new Date().toISOString()];
        const msgResult = await pool.query(msgSql, msgParams);
        const nuevoMensaje = msgResult.rows[0];

        const partSql = "SELECT id_usuario FROM participantes WHERE id_conversacion = $1 AND id_usuario != $2 LIMIT 1";
        const partResult = await pool.query(partSql, [id_conversacion, id_usuario]);

        if (partResult.rowCount > 0) {
            const idReceptor = partResult.rows[0].id_usuario;

            try {
                const notifSql = `
                    INSERT INTO notificaciones (id_usuario, asunto, tipo_notificacion, fecha_notificacion) 
                    VALUES ($1, $2, $3, $4)
                `;
                const notifParams = [
                    idReceptor, 
                    "Tienes un nuevo mensaje en el chat", 
                    "Mensaje", 
                    new Date().toISOString()
                ];
                await pool.query(notifSql, notifParams);
            } catch (errorNotif) {
                console.error("Aviso: El mensaje se envió pero la notificación falló:", errorNotif.message);
            }
        }

        res.status(201).json(nuevoMensaje);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
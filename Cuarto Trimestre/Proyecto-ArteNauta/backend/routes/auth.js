import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { supabase } from "../config/supabase.js";

const router = express.Router();

// POST Login de usuarios con JWT
router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: usuarioEncontrado, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", email)
            .maybeSingle();

        if (error) throw error;

        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const passwordValida = await bcrypt.compare(password, usuarioEncontrado.clave);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        if (usuarioEncontrado.estado_cuenta === false) {
            return res.status(403).json({
                mensaje: "Tu cuenta ha sido desactivada por un administrador. No puedes iniciar sesión."
            });
        }

        const payload = {
            id_usuario: usuarioEncontrado.id_usuario,
            id_rol: usuarioEncontrado.id_rol
        };

        const secretKey = process.env.JWT_SECRET || "mi_clave_super_secreta_desarrollo";
        const token = jwt.sign(payload, secretKey, { expiresIn: "5h" });

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token: token,
            usuario: {
                id_usuario: usuarioEncontrado.id_usuario,
                nombre: usuarioEncontrado.nombre,
                email: usuarioEncontrado.email,
                id_rol: usuarioEncontrado.id_rol
            }
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

export default router;
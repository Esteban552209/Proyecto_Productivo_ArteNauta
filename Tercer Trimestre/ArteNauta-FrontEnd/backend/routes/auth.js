import express from "express";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js"; 

const router = express.Router();

router.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const { data: usuarioEncontrado, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("email", email) 
            .eq("clave", password)
            .maybeSingle();

        if (error) throw error;

        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

        const payload = {
            id: usuarioEncontrado.id,
            id_rol: usuarioEncontrado.id_rol 
        };

        const secretKey = process.env.JWT_SECRET || "mi_clave_super_secreta_desarrollo";
        const token = jwt.sign(payload, secretKey, { expiresIn: "5h" });

        res.status(200).json({
            mensaje: "Inicio de sesión exitoso",
            token: token,
            usuario: usuarioEncontrado
        });

    } catch (error) {
        console.error("Error en el login:", error);
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

export default router;
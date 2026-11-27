import request from "supertest";
import bcrypt from "bcrypt";
import app from "../index.js";
import { pool } from "../config/db.js";

describe("Pruebas de integración - Módulo Autenticación", () => {
    const emailPrueba = "test_jest_artenauta@ejemplo.com";
    const passwordPrueba = "ClaveSegura123*";

    beforeAll(async () => {
        const hash = await bcrypt.hash(passwordPrueba, 10);
        await pool.query(
            `INSERT INTO usuarios (nombre, apellido, email, clave, id_rol, estado_cuenta)
            VALUES ($1, $2, $3, $4, $5, $6)`,
            ["Usuario", "Jest", emailPrueba, hash, 1, true],
        );
    });

    afterAll(async () => {
        await pool.query("DELETE FROM usuarios WHERE email = $1", [
            emailPrueba,
        ]);
        await pool.end();
    });

    test("POST /auth/login debe responder 401 con contraseña incorrecta", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: emailPrueba, password: "PasswordIncorrecta" });

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe("Correo o contraseña incorrectos");
    });

    test("POST /auth/login debe responder 200 y entregar token JWT con credenciales válidas", async () => {
        const res = await request(app)
            .post("/auth/login")
            .send({ email: emailPrueba, password: passwordPrueba });

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body.usuario.email).toBe(emailPrueba);
    });

    test("POST /auth/forgot-password debe responder 200 con mensaje genérico si el correo no existe", async () => {
        const res = await request(app)
            .post("/auth/forgot-password")
            .send({ email: "correo_que_no_existe_999@ejemplo.com" });

        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toBe(
            "Si el correo está registrado, recibirás un enlace de recuperación.",
        );
    });

    test("POST /auth/reset-password debe responder 400 si el token es inválido o expirado", async () => {
        const res = await request(app).post("/auth/reset-password").send({
            token: "token_invalido_123",
            newPassword: "NuevaPassword123*",
        });

        expect(res.statusCode).toBe(400);
    });
});

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../index.js";
import { pool } from "../config/db.js";

describe("Pruebas de integración - Módulo Estadísticas Admin", () => {
    let tokenValido;
    const secretKey =
        process.env.JWT_SECRET || "mi_clave_super_secreta_desarrollo";

    beforeAll(() => {
        tokenValido = jwt.sign({ id_usuario: 1, id_rol: 1 }, secretKey, {
            expiresIn: "1h",
        });
    });

    afterAll(async () => {
        await pool.end();
    });

    test("GET /dashboard/estadisticas debe responder 401 si no se envía token", async () => {
        const res = await request(app).get("/dashboard/estadisticas");

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe("Acceso denegado. No hay token.");
    });

    test("GET /dashboard/estadisticas debe responder 401 si el token es inválido", async () => {
        const res = await request(app)
            .get("/dashboard/estadisticas")
            .set("Authorization", "Bearer token_falso_12345");

        expect(res.statusCode).toBe(401);
        expect(res.body.mensaje).toBe("Token inválido o expirado.");
    });

    test("GET /dashboard/estadisticas debe devolver las 4 métricas numéricas desde PostgreSQL", async () => {
        const res = await request(app)
            .get("/dashboard/estadisticas")
            .set("Authorization", `Bearer ${tokenValido}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("totalUsuarios");
        expect(res.body).toHaveProperty("totalArtistas");
        expect(res.body).toHaveProperty("totalPublicaciones");
        expect(res.body).toHaveProperty("totalComentarios");

        expect(typeof res.body.totalUsuarios).toBe("number");
        expect(typeof res.body.totalArtistas).toBe("number");
        expect(typeof res.body.totalPublicaciones).toBe("number");
        expect(typeof res.body.totalComentarios).toBe("number");
        expect(res.body.totalArtistas).toBeLessThanOrEqual(
            res.body.totalUsuarios,
        );
    });
});

import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../index.js";
import { pool } from "../config/db.js";

describe("Pruebas de integración - Módulo Usuarios", () => {
    let tokenValido;
    let idUsuarioCreado;
    const secretKey =
        process.env.JWT_SECRET || "mi_clave_super_secreta_desarrollo";
    const emailPrueba = "test_jest_usuarios_esteban@ejemplo.com";

    beforeAll(async () => {
        await pool.query("DELETE FROM usuarios WHERE email = $1", [
            emailPrueba,
        ]);

        tokenValido = jwt.sign({ id_usuario: 1, id_rol: 1 }, secretKey, {
            expiresIn: "1h",
        });
    });

    afterAll(async () => {
        await pool.query("DELETE FROM usuarios WHERE email = $1", [
            emailPrueba,
        ]);
        await pool.end();
    });

    test("POST /usuario/registro debe crear un usuario nuevo y responder 201", async () => {
        const res = await request(app).post("/usuario/registro").send({
            nombre: "Esteban",
            apellido: "TestJest",
            telefono: "3001234567",
            email: emailPrueba,
            clave: "Password123*",
            id_rol: 1,
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.mensaje).toBe("Usuario registrado exitosamente");
    });

    test("GET /usuarios debe responder 401 si no se envía token", async () => {
        const res = await request(app).get("/usuarios");

        expect(res.statusCode).toBe(401);
    });

    test("GET /usuarios debe listar y filtrar por búsqueda devolviendo el objeto roles", async () => {
        const res = await request(app)
            .get("/usuarios")
            .query({ buscar: emailPrueba, estado: "true", rol: "1" })
            .set("Authorization", `Bearer ${tokenValido}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);

        const usuario = res.body[0];
        expect(usuario.email).toBe(emailPrueba);
        expect(usuario).toHaveProperty("roles");
        expect(usuario.roles).toHaveProperty("nombre_rol");

        idUsuarioCreado = usuario.id_usuario;
    });

    test("PATCH /usuarios/:id debe actualizar los datos del usuario y responder 200", async () => {
        const res = await request(app)
            .patch(`/usuarios/${idUsuarioCreado}`)
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({
                nombre: "EstebanEditado",
                apellido: "TestActualizado",
                estado_cuenta: false,
                id_rol: 2,
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.nombre).toBe("EstebanEditado");
        expect(res.body.apellido).toBe("TestActualizado");
        expect(res.body.estado_cuenta).toBe(false);
        expect(res.body.id_rol).toBe(2);
        expect(res.body).toHaveProperty("roles");
    });

    test("PATCH /usuarios/:id debe responder 404 si el usuario no existe", async () => {
        const res = await request(app)
            .patch("/usuarios/9999999")
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({
                nombre: "Fantasma",
                apellido: "NoExiste",
                estado_cuenta: true,
                id_rol: 1,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Usuario no encontrado");
    });
});

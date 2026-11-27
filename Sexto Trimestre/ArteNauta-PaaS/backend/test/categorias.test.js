import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../index.js";
import { pool } from "../config/db.js";

describe("Pruebas de integración - Módulo Categorías", () => {
    let tokenValido;
    let idCategoriaCreada;
    const secretKey =
        process.env.JWT_SECRET || "mi_clave_super_secreta_desarrollo";
    const nombrePrueba = "Categoria_Jest_Esteban";
    const nombreEditado = "Categoria_Jest_Esteban_Editada";

    beforeAll(async () => {
        // Limpieza preventiva por si quedó algún registro de una ejecución anterior
        await pool.query(
            "DELETE FROM categorias WHERE nombre_categoria IN ($1, $2)",
            [nombrePrueba, nombreEditado],
        );

        tokenValido = jwt.sign({ id_usuario: 1, id_rol: 1 }, secretKey, {
            expiresIn: "1h",
        });
    });

    afterAll(async () => {
        await pool.query(
            "DELETE FROM categorias WHERE nombre_categoria IN ($1, $2)",
            [nombrePrueba, nombreEditado],
        );
        await pool.end();
    });

    test("GET /categorias debe responder 401 si no se envía token", async () => {
        const res = await request(app).get("/categorias");

        expect(res.statusCode).toBe(401);
    });

    test("POST /categorias debe responder 400 si faltan campos obligatorios", async () => {
        const res = await request(app)
            .post("/categorias")
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({ nombre_categoria: "SinDescripcion" });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe(
            "Faltan campos obligatorios (Nombre Categoria, Descripcion)",
        );
    });

    test("POST /categorias debe crear una categoría y responder 201", async () => {
        const res = await request(app)
            .post("/categorias")
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({
                nombre_categoria: nombrePrueba,
                descripcion: "Descripción de prueba creada desde Jest",
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id_categoria");
        expect(res.body.nombre_categoria).toBe(nombrePrueba);

        idCategoriaCreada = res.body.id_categoria;
    });

    test("GET /categorias debe filtrar correctamente usando el parámetro buscar", async () => {
        const res = await request(app)
            .get("/categorias")
            .query({ buscar: nombrePrueba })
            .set("Authorization", `Bearer ${tokenValido}`);

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(1);
        expect(res.body[0].id_categoria).toBe(idCategoriaCreada);
    });

    test("PATCH /categorias/:id debe actualizar la categoría y responder 200", async () => {
        const res = await request(app)
            .patch(`/categorias/${idCategoriaCreada}`)
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({
                nombre_categoria: nombreEditado,
                descripcion: "Descripción actualizada en prueba Jest",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.mensaje).toBe("Categoría actualizada con éxito");
        expect(res.body.categoria.nombre_categoria).toBe(nombreEditado);
    });

    test("PATCH /categorias/:id debe responder 404 si la categoría no existe", async () => {
        const res = await request(app)
            .patch("/categorias/9999999")
            .set("Authorization", `Bearer ${tokenValido}`)
            .send({
                nombre_categoria: "NoExiste",
                descripcion: "No existe",
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe("Categoría no encontrada");
    });
});

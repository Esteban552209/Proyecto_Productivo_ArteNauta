import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

jest.unstable_mockModule("../config/db.js", () => ({
  pool: { query: jest.fn() },
}));

jest.unstable_mockModule("../middlewares/verificarToken.js", () => ({
  verificarToken: (req, res, next) => next(),
}));

const { pool } = await import("../config/db.js");
const { default: router } = await import("../routes/comentarios.js");

const app = express();
app.use(express.json());
app.use("/", router);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /comentarios/:id_publicacion", () => {
  it("devuelve los comentarios de una publicación (200)", async () => {
    const mockComentarios = [
      {
        id_comentario: 1,
        id_publicacion: 10,
        contenido: "Excelente obra",
        usuarios: { id_usuario: 5, nombre: "Ana" },
      },
    ];
    pool.query.mockResolvedValue({ rows: mockComentarios });

    const res = await request(app).get("/comentarios/10");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockComentarios);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ["10"]);
  });

  it("responde 500 si ocurre un error en PostgreSQL", async () => {
    pool.query.mockRejectedValue(new Error("Error de conexión"));

    const res = await request(app).get("/comentarios/10");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Error de conexión");
  });
});

describe("POST /comentarios", () => {
  it("responde 400 si faltan campos requeridos", async () => {
    const res = await request(app).post("/comentarios").send({
      id_publicacion: 10,
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Faltan campos requeridos/i);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("crea y devuelve el nuevo comentario (201)", async () => {
    const nuevoComentario = {
      id_comentario: 25,
      id_publicacion: 10,
      id_usuario_final: 5,
      contenido: "Muy buen trazo",
      usuarios: { id_usuario: 5, nombre: "Ana" },
    };
    pool.query.mockResolvedValue({ rows: [nuevoComentario], rowCount: 1 });

    const res = await request(app).post("/comentarios").send({
      id_publicacion: 10,
      id_usuario_final: 5,
      contenido: "Muy buen trazo",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(nuevoComentario);
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining("INSERT INTO comentarios"),
      [10, 5, "Muy buen trazo", expect.any(String)]
    );
  });

  it("responde 500 si la inserción no devuelve filas (rowCount === 0)", async () => {
    pool.query.mockResolvedValue({ rows: [], rowCount: 0 });

    const res = await request(app).post("/comentarios").send({
      id_publicacion: 10,
      id_usuario_final: 5,
      contenido: "Comentario de prueba",
    });

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("No se pudo obtener el comentario insertado.");
  });
});

describe("GET /admin/comentarios", () => {
  it("devuelve todos los comentarios con datos de usuario y publicación (200)", async () => {
    const mockAdminComentarios = [
      {
        id_comentario: 1,
        contenido: "Gran trabajo",
        usuarios: { id_usuario: 5, nombre: "Ana", email: "ana@mail.com" },
        publicaciones: { id_publicacion: 10, titulo: "Atardecer" },
      },
    ];
    pool.query.mockResolvedValue({ rows: mockAdminComentarios });

    const res = await request(app).get("/admin/comentarios");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockAdminComentarios);
  });

  it("responde 500 si falla la consulta de administrador", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    pool.query.mockRejectedValue(new Error("Fallo en consulta admin"));

    const res = await request(app).get("/admin/comentarios");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Fallo en consulta admin");
    consoleSpy.mockRestore();
  });
});

describe("DELETE /comentarios/:id_comentario", () => {
  it("elimina un comentario y responde 200", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const res = await request(app).delete("/comentarios/25");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Comentario eliminado con éxito" });
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM comentarios WHERE id_comentario = $1",
      ["25"]
    );
  });

  it("responde 500 si ocurre un error al eliminar", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    pool.query.mockRejectedValue(new Error("No se pudo eliminar"));

    const res = await request(app).delete("/comentarios/25");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("No se pudo eliminar");
    consoleSpy.mockRestore();
  });
});
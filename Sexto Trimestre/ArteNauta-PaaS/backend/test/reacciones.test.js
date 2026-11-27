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
const { default: router } = await import("../routes/reacciones.js");
const app = express();
app.use(express.json());
app.use("/", router);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("POST /publicaciones/:id_publicacion/like", () => {
  it("responde 400 si falta id_usuario en el body", async () => {
    const res = await request(app).post("/publicaciones/10/like").send({});

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "El id_usuario es requerido." });
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("registra un like (registrado: true) cuando el usuario no le había dado like", async () => {
    // 1ra consulta (SELECT): no existe like previo
    pool.query.mockResolvedValueOnce({ rowCount: 0, rows: [] });
    // 2da consulta (INSERT): inserta el like
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .post("/publicaciones/10/like")
      .send({ id_usuario: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      registrado: true,
      mensaje: "Like registrado con éxito",
    });
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("INSERT INTO reacciones"),
      [expect.any(String), "like", 5, "10"]
    );
  });

  it("retira el like (registrado: false) cuando el usuario ya había dado like", async () => {
    // 1ra consulta (SELECT): ya existe el like
    pool.query.mockResolvedValueOnce({ rowCount: 1, rows: [{ id_reaccion: 99 }] });
    // 2da consulta (DELETE): elimina el like
    pool.query.mockResolvedValueOnce({ rowCount: 1 });

    const res = await request(app)
      .post("/publicaciones/10/like")
      .send({ id_usuario: 5 });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      registrado: false,
      mensaje: "Like retirado con éxito",
    });
    expect(pool.query).toHaveBeenCalledTimes(2);
    expect(pool.query).toHaveBeenNthCalledWith(
      2,
      expect.stringContaining("DELETE FROM reacciones"),
      ["10", 5, "like"]
    );
  });

  it("responde 500 si ocurre un error en la base de datos", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    pool.query.mockRejectedValueOnce(new Error("Fallo de conexión"));

    const res = await request(app)
      .post("/publicaciones/10/like")
      .send({ id_usuario: 5 });

    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: "Error interno al procesar el me gusta." });
    consoleSpy.mockRestore();
  });
});

describe("GET /publicaciones/:id_publicacion/likes-info", () => {
  it("devuelve totalLikes y usuarioDioLike cuando se envía id_usuario en query", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ totalLikes: "14", usuarioDioLike: true }],
    });

    const res = await request(app).get("/publicaciones/10/likes-info?id_usuario=5");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalLikes: 14,
      usuarioDioLike: true,
    });
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('AS "usuarioDioLike"'),
      ["10", "5", "like"]
    );
  });

  it("devuelve totalLikes y usuarioDioLike en false cuando no se envía id_usuario", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ totalLikes: "7" }],
    });

    const res = await request(app).get("/publicaciones/10/likes-info");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalLikes: 7,
      usuarioDioLike: false,
    });
    expect(pool.query).toHaveBeenCalledWith(
      expect.not.stringContaining('AS "usuarioDioLike"'),
      ["10", "like"]
    );
  });

  it("responde 500 si ocurre un error al consultar las estadísticas", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    pool.query.mockRejectedValueOnce(new Error("Error SQL"));

    const res = await request(app).get("/publicaciones/10/likes-info");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      error: "Error al obtener estadísticas de reacciones.",
    });
    consoleSpy.mockRestore();
  });
});
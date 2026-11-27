import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";

jest.unstable_mockModule("../config/db.js", () => ({
  pool: { query: jest.fn() },
}));

jest.unstable_mockModule("../middlewares/verificarToken.js", () => ({
  verificarToken: (req, res, next) => next(),
}));

jest.unstable_mockModule("axios", () => ({
  default: { get: jest.fn() },
}));

const { pool } = await import("../config/db.js");
const axios = (await import("axios")).default;
const { default: router } = await import("../routes/publicaciones.js");
const app = express();
app.use(express.json());
app.use("/", router);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /Muro-Publicaciones", () => {
it("devuelve las publicaciones con totalLikes", async () => {
  const datos = [
    { id_publicacion: 1, titulo: "A", totalLikes: "2" },
    { id_publicacion: 2, titulo: "B", totalLikes: "0" },
  ];
  pool.query.mockResolvedValue({ rows: datos });

  const res = await request(app).get("/Muro-Publicaciones");

  expect(res.status).toBe(200);
  expect(res.body[0].totalLikes).toBe(2);
  expect(res.body[1].totalLikes).toBe(0);
});

it("ordena por likes de mayor a menor", async () => {
  const datos = [
    { id_publicacion: 2, totalLikes: "2" },
    { id_publicacion: 1, totalLikes: "0" },
  ];
  pool.query.mockResolvedValue({ rows: datos });

  const res = await request(app).get("/Muro-Publicaciones?ordenLikes=desc");

  expect(res.status).toBe(200);
  expect(res.body[0].id_publicacion).toBe(2);
  expect(pool.query).toHaveBeenCalledWith(
    expect.stringContaining('ORDER BY "totalLikes" DESC'),
    expect.any(Array)
  );
});

  it("aplica el filtro de búsqueda", async () => {
    pool.query.mockResolvedValue({ rows: [] });

    await request(app).get("/Muro-Publicaciones?buscar=paisaje");

    expect(pool.query).toHaveBeenCalledWith(
      expect.stringMatching(/ILIKE/i),
      expect.arrayContaining(["%paisaje%"])
    );
  });

  it("responde 500 si PostgreSQL falla", async () => {
    pool.query.mockRejectedValue(new Error("falló la BD"));

    const res = await request(app).get("/Muro-Publicaciones");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("falló la BD");
  });
});

describe("POST /publicaciones", () => {
  it("responde 400 si faltan campos obligatorios", async () => {
    const res = await request(app).post("/publicaciones").send({ descripcion: "x" });

    expect(res.status).toBe(400);
  });

  it("responde 422 si Sightengine detecta contenido inapropiado", async () => {
    axios.get.mockResolvedValue({
      data: { status: "success", nudity: { raw: 0.9 } },
    });

    const res = await request(app).post("/publicaciones").send({
      titulo: "Obra",
      id_usuario_artista: 1,
      contenido: "https://img.com/foto.jpg",
    });

    expect(res.status).toBe(422);
    expect(pool.query).not.toHaveBeenCalled();
  });

  it("crea la publicación (201) si la imagen es segura", async () => {
    axios.get.mockResolvedValue({
      data: { status: "success", nudity: { raw: 0.01 } },
    });
    const creada = { id_publicacion: 10, titulo: "Obra" };
    pool.query.mockResolvedValue({ rows: [creada] });

    const res = await request(app).post("/publicaciones").send({
      titulo: "Obra",
      id_usuario_artista: 1,
      contenido: "https://img.com/foto.jpg",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(creada);
  });
});


describe("DELETE /publicaciones/:id_publicacion", () => {
  it("elimina una publicación y responde 200", async () => {
    pool.query.mockResolvedValue({ rowCount: 1 });

    const res = await request(app).delete("/publicaciones/10");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Publicación eliminada con éxito" });
    expect(pool.query).toHaveBeenCalledWith(
      "DELETE FROM publicaciones WHERE id_publicacion = $1",
      ["10"]
    );
  });

  it("responde 500 si ocurre un error al eliminar", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    pool.query.mockRejectedValue(new Error("No se pudo eliminar"));

    const res = await request(app).delete("/publicaciones/10");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("No se pudo eliminar");
    consoleSpy.mockRestore();
  });
});
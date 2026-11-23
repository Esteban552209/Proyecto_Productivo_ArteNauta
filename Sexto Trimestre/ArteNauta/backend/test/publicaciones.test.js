import request from "supertest";
import express from "express";
import axios from "axios";
import { supabase } from "../config/supabase.js";
import router from "./../routes/publicaciones.js";

// 1) Reemplazamos las dependencias externas por falsas
jest.mock("../config/supabase.js", () => ({
  supabase: { from: jest.fn() },
}));
jest.mock("../middlewares/verificarToken.js", () => ({
  verificarToken: (req, res, next) => next(), // deja pasar siempre
}));
jest.mock("axios");

// 2) Mini app de Express solo para las pruebas
const app = express();
app.use(express.json());
app.use("/", router);

// 3) Helper: simula la cadena de Supabase (.select().eq().order()...)
//    Cada método devuelve el mismo objeto, y al hacer "await" entrega "resultado".
const crearQuery = (resultado) => {
  const q = {};
  ["select", "insert", "update", "delete", "eq", "or", "order"].forEach((m) => {
    q[m] = jest.fn().mockReturnValue(q);
  });
  q.then = (resolve, reject) => Promise.resolve(resultado).then(resolve, reject);
  return q;
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /Muro-Publicaciones", () => {
  it("devuelve las publicaciones con totalLikes", async () => {
    const datos = [
      { id_publicacion: 1, titulo: "A", reacciones: [{ id_reaccion: 1 }, { id_reaccion: 2 }] },
      { id_publicacion: 2, titulo: "B", reacciones: [] },
    ];
    supabase.from.mockReturnValue(crearQuery({ data: datos, error: null }));

    const res = await request(app).get("/Muro-Publicaciones");

    expect(res.status).toBe(200);
    expect(res.body[0].totalLikes).toBe(2);
    expect(res.body[1].totalLikes).toBe(0);
  });

  it("ordena por likes de mayor a menor", async () => {
    const datos = [
      { id_publicacion: 1, reacciones: [] },
      { id_publicacion: 2, reacciones: [{ id_reaccion: 1 }, { id_reaccion: 2 }] },
    ];
    supabase.from.mockReturnValue(crearQuery({ data: datos, error: null }));

    const res = await request(app).get("/Muro-Publicaciones?ordenLikes=desc");

    expect(res.body[0].id_publicacion).toBe(2);
  });

  it("aplica el filtro de búsqueda", async () => {
    const query = crearQuery({ data: [], error: null });
    supabase.from.mockReturnValue(query);

    await request(app).get("/Muro-Publicaciones?buscar=paisaje");

    expect(query.or).toHaveBeenCalledWith(
      "titulo.ilike.%paisaje%,descripcion.ilike.%paisaje%"
    );
  });

  it("responde 500 si Supabase falla", async () => {
    supabase.from.mockReturnValue(
      crearQuery({ data: null, error: new Error("falló la BD") })
    );

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
    expect(supabase.from).not.toHaveBeenCalled(); // nunca llegó a guardar
  });

  it("crea la publicación (201) si la imagen es segura", async () => {
    axios.get.mockResolvedValue({
      data: { status: "success", nudity: { raw: 0.01 } },
    });
    const creada = { id_publicacion: 10, titulo: "Obra" };
    supabase.from.mockReturnValue(crearQuery({ data: [creada], error: null }));

    const res = await request(app).post("/publicaciones").send({
      titulo: "Obra",
      id_usuario_artista: 1,
      contenido: "https://img.com/foto.jpg",
    });

    expect(res.status).toBe(201);
    expect(res.body).toEqual(creada);
  });
});
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js";
import publicacionesRoutes from "./routes/publicaciones.js";
import usuariosRoutes from "./routes/usuarios.js";
import notificacionesRoutes from "./routes/notificaciones.js";
import comentariosRoutes from "./routes/comentarios.js";
import conversacionesRoutes from "./routes/conversaciones.js";
import estadisticasRoutes from "./routes/estadisticas.js";
import categoriasRoutes from "./routes/categorias.js";
import perfilesRoutes from "./routes/perfiles.js";
import reaccionesRoutes from "./routes/reacciones.js";

const app = express();

const origenesPermitidos = [
    "http://localhost:5173",
    "https://proyectoproductivoartenauta-fronten.vercel.app",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || origenesPermitidos.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Bloqueado por CORS"));
            }
        },
        credentials: true,
    }),
);

app.use(express.json());

app.use(notificacionesRoutes);
app.use(authRoutes);
app.use(publicacionesRoutes);
app.use(usuariosRoutes);
app.use(comentariosRoutes);
app.use(conversacionesRoutes);
app.use(estadisticasRoutes);
app.use(categoriasRoutes);
app.use(perfilesRoutes);
app.use(reaccionesRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de ArteNauta corriendo en el puerto ${PORT}`);
});

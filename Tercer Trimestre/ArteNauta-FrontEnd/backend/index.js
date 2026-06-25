import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js"
import publicacionesRoutes from "./routes/publicaciones.js";
import usuariosRoutes from "./routes/usuarios.js";
import notificacionesRoutes from "./routes/notificaciones.js";
import comentariosRoutes from "./routes/comentarios.js";
import conversacionesRoutes from "./routes/conversaciones.js";
import estadisticasRoutes from "./routes/estadisticas.js";
import categoriasRoutes from "./routes/categorias.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use(notificacionesRoutes);
app.use(authRoutes);
app.use(publicacionesRoutes);
app.use(usuariosRoutes);
app.use(comentariosRoutes);
app.use(conversacionesRoutes);
app.use(estadisticasRoutes);
app.use(categoriasRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de ArteNauta corriendo en el puerto ${PORT}`);
});
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.js"
import publicacionesRoutes from "./routes/publicaciones.js";
import usuariosRoutes from "./routes/usuarios.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use(publicacionesRoutes);
app.use(usuariosRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de ArteNauta corriendo en el puerto ${PORT}`);
});
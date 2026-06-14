import express from 'express';
import cors from 'cors';
import { supabase } from './config/supabase.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/Muro-Publicaciones', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('publicaciones')
            .select(`
                *,
                usuarios (
                    id_usuario,
                    nombre,
                    email
                )
            `);

        if (error) throw error;

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../lib/supabase';

// =========================
// SIGHTENGINE
// =========================

const API_USER = "741146561";

const API_SECRET = "RD3oJvHzcHqNVqoYkBxT5vmwBDTbC2DD";

const MODELS =
    "nudity-2.1,weapon,alcohol,recreational_drug,gore-2.0,violence,self-harm";

export default function FormPublicaciones({
    onNuevaPublicacion,
    onClose,
    idArtistaActivo
}) {

    // =========================
    // ESTADOS
    // =========================

    const [form, setForm] = useState({
        Titulo: '',
        Descripcion: '',
        contenido: ''
    });

    const [loading, setLoading] = useState(false);

    const [exito, setExito] = useState(false);

    const [error, setError] = useState(null);

    // =========================
    // HANDLE CHANGE
    // =========================

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // =========================
    // VALIDAR IMAGEN
    // =========================

    const validarImagen = async (urlImagen) => {

        try {

            const response = await axios.get(
                "https://api.sightengine.com/1.0/check.json",
                {
                    params: {
                        url: urlImagen,
                        models: MODELS,
                        api_user: API_USER,
                        api_secret: API_SECRET,
                    },
                }
            );

            const data = response.data;

            console.log("Resultado Sightengine:", data);

            // =========================
            // VALIDACIONES
            // =========================

            const nudity =
                data.nudity?.raw ?? 0;

            const violence =
                data.violence?.prob ?? 0;

            const gore =
                data.gore?.prob ?? 0;

            const drugs =
                data.recreational_drug?.prob ?? 0;

            // =========================
            // BLOQUEAR CONTENIDO
            // =========================

            if (
                nudity > 0.5 ||
                violence > 0.5 ||
                gore > 0.5 ||
                drugs > 0.5
            ) {

                return {
                    segura: false,
                    motivo:
                        "La imagen contiene contenido inapropiado"
                };
            }

            return {
                segura: true
            };

        } catch (err) {

            console.log(err);

            return {
                segura: false,
                motivo:
                    "No fue posible analizar la imagen"
            };
        }
    };

    // =========================
    // SUBMIT
    // =========================

    const handleSubmit = async () => {

        // =========================
        // VALIDACION CAMPOS
        // =========================

        if (
            !form.Titulo.trim() ||
            !form.Descripcion.trim()
        ) {

            setError(
                'El título y la descripción son obligatorios'
            );

            return;
        }

        setLoading(true);

        setError(null);

        try {

            // =========================
            // VALIDAR IMAGEN
            // =========================

            if (form.contenido.trim()) {

                const validacion =
                    await validarImagen(
                        form.contenido
                    );

                if (!validacion.segura) {

                    setError(validacion.motivo);

                    setLoading(false);

                    return;
                }
            }

            // =========================
            // INSERTAR EN SUPABASE ArchivoAdjunto
            // =========================

            const { data, error } =
                await supabase
                    .from('publicaciones')
                    .insert([
                        {
                            titulo: form.Titulo,
                            descripcion: form.Descripcion,
                            contenido:
                                form.contenido,
                            //likes: 0,
                            id_usuario_artista:
                                idArtistaActivo
                        }
                    ])
                    .select();

            if (error) throw error;

            console.log(
                "Publicación creada:",
                data
            );

            // =========================
            // ACTUALIZAR PADRE
            // =========================

            onNuevaPublicacion(data[0]);

            setExito(true);

            setTimeout(() => {

                setExito(false);

                onClose();

            }, 1500);

        } catch (err) {

            console.log(err.message);

            setError(err.message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{
                backgroundColor:
                    'rgba(0, 0, 0, 0.32)'
            }}
            onClick={onClose}
        >

            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) =>
                    e.stopPropagation()
                }
            >

                {/* HEADER */}

                <div className="flex justify-between items-center mb-4">

                    <h2 className="text-xl font-semibold text-gray-700">
                        Nueva publicación
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                    >
                        ✕
                    </button>

                </div>

                {/* FORM */}

                <div className="flex flex-col gap-3">

                    {/* TITULO */}

                    <input
                        type="text"
                        name="Titulo"
                        value={form.Titulo}
                        onChange={handleChange}
                        placeholder="Título"
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    {/* DESCRIPCION */}

                    <textarea
                        name="Descripcion"
                        value={form.Descripcion}
                        onChange={handleChange}
                        placeholder="Descripción"
                        rows={3}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"
                    />

                    {/* URL IMAGEN */}

                    <input
                        type="text"
                        name="Contenido"
                        value={form.Contenido}
                        onChange={handleChange}
                        placeholder="URL de la imagen"
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />

                    {/* PREVIEW */}

                    {form.contenido && (

                        <div className="w-full h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">

                            <img
                                src={form.contenido}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                    e.target.style.display =
                                        "none";
                                }}
                            />

                        </div>

                    )}

                    {/* ERROR */}

                    {error && (

                        <p className="text-red-400 text-sm">
                            {error}
                        </p>

                    )}

                    {/* EXITO */}

                    {exito && (

                        <p className="text-green-500 text-sm">
                            ¡Publicado con éxito! ✓
                        </p>

                    )}

                    {/* BOTON */}

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-cyan-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-cyan-900 transition disabled:opacity-50"
                    >

                        {loading
                            ? 'Validando y publicando...'
                            : 'Publicar'}

                    </button>

                </div>

            </div>

        </div>
    );
}
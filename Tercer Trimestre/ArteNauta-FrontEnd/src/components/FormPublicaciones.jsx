import { useState } from 'react';
import axios from 'axios';

// =========================
// SIGHTENGINE
// =========================
const API_USER = "741146561";
const API_SECRET = "RD3oJvHzcHqNVqoYkBxT5vmwBDTbC2DD";
const MODELS = "nudity-2.1,weapon,alcohol,recreational_drug,gore-2.0,violence,self-harm";

const IdArtista = localStorage.getItem("id_usuario");
const token = localStorage.getItem("token");

export default function FormPublicaciones({
    onNuevaPublicacion,
    onClose,
    idArtistaActivo
}) {

    // =========================
    // ESTADOS (Todo unificado a minúsculas/estructuras limpias)
    // =========================
    const [form, setForm] = useState({
        Titulo: '',
        Descripcion: '',
        contenido: '',
        id_usuario: '' // Usaremos este de forma consistente
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

            // Control de errores de la propia API de Sightengine (por si la URL está rota o no es pública)
            if (data.status === "failure") {
                return {
                    segura: false,
                    motivo: `Error de Sightengine: ${data.error.message}`
                };
            }

            // =========================
            // VALIDACIONES
            // =========================
            const nudity = data.nudity?.raw ?? 0;
            const violence = data.violence?.prob ?? 0;
            const gore = data.gore?.prob ?? 0;
            const drugs = data.recreational_drug?.prob ?? 0;

            // =========================
            // BLOQUEAR CONTENIDO
            // =========================
            if (nudity > 0.5 || violence > 0.5 || gore > 0.5 || drugs > 0.5) {
                return {
                    segura: false,
                    motivo: "La imagen contiene contenido inapropiado y no cumple con las normas de ArteNauta."
                };
            }

            return { segura: true };

        } catch (err) {
            console.error("Error completo de Sightengine:", err);
            return {
                segura: false,
                motivo: "No fue posible analizar la imagen. Asegúrate de que sea una URL pública válida."
            };
        }
    };

const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!form.Titulo.trim() || !form.Descripcion.trim()) {
        setError('El título y la descripción son obligatorios');
        return;
    }

    setLoading(true);
    setError(null);

    try {
   
        if (form.contenido && form.contenido.trim()) {
            const validacion = await validarImagen(form.contenido.trim());

            if (!validacion.segura) {
                setError(validacion.motivo);
                setLoading(false);
                return; 
            }
        }

        const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
        const artistaId = idArtistaActivo || usuarioSesion?.id_usuario || usuarioSesion?.id;

        if (!artistaId) {
            throw new Error("No se pudo identificar al artista activo. Inicia sesión de nuevo.");
        }

        const res = await fetch("http://localhost:3000/publicaciones", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                titulo: form.Titulo,
                descripcion: form.Descripcion,
                contenido: form.contenido,
                id_usuario_artista: artistaId 
            }),
        });

        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "No se pudo crear la publicación en el servidor.");
        }

        const nuevaPub = await res.json();
        console.log("Publicación creada con éxito:", nuevaPub);


        onNuevaPublicacion(nuevaPub);

        setExito(true);

        setTimeout(() => {
            setExito(false);
            onClose();
        }, 1500);

    } catch (err) {
        console.error(err);
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">Nueva publicación</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
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

                    {/* URL IMAGEN (¡CORREGIDO name="contenido"!) */}
                    <input
                        type="text"
                        name="contenido" 
                        value={form.contenido}
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
                                onError={(e) => { e.target.style.display = "none"; }}
                            />
                        </div>
                    )}

                    {/* ERROR */}
                    {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                    {/* EXITO */}
                    {exito && <p className="text-green-500 text-sm font-medium">¡Publicado con éxito! ✓</p>}

                    {/* BOTON */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-cyan-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                        {loading ? 'Validando y publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
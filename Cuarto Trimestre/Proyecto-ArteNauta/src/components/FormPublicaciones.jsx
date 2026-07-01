import { useState, useEffect } from "react";
import axios from "axios";

export default function FormPublicaciones({
    onNuevaPublicacion,
    onClose,
    idArtistaActivo
}) {

    const [form, setForm] = useState({
        Titulo: "",
        Descripcion: "",
        contenido: "",
        id_categoria: "",
    });

    const [categorias, setCategorias] = useState([]);
    const [loadingCategorias, setLoadingCategorias] = useState(true);
    const [loading, setLoading] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const obtenerCategorias = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await fetch("http://localhost:3000/categorias", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    }
                });

                if (!res.ok) throw new Error("Error al cargar las categorías fijas.");

                const data = await res.json();
                const lista = data.data ? data.data : data;
                setCategorias(Array.isArray(lista) ? lista : []);
            } catch (err) {
                console.error("Error cargando categorías:", err);
            } finally {
                setLoadingCategorias(false);
            }
        };

        obtenerCategorias();
    }, []);


    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
const validarImagen = async (contenido) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:3000/validar-imagen", 
                { contenido },
                {
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && { "Authorization": `Bearer ${token}` })
                    }
                }
            );
            return response.data; 

        } catch (err) {
            console.error("Error llamando a la validación del backend:", err);
            return {
                segura: false,
                motivo: err.response?.data?.motivo || "Error al conectar con el servidor de validación.",
            };
        }
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!form.Titulo.trim() || !form.Descripcion.trim()) {
            setError('El título y la descripción son obligatorios');
            return;
        }

        if (!form.id_categoria) {
            setError('Por favor, selecciona una categoría para tu obra');
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

            const payload = {
                titulo: form.Titulo,
                descripcion: form.Descripcion,
                contenido: form.contenido,
                id_usuario_artista: artistaId,
                id_categoria: Number(form.id_categoria)
            };

            console.log("Enviando al backend:", payload);

            const res = await fetch("http://localhost:3000/publicaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
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

        } 
        catch (err) 
        {
            console.error(err);
            setError(err.message);
        } 
        finally 
        {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.32)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4"
                onClick={(e) => e.stopPropagation()}
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

                    {/* NUEVO SELECT DE CATEGORÍAS FIJAS */}
                    <select
                        name="id_categoria"
                        value={form.id_categoria}
                        onChange={handleChange}
                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer"
                        disabled={loadingCategorias}
                    >
                        <option value="" disabled>
                            {loadingCategorias ? "Cargando categorías..." : "Selecciona una categoría"}
                        </option>
                        {categorias.map((cat) => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre_categoria}
                            </option>
                        ))}
                    </select>

                    {/* URL IMAGEN */}
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
                                onError={(e) => {
                                    e.target.style.display = "none";
                                }}
                            />
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <p className="text-red-500 text-sm font-medium">
                            {error}
                        </p>
                    )}

                    {/* EXITO */}
                    {exito && (
                        <p className="text-green-500 text-sm font-medium">
                            ¡Publicado con éxito! ✓
                        </p>
                    )}

                    {/* BOTON */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-cyan-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                        {loading ? "Validando y publicando..." : "Publicar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
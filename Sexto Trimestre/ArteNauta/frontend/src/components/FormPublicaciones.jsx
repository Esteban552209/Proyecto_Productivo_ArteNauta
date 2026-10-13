import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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
    const [isClosing, setIsClosing] = useState(false);

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
    const manejarCierre = () => {
        setIsClosing(true);
        setTimeout(() => {
            onClose();
        }, 250);
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        const token = localStorage.getItem("token");

        if (!form.Titulo.trim() || !form.Descripcion.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Campos incompletos",
                text: "El título y la descripción son obligatorios.",
                confirmButtonColor: "#0891b2"
            });
            return;
        }

        if (!form.id_categoria) {
            Swal.fire({
                icon: "warning",
                title: "Falta categoría",
                text: "Por favor, selecciona una categoría para tu obra.",
                confirmButtonColor: "#0891b2"
            });
            return;
        }

        setLoading(true);

        try {
            const usuarioSesion = JSON.parse(localStorage.getItem('usuario'));
            const artistaId = idArtistaActivo || usuarioSesion?.id_usuario || usuarioSesion?.id;

            const payload = {
                titulo: form.Titulo,
                descripcion: form.Descripcion,
                contenido: form.contenido,
                id_usuario_artista: artistaId,
                id_categoria: Number(form.id_categoria)
            };

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
                throw new Error(errData.error || "No se pudo crear la publicación.");
            }

            const nuevaPub = await res.json();
            Swal.fire({
                icon: "success",
                title: "¡Obra Publicada!",
                text: "Tu publicación se ha creado exitosamente en ArteNauta.",
                timer: 2000,
                showConfirmButton: false
            });

            onNuevaPublicacion(nuevaPub);
            setTimeout(() => {
                manejarCierre();
            }, 500);

        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Contenido Rechazado",
                text: err.message,
                confirmButtonColor: "#0891b2"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animar-fondo"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={manejarCierre}
        >
            <div
                className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative ${
                    isClosing ? "animar-pop-salida" : "animar-pop"
                }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* BOTÓN CIERRE */}
                <button 
                    onClick={manejarCierre} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ✕
                </button>

                {/* HEADER */}
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Nueva publicación
                    </h2>
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

                    {/* SELECT CATEGORÍAS */}
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

                    {/* BOTON ENVIAR */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-cyan-600 text-white rounded-xl py-2 mt-2 text-sm font-medium hover:bg-cyan-700 transition disabled:opacity-50"
                    >
                        {loading ? "Validando y publicando..." : "Publicar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
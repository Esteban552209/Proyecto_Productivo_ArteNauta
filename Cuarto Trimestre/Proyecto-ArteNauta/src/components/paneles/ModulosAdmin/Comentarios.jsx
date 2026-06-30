import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const API_LOCAL_COMENTARIOS = "http://localhost:3000";

function Comentarios() {
    const [comentarios, setComentarios] = useState([]);

    const obtenerComentarios = async () => {
        try {
            const res = await fetch(`${API_LOCAL_COMENTARIOS}/comentarios`);
            if (!res.ok) throw new Error("Error al obtener los comentarios");
            const data = await res.json();
            setComentarios(data);
        } catch (err) {
            console.error(err);
            Swal.fire(
                "Error",
                "No se pudieron cargar los comentarios",
                "error",
            );
        }
    };

    useEffect(() => {
        obtenerComentarios();
    }, []);

    const handleEliminar = async (url, id, setter, lista, idField = "id") => {
        const confirmacion = await Swal.fire({
            title: "¿Eliminar?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#0891b2",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const res = await fetch(`${url}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("No se pudo eliminar");
            setter(lista.filter((item) => item[idField] !== id));
            Swal.fire({
                title: "Eliminado",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                Comentarios
            </h2>
            <div className="bg-white rounded-2xl shadow overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cyan-50 text-cyan-700">
                        <tr>
                            <th className="text-left px-6 py-3">Contenido</th>
                            <th className="text-left px-6 py-3">Fecha</th>
                            <th className="text-left px-6 py-3">Usuario ID</th>
                            <th className="text-left px-6 py-3">
                                Publicación ID
                            </th>
                            <th className="text-left px-6 py-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {comentarios.map((c, i) => (
                            <tr
                                key={c.id}
                                className={
                                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                }
                            >
                                <td className="px-6 py-3 text-gray-700">
                                    {c.Contenido}
                                </td>
                                <td className="px-6 py-3 text-gray-500">
                                    {c.FechaComentario}
                                </td>
                                <td className="px-6 py-3 text-gray-500">
                                    {c.id_usuario}
                                </td>
                                <td className="px-6 py-3 text-gray-500">
                                    {c.id_Publicacion}
                                </td>
                                <td className="px-6 py-3">
                                    <button
                                        onClick={() =>
                                            handleEliminar(
                                                `${API_LOCAL_COMENTARIOS}/comentarios`,
                                                c.id,
                                                setComentarios,
                                                comentarios,
                                                "id",
                                            )
                                        }
                                        className="text-red-400 hover:text-red-600 transition"
                                        title="Eliminar comentario"
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <polyline points="3 6 5 6 21 6" />
                                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                            <path d="M10 11v6M14 11v6" />
                                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Comentarios;

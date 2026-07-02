import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_BACKEND = "http://localhost:3000";

function Comentarios() {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");

    const obtenerComentarios = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const res = await fetch(`${API_BACKEND}/admin/comentarios`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al obtener la lista de comentarios");

            const data = await res.json();
            setComentarios(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron cargar los comentarios", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerComentarios();
    }, []);
    const handleEliminar = async (idComentario) => {
        const confirmacion = await Swal.fire({
            title: "¿Eliminar comentario?",
            text: "Esta acción removerá el comentario de la obra de forma permanente",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#0891b2",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_BACKEND}/comentarios/${idComentario}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("No se pudo eliminar el comentario");
            setComentarios(comentarios.filter((com) => (com.id_comentario || com.id) !== idComentario));

            Swal.fire({
                title: "Eliminado",
                text: "El comentario ha sido removido con éxito",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };
    const comentariosFiltrados = comentarios.filter((com) =>
        com.texto_comentario?.toLowerCase().includes(busqueda.toLowerCase()) ||
        com.usuarios?.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        com.publicaciones?.titulo?.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <div className="w-full flex flex-col p-6">
            {/* CABECERA DE LA VISTA */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-cyan-800 mb-1">
                        Moderación de Comentarios
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Revisa, filtra y elimina comentarios en las publicaciones de ArteNauta.
                    </p>
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="Buscar por usuario, texto o publicación..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full md:w-80 px-4 py-2 text-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm text-gray-700"
                    />
                </div>
            </div>

            {/* TABLA DE COMENTARIOS */}
            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                {loading ? (
                    <p className="text-center text-gray-400 py-10">Cargando comentarios...</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                    <th className="p-4 font-semibold">Usuario</th>
                                    <th className="p-4 font-semibold">Comentario</th>
                                    <th className="p-4 font-semibold">Publicación (Obra)</th>
                                    <th className="p-4 font-semibold">Fecha</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comentariosFiltrados.length > 0 ? (
                                    comentariosFiltrados.map((com) => {
                                        const currentId = com.id_comentario || com.id;
                                        return (
                                            <tr key={currentId} className="border-b border-gray-50 hover:bg-gray-50/50 transition text-sm">
                                                <td className="p-4">
                                                    <div className="font-medium text-gray-700">{com.usuarios?.nombre || "Usuario Desconocido"}</div>
                                                    <div className="text-xs text-gray-400">{com.usuarios?.email}</div>
                                                </td>
                                                <td className="p-4 text-gray-600 max-w-xs break-words italic">
                                                    "{com.texto_comentario || com.contenido}"
                                                </td>
                                                <td className="p-4 text-cyan-700 font-medium">
                                                    {com.publicaciones?.titulo || "Obra eliminada"}
                                                </td>
                                                <td className="p-4 text-gray-400 text-xs">
                                                    {com.fecha_comentario 
                                                        ? new Date(com.fecha_comentario).toLocaleDateString() 
                                                        : "Sin fecha"}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <button 
                                                        onClick={() => handleEliminar(currentId)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-xl transition text-xs font-semibold"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-gray-400 py-10">
                                            No se encontraron comentarios.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Comentarios;
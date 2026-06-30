import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_LOCAL_BACKEND = "http://localhost:3000";

// ✅ Recibe idUsuario y token como props desde PerfilUsuario
function MisObras({ idUsuario, token }) {
    const [misObras, setMisObras] = useState([]);
    const [loadingObras, setLoadingObras] = useState(false);
    const [obraEditando, setObraEditando] = useState(null);
    const [formObra, setFormObra] = useState({ titulo: "", descripcion: "" });

    // ✅ Headers reutilizables con el token en cada petición
    const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
    };

    useEffect(() => {
        const obtenerMisObras = async () => {
            if (!idUsuario) return;
            try {
                setLoadingObras(true);
                const res = await fetch(
                    `${API_LOCAL_BACKEND}/mis-publicaciones/${idUsuario}`,
                    { headers }
                );
                if (!res.ok) throw new Error("Error al obtener tus publicaciones");
                const data = await res.json();
                setMisObras(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoadingObras(false);
            }
        };

        obtenerMisObras();
    }, [idUsuario]);

    const handleEliminarObra = async (idPublicacion) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar esta obra?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(
                `${API_LOCAL_BACKEND}/publicaciones/${idPublicacion}`,
                { method: "DELETE", headers }  // ✅ token incluido
            );
            if (!res.ok) throw new Error("No se pudo eliminar");

            setMisObras(misObras.filter(
                (o) => (o.id_publicacion || o.id) !== idPublicacion
            ));

            Swal.fire({ icon: "success", title: "Obra eliminada", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("Error", "No se pudo eliminar la obra", "error");
        }
    };

    const abrirModarEditarObra = (obra) => {
        setObraEditando(obra);
        setFormObra({ titulo: obra.titulo, descripcion: obra.descripcion });
    };

    const handleGuardarCambiosObra = async () => {
        const idPublicacion = obraEditando.id_publicacion || obraEditando.id;
        try {
            const res = await fetch(
                `${API_LOCAL_BACKEND}/publicaciones/${idPublicacion}`,
                {
                    method: "PUT",
                    headers,                              // ✅ token incluido
                    body: JSON.stringify(formObra),
                }
            );
            if (!res.ok) throw new Error("Error al actualizar");

            setMisObras(misObras.map((o) =>
                (o.id_publicacion || o.id) === idPublicacion
                    ? { ...o, ...formObra }
                    : o
            ));
            setObraEditando(null);

            Swal.fire({ icon: "success", title: "Publicación actualizada", timer: 1500, showConfirmButton: false });
        } catch (err) {
            Swal.fire("Error", "No se pudieron guardar los cambios", "error");
        }
    };

    return (

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-cyan-800 mb-4">Mis Obras Publicadas</h3>
                
            {loadingObras && <p className="text-sm text-gray-400 text-center py-4">Cargando tus obras...</p>}

            {!loadingObras && misObras.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Aún no tienes obras compartidas en ArteNauta.</p>
            )}

            {!loadingObras && misObras.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {misObras.map((obra) => (

                        <div key={obra.id_publicacion || obra.id} className="flex border border-gray-100 rounded-xl p-3 gap-3 bg-gray-50/50">
                            {obra.contenido && (
                                <img src={obra.contenido} alt={obra.titulo} className="w-20 h-20 object-cover rounded-lg bg-gray-200" />
                            )}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm truncate">{obra.titulo}</h4>
                                    <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">{obra.descripcion}</p>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => abrirModarEditarObra(obra)} className="text-xs bg-cyan-50 text-cyan-600 hover:bg-cyan-100 px-3 py-1.5 rounded-md font-medium transition">
                                        ✏️ Editar
                                    </button>
                                    <button onClick={() => handleEliminarObra(obra.id_publicacion || obra.id)} className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-md font-medium transition">
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal editar obra */}
            {obraEditando && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Editar Datos de la Obra</h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Título</label>
                                <input
                                    type="text"
                                    value={formObra.titulo}
                                    onChange={(e) => setFormObra({ ...formObra, titulo: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Descripción</label>
                                <textarea
                                    rows="3"
                                    value={formObra.descripcion}
                                    onChange={(e) => setFormObra({ ...formObra, descripcion: e.target.value })}
                                    className="w-full p-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none"
                                />
                            </div>
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => setObraEditando(null)} className="bg-gray-100 text-gray-600 text-sm font-medium px-4 py-2 rounded-xl hover:bg-gray-200 transition">
                                    Cancelar
                                </button>
                                <button onClick={handleGuardarCambiosObra} className="bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-cyan-700 transition">
                                    Guardar Cambios
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisObras;
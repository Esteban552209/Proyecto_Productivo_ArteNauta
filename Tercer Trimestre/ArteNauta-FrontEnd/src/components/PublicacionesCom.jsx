import { useState } from "react";
import Swal from "sweetalert2";

export default function PublicacionesCom({ item }) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(item.likes ?? item.Likes ?? 0);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [loadingCom, setLoadingCom] = useState(false);
    const [errorCom, setErrorCom] = useState(null);
    const [nuevoComentario, setNuevoComentario] = useState("");
    const [submittingCom, setSubmittingCom] = useState(false);

    // Obtener información del usuario logueado en la sesión
    const usuarioGuardado = localStorage.getItem("usuario");
    const usuarioLogueado = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    // Normalización de variables debido a posibles discrepancias de mayúsculas en Supabase / JSON-Server
    const tituloStr = item.titulo || item.Titulo || "Sin título";
    const descripcionStr = item.descripcion || item.Descripcion || "Sin descripción.";
    const contenidoUrl = item.contenido || item.Contenido || "";
    const autorNombre = item.usuarios?.nombre || "Artista";
    const autorAvatar = item.usuarios?.avatar_url || null;

    // =========================
    // LIKES
    // =========================
    const toggleLike = () => {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
    };

    const postId = item.id_publicacion || item.id;
    const userId = usuarioLogueado?.id_usuario || usuarioLogueado?.id;

    // =========================
    // ABRIR DETALLE Y COMENTARIOS
    // =========================
    const abrirDetalleModal = async () => {
        const token = localStorage.getItem("token")
        setShowDetalleModal(true);
        setLoadingCom(true);
        setErrorCom(null);

        try {
            const res = await fetch(`http://localhost:3000/comentarios/${postId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
);
            if (!res.ok) throw new Error("Error al obtener los comentarios desde el servidor.");
            const data = await res.json();
            setComentarios(data || []);
        } catch (err) {
            setErrorCom(err.message);
        } finally {
            setLoadingCom(false);
        }
    };

    // =========================
    // ENVIAR NUEVO COMENTARIO
    // =========================
    const enviarComentario = async (e) => {
        const token = localStorage.getItem("token")
        e.preventDefault();
        if (!nuevoComentario.trim()) return;

        if (!usuarioLogueado) {
            Swal.fire({
                icon: "warning",
                title: "Sesión requerida",
                text: "Debes iniciar sesión para comentar en esta publicación.",
                confirmButtonColor: "#0891b2",
            });
            return;
        }

        setSubmittingCom(true);
        try {
            const res = await fetch("http://localhost:3000/comentarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_publicacion: postId,
                    id_usuario_final: userId,
                    contenido: nuevoComentario.trim(),
                }),
            });

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "No se pudo publicar el comentario en el servidor.");
            }

            const nuevoComentarioCreado = await res.json();
            setComentarios((prev) => [...prev, nuevoComentarioCreado]);
            setNuevoComentario("");
        } catch (err) {
            console.error("Error al enviar comentario:", err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo publicar tu comentario: " + err.message,
                confirmButtonColor: "#0891b2",
            });
        } finally {
            setSubmittingCom(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition relative flex flex-col h-full justify-between">
                <div>
                    {/* Autor de la publicación */}
                    {item.usuarios && (
                        <div className="flex items-center gap-2 mb-3">
                            {autorAvatar ? (
                                <img
                                    src={autorAvatar}
                                    alt={autorNombre}
                                    className="w-7 h-7 rounded-full object-cover border border-cyan-100"
                                />
                            ) : (
                                <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-semibold text-cyan-700">
                                    {autorNombre?.charAt(0).toUpperCase()}
                                </div>
                            )}
                            <span className="text-xs font-semibold text-gray-500">
                                {autorNombre}
                            </span>
                        </div>
                    )}

                    {/* Imagen con Hover estilo Instagram */}
                    {contenidoUrl && (
                        <div 
                            onClick={abrirDetalleModal}
                            className="w-full h-48 rounded-lg mb-3 overflow-hidden bg-gray-100 cursor-pointer relative group"
                        >
                            <img
                                src={contenidoUrl}
                                alt={tituloStr}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) =>
                                    (e.target.src = "https://placehold.co/300x200?text=Sin+imagen")
                                }
                            />
                            {/* Overlay de Hover estilo Instagram */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white font-medium text-sm select-none">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
                                </svg>
                                <span>{likes}</span>
                            </div>
                        </div>
                    )}

                    {/* Titulo */}
                    <p className="font-semibold text-gray-800 truncate" title={tituloStr}>
                        {tituloStr}
                    </p>

                    {/* Descripcion */}
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={descripcionStr}>
                        {descripcionStr}
                    </p>
                </div>

                {/* BOTONES */}
                <div className="flex items-center gap-3 mt-4">
                    {/* LIKE */}
                    <button
                        onClick={toggleLike}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition text-xs font-medium ${
                            liked
                                ? "border-red-200 bg-red-50 text-red-500"
                                : "border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400"
                        }`}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor" strokeWidth="2">
                            <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
                        </svg>
                        {likes}
                    </button>

                    {/* COMENTARIOS */}
                    <button
                        onClick={abrirDetalleModal}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-100 text-gray-400 hover:border-cyan-200 hover:text-cyan-600 transition text-xs font-medium cursor-pointer"
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Comentarios
                    </button>
                </div>
            </div>

            {/* MODAL DE DETALLE (ESTILO INSTAGRAM) */}
            {showDetalleModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
                    onClick={() => setShowDetalleModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] max-h-[750px] flex flex-col md:flex-row overflow-hidden relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Botón Cerrar en Pantallas Pequeñas */}
                        <button
                            onClick={() => setShowDetalleModal(false)}
                            className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-base cursor-pointer md:hidden"
                        >
                            ✕
                        </button>

                        {/* SECCIÓN IZQUIERDA: IMAGEN (60% en escritorio) */}
                        <div className="md:w-3/5 bg-neutral-950 flex items-center justify-center relative select-none h-[40%] md:h-full">
                            {contenidoUrl ? (
                                <img
                                    src={contenidoUrl}
                                    alt={tituloStr}
                                    className="w-full h-full object-contain"
                                    onError={(e) =>
                                        (e.target.src = "https://placehold.co/600x400?text=Sin+imagen")
                                    }
                                />
                            ) : (
                                <div className="text-gray-400 text-sm">Sin vista previa</div>
                            )}
                        </div>

                        {/* SECCIÓN DERECHA: DETALLES Y COMENTARIOS (40% en escritorio) */}
                        <div className="md:w-2/5 flex flex-col h-[60%] md:h-full bg-white relative">
                            {/* CABECERA (Autor de la publicación) */}
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {autorAvatar ? (
                                        <img
                                            src={autorAvatar}
                                            alt={autorNombre}
                                            className="w-8 h-8 rounded-full object-cover border border-cyan-100"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-sm font-semibold text-cyan-700">
                                            {autorNombre?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <span className="font-semibold text-gray-800 text-sm">{autorNombre}</span>
                                </div>

                                {/* Botón Cerrar en Escritorio */}
                                <button
                                    onClick={() => setShowDetalleModal(false)}
                                    className="hidden md:flex text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* CONTENIDO DESCRIPCIÓN + COMENTARIOS (Scrollable) */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Título y Descripción de la obra (estilo pie de foto) */}
                                <div className="flex items-start gap-3 pb-4 border-b border-gray-50">
                                    {autorAvatar ? (
                                        <img
                                            src={autorAvatar}
                                            alt={autorNombre}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-semibold text-cyan-700">
                                            {autorNombre?.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">
                                            {autorNombre} <span className="font-medium text-cyan-700 ml-1">@{tituloStr}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1 whitespace-pre-wrap">{descripcionStr}</p>
                                    </div>
                                </div>

                                {/* Listado de Comentarios */}
                                {loadingCom ? (
                                    <p className="text-center text-gray-400 py-6 text-sm">Cargando comentarios...</p>
                                ) : errorCom ? (
                                    <p className="text-center text-red-400 py-6 text-sm">Error: {errorCom}</p>
                                ) : comentarios.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                        </svg>
                                        <p className="text-xs mt-2 font-medium">Aún no hay comentarios</p>
                                        <p className="text-[10px] text-gray-400 mt-0.5">¡Sé el primero en comentar!</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {comentarios.map((c) => (
                                            <div key={c.id} className="flex items-start gap-3">
                                                {c.usuarios?.avatar_url ? (
                                                    <img
                                                        src={c.usuarios.avatar_url}
                                                        alt={c.usuarios.nombre}
                                                        className="w-7 h-7 rounded-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-semibold text-cyan-700">
                                                        {c.usuarios?.nombre?.charAt(0).toUpperCase() ?? '?'}
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs text-gray-800">
                                                        <span className="font-semibold">{c.usuarios?.nombre ?? "Usuario"}</span>
                                                        <span className="text-gray-600 ml-2 whitespace-pre-wrap">{c.contenido}</span>
                                                    </p>
                                                    <span className="text-[9px] text-gray-400 mt-1 block">
                                                        {c.fecha_comentario ? new Date(c.fecha_comentario).toLocaleDateString() : "Reciente"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* PIE DE PÁGINA: LIKES & INTERACCIONES */}
                            <div className="p-4 border-t border-gray-100 bg-gray-50 flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {/* Botón de Like */}
                                        <button
                                            onClick={toggleLike}
                                            className={`p-1.5 rounded-full border transition-all duration-200 ${
                                                liked
                                                    ? "border-red-200 bg-red-50 text-red-500 scale-105"
                                                    : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-400 hover:scale-105"
                                            }`}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24"
                                                fill={liked ? "currentColor" : "none"}
                                                stroke="currentColor" strokeWidth="2">
                                                <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
                                            </svg>
                                        </button>
                                        <span className="text-xs font-semibold text-gray-700">
                                            {likes} {likes === 1 ? "me gusta" : "me gustas"}
                                        </span>
                                    </div>
                                </div>

                                {/* Formulario para comentar */}
                                {usuarioLogueado ? (
                                    <form onSubmit={enviarComentario} className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Añade un comentario..."
                                            value={nuevoComentario}
                                            onChange={(e) => setNuevoComentario(e.target.value)}
                                            className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 text-black placeholder-gray-400"
                                            disabled={submittingCom}
                                        />
                                        <button
                                            type="submit"
                                            className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium text-xs px-3.5 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                            disabled={submittingCom || !nuevoComentario.trim()}
                                        >
                                            {submittingCom ? "..." : "Publicar"}
                                        </button>
                                    </form>
                                ) : (
                                    <div className="text-center bg-gray-100 rounded-lg py-2 border border-gray-200">
                                        <p className="text-[10px] text-gray-500">
                                            Debes <span className="font-semibold text-cyan-600">iniciar sesión</span> para poder comentar.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
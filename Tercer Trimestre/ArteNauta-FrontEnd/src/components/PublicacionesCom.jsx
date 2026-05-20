import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function PublicacionesCom({ item }) {

    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(item.likes ?? 0);
    const [showComentarios, setShowComentarios] = useState(false);
    const [comentarios, setComentarios] = useState([]);
    const [loadingCom, setLoadingCom] = useState(false);
    const [errorCom, setErrorCom] = useState(null);

    // =========================
    // LIKES
    // =========================

    const toggleLike = () => {
        setLiked(!liked);
        setLikes((prev) => liked ? prev - 1 : prev + 1);
    };

    // =========================
    // ABRIR COMENTARIOS — ahora con JOIN a usuarios
    // =========================

    const abrirComentarios = async () => {
        setShowComentarios(true);
        setLoadingCom(true);
        setErrorCom(null);

        try {
            const { data, error } = await supabase
                .from("comentarios")
                .select(`
                    *,
                    usuarios (
                        id_usuario,
                        nombre
                    )
                `)
                .eq("id_publicacion", item.id)
                .order("fecha_comentario", { ascending: true });

            if (error) throw error;
            setComentarios(data);

        } catch (err) {
            setErrorCom(err.message);
        } finally {
            setLoadingCom(false);
        }
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition relative">

                {/* NUEVO — Autor de la publicación (viene del JOIN en usePost) */}
                {item.usuarios && (
                    <div className="flex items-center gap-2 mb-3">
                        {item.usuarios.avatar_url ? (
                            <img
                                src={item.usuarios.avatar_url}
                                alt={item.usuarios.nombre}
                                className="w-7 h-7 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-medium text-cyan-700">
                                {item.usuarios.nombre?.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-xs font-medium text-gray-500">
                            {item.usuarios.nombre}
                        </span>
                    </div>
                )}

                {/* Imagen */}
                {item.contenido && (
                    <div className="w-full rounded-lg mb-3 overflow-hidden bg-gray-100">
                        <img
                            src={item.contenido}
                            alt={item.titulo}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                                (e.target.src = "https://placehold.co/300x200?text=Sin+imagen")
                            }
                        />
                    </div>
                )}

                {/* Titulo */}
                <p className="font-semibold text-gray-700">{item.titulo}</p>

                {/* Descripcion */}
                <p className="text-sm text-gray-400 mt-1 mb-4">{item.descripcion}</p>

                {/* BOTONES */}
                <div className="flex items-center gap-3">

                    {/* LIKE */}
                    <button
                        onClick={toggleLike}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition text-sm ${
                            liked
                                ? "border-red-400 bg-red-50 text-red-500"
                                : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
                        }`}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24"
                            fill={liked ? "currentColor" : "none"}
                            stroke="currentColor" strokeWidth="1.5">
                            <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
                        </svg>
                        {likes}
                    </button>

                    {/* COMENTARIOS */}
                    <button
                        onClick={abrirComentarios}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-cyan-300 hover:text-cyan-500 transition text-sm cursor-pointer"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24"
                            fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        Comentarios
                    </button>

                </div>
            </div>

            {/* MODAL COMENTARIOS */}
            {showComentarios && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
                    onClick={() => setShowComentarios(false)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* HEADER */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700">Comentarios</h2>
                                <p className="text-xs text-gray-400 mt-0.5">{item.titulo}</p>
                            </div>
                            <button
                                onClick={() => setShowComentarios(false)}
                                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
                            >✕</button>
                        </div>

                        {/* CUERPO */}
                        <div className="overflow-y-auto flex-1 p-5">

                            {loadingCom && (
                                <p className="text-center text-gray-400 py-8">Cargando comentarios...</p>
                            )}

                            {errorCom && (
                                <p className="text-center text-red-400 py-8">Error: {errorCom}</p>
                            )}

                            {!loadingCom && !errorCom && comentarios.length === 0 && (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                                    <svg width="40" height="40" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="1.2">
                                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                    </svg>
                                    <p className="text-sm mt-3">Aún no hay comentarios</p>
                                </div>
                            )}

                            {/* ACTUALIZADO — Avatar y nombre real del usuario */}
                            {!loadingCom && !errorCom && comentarios.map((c) => (
                                <div key={c.id} className="border-b border-gray-50 py-3 last:border-0">
                                    <div className="flex items-center gap-2 mb-1">

                                        {c.usuarios?.avatar_url ? (
                                            <img
                                                src={c.usuarios.avatar_url}
                                                alt={c.usuarios.nombre}
                                                className="w-7 h-7 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-medium text-cyan-700">
                                                {c.usuarios?.nombre?.charAt(0).toUpperCase() ?? '?'}
                                            </div>
                                        )}

                                        <span className="text-xs font-medium text-gray-600">
                                            {c.usuarios?.nombre ?? 'Usuario desconocido'}
                                        </span>

                                        <span className="text-xs text-gray-400 ml-auto">
                                            {new Date(c.fecha_comentario).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-600 pl-9">{c.contenido}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
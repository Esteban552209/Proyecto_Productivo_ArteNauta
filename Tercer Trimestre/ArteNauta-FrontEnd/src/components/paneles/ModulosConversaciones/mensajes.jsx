import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3000";

function Mensajes() {
    const [conversaciones, setConversaciones] = useState([]);
    const [convActiva, setConvActiva] = useState(null);
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const bottomRef = useRef(null);

    const token = localStorage.getItem("token");
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));

    // Cargar conversaciones del usuario
    const obtenerConversaciones = async () => {
        try {
            const res = await fetch(`${API}/conversaciones`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) return manejarExpiracion();
            const data = await res.json();
            setConversaciones(data);
        } catch {
            Swal.fire("Error", "No se pudieron cargar las conversaciones", "error");
        }
    };

    // Cargar mensajes de la conversación activa
    const obtenerMensajes = async (id_conversacion) => {
        try {
            const res = await fetch(`${API}/conversaciones/${id_conversacion}/mensajes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) return manejarExpiracion();
            const data = await res.json();
            setMensajes(data);
        } catch {
            Swal.fire("Error", "No se pudieron cargar los mensajes", "error");
        }
    };

    const manejarExpiracion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        Swal.fire({
            icon: "warning",
            title: "Sesión Expirada",
            text: "Tu sesión ha terminado por seguridad. Vuelve a ingresar.",
            confirmButtonColor: "#0891b2",
        }).then(() => window.location.reload());
    };

    const seleccionarConversacion = (conv) => {
        setConvActiva(conv.id_conversacion);
        obtenerMensajes(conv.id_conversacion);
    };

    const enviarMensaje = async () => {
        if (!texto.trim() || !convActiva) return;

        try {
            const res = await fetch(`${API}/conversaciones/${convActiva}/mensajes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ contenido: texto }),
            });
            if (res.status === 401) return manejarExpiracion();
            const nuevo = await res.json();
            setMensajes((prev) => [...prev, nuevo]);
            setTexto("");
        } catch {
            Swal.fire("Error", "No se pudo enviar el mensaje", "error");
        }
    };

    const eliminarMensaje = async (id_mensaje) => {
        const confirm = await Swal.fire({
            title: "¿Eliminar mensaje?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        try {
            const res = await fetch(`${API}/mensajes/${id_mensaje}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 401) return manejarExpiracion();
            setMensajes((prev) => prev.filter((m) => m.id_mensaje !== id_mensaje));
        } catch {
            Swal.fire("Error", "No se pudo eliminar el mensaje", "error");
        }
    };

    // Scroll automático al último mensaje
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [mensajes]);

    useEffect(() => {
        obtenerConversaciones();
    }, []);

    return (
        <section className="flex h-[75vh] rounded-2xl shadow overflow-hidden border border-gray-200">

            {/* Lista de conversaciones */}
            <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
                <h2 className="text-lg font-bold text-cyan-800 px-4 py-4 border-b">
                    Conversaciones
                </h2>
                {conversaciones.length === 0 && (
                    <p className="text-sm text-gray-400 px-4 py-6">Sin conversaciones aún.</p>
                )}
                {conversaciones.map((c) => (
                    <div
                        key={c.id_conversacion}
                        onClick={() => seleccionarConversacion(c.conversaciones)}
                        className={`px-4 py-3 cursor-pointer transition hover:bg-cyan-50 border-b border-gray-100 ${
                            convActiva === c.id_conversacion ? "bg-cyan-100" : ""
                        }`}
                    >
                        <p className="text-sm font-medium text-gray-700">
                            Conversación #{c.id_conversacion}
                        </p>
                        <p className="text-xs text-gray-400">
                            {new Date(c.conversaciones.fecha_creacion).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>

            {/* Panel de mensajes */}
            <div className="flex flex-col flex-1 bg-gray-50">
                {!convActiva ? (
                    <div className="flex flex-1 items-center justify-center text-gray-400 text-sm">
                        Selecciona una conversación para ver los mensajes
                    </div>
                ) : (
                    <>
                        {/* Mensajes */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2">
                            {mensajes.map((m) => {
                                const esMio = m.id_usuario === usuarioLocal?.id_usuario;
                                return (
                                    <div
                                        key={m.id_mensaje}
                                        className={`flex flex-col max-w-[65%] ${esMio ? "self-end items-end" : "self-start items-start"}`}
                                    >
                                        <span className="text-xs text-gray-400 mb-1">
                                            {esMio ? "Tú" : `${m.usuarios?.nombre} ${m.usuarios?.apellido}`}
                                        </span>
                                        <div
                                            className={`px-4 py-2 rounded-2xl text-sm shadow-sm ${
                                                esMio
                                                    ? "bg-cyan-600 text-white rounded-br-none"
                                                    : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                                            }`}
                                        >
                                            {m.contenido}
                                        </div>
                                        <span className="text-[10px] text-gray-400 mt-1">
                                            {new Date(m.fecha_envio).toLocaleTimeString()}
                                        </span>
                                        {esMio && (
                                            <button
                                                onClick={() => eliminarMensaje(m.id_mensaje)}
                                                className="text-[10px] text-red-400 hover:text-red-600 mt-0.5"
                                            >
                                                Eliminar
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                            <div ref={bottomRef} />
                        </div>

                        {/* Input envío */}
                        <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
                            <input
                                type="text"
                                value={texto}
                                onChange={(e) => setTexto(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            />
                            <button
                                onClick={enviarMensaje}
                                className="bg-cyan-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-cyan-700 transition"
                            >
                                Enviar
                            </button>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default Mensajes;
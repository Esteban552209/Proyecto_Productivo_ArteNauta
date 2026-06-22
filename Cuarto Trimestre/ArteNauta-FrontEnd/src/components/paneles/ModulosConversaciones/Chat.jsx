import { useState, useEffect } from "react";

const API = "http://localhost:3000";

function Chat({ usuario, chatActivo, nombreChat }) {
    const [mensajes, setMensajes] = useState([]);
    const [texto, setTexto] = useState("");
    const usuarioId = usuario?.id_usuario || usuario?.id;

    const cargarMensajes = () => {
        if (!chatActivo) return;
        fetch(`${API}/mensajes/${chatActivo}`)
            .then((res) => res.json())
            .then((data) => setMensajes(data || []))
            .catch((err) => console.error("Error al cargar mensajes:", err));
    };

    useEffect(() => {
        if (!chatActivo) return;
        cargarMensajes();

        const intervalo = setInterval(cargarMensajes, 3000);
        return () => clearInterval(intervalo);
    }, [chatActivo]);

    const enviarMensaje = () => {
        if (!texto.trim() || !usuarioId) return;

        fetch(`${API}/mensajes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_conversacion: chatActivo,
                id_usuario: usuarioId,
                contenido: texto.trim(),
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo enviar el mensaje");
                return res.json();
            })
            .then(() => {
                setTexto("");
                cargarMensajes();
            })
            .catch((err) => console.error(err));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold">
                    {nombreChat?.charAt(0).toUpperCase() || "?"}
                </div>
                <p className="font-semibold text-gray-700">{nombreChat}</p>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-2 bg-slate-50">
                {mensajes.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm mt-10">
                        Aún no hay mensajes. ¡Di hola!
                    </p>
                ) : (
                    mensajes.map((m) => {
                        const esMio = String(m.id_usuario) === String(usuarioId);
                        return (
                            <div
                                key={m.id_mensaje || m.id}
                                className={`flex ${esMio ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                                        esMio
                                            ? "bg-cyan-600 text-white rounded-br-sm shadow-sm"
                                            : "bg-white text-gray-700 rounded-bl-sm border border-gray-100 shadow-sm"
                                    }`}
                                >
                                    <p>{m.contenido}</p>
                                    <p
                                        className={`text-[10px] mt-1 text-right ${
                                            esMio ? "text-cyan-200" : "text-gray-400"
                                        }`}
                                    >
                                        {m.fecha_envio ? new Date(m.fecha_envio).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) : "Reciente"}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <div className="px-4 py-3 border-t border-gray-100 flex gap-2 bg-white">
                <input
                    type="text"
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && enviarMensaje()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 text-black border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button
                    onClick={enviarMensaje}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl transition flex items-center justify-center"
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default Chat;

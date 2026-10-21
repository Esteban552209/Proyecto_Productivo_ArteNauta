import { useState, useEffect } from "react";

const API = "http://localhost:3000";

function ListaConversaciones({ usuario, onAbrirChat, recargar }) {
    const [conversaciones, setConversaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarConversaciones = () => {
            const token = localStorage.getItem("token");
            const usuarioId = usuario?.id_usuario || usuario?.id;
            if (!usuarioId) return;

            setLoading(true);
            fetch(`${API}/conversaciones/usuario/${usuarioId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setConversaciones(data || []);
                })
                .catch((err) => console.error("Error cargando chats:", err))
                .finally(() => setLoading(false));
        };
    cargarConversaciones();
    }, [recargar]);

    return (
        <div className="bg-white rounded-2xl shadow p-4 flex-1 overflow-y-auto min-h-[300px]">
            <h2 className="text-lg font-bold text-cyan-700 mb-3">
                Conversaciones
            </h2>

            {loading ? (
                <p className="text-gray-400 text-sm text-center py-6">
                    Cargando...
                </p>
            ) : conversaciones.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-6">
                    No tienes conversaciones aún.
                </p>
            ) : (
                conversaciones.map((conv) => (
                    <button
                        key={conv.id_conversacion}
                        onClick={() =>
                            onAbrirChat(conv.id_conversacion, conv.nombre_otro)
                        }
                        className="w-full flex items-center gap-3 p-3 rounded-xl mb-1 hover:bg-cyan-50 transition text-left"
                    >
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold flex-shrink-0">
                            {conv.nombre_otro?.charAt(0).toUpperCase() || "?"}
                        </div>
                        <p className="font-medium text-gray-700 truncate">
                            {conv.nombre_otro}
                        </p>
                    </button>
                ))
            )}
        </div>
    );
}

export default ListaConversaciones;

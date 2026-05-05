import { useState, useEffect } from "react";

const API = "http://localhost:3002";

function ListaConversaciones({ usuario, onAbrirChat, recargar }) {
    const [conversaciones, setConversaciones] = useState([]);

    const cargarConversaciones = () => {

        fetch(`${API}/participantes`)
        .then((res) => res.json())
        .then((todosLosParticipantes) => {
            // 2. Filtramos nuestras participaciones usando comparación débil (==)
            const misParticipaciones = todosLosParticipantes.filter(
                (p) => p.id_usuario == usuario.id
            );

            // Limpiamos antes de recargar
            setConversaciones([]);

            misParticipaciones.forEach((p) => {
                // 3. Buscamos quién más está en esta conversación
                const otrosEnConv = todosLosParticipantes.filter(
                    (x) => x.id_conversacion == p.id_conversacion && x.id_usuario != usuario.id
                );

                // Tomamos al primer "otro" que encontremos
                const otro = otrosEnConv[0];

                setConversaciones((prev) => {
                    const yaExiste = prev.find(
                        (c) => c.id_conversacion == p.id_conversacion
                    );
                    if (yaExiste) return prev;

                    return [
                        ...prev,
                        {
                            id_conversacion: p.id_conversacion,
                            nombre_otro: otro?.nombre_usuario || "Usuario",
                        },
                    ];
                });
            });
        })
        .catch(err => console.error("Error cargando chats:", err));
    };

    useEffect(() => {
        cargarConversaciones();
    }, [recargar]);

    return (
        <div className="bg-white rounded-2xl shadow p-4 flex-1 overflow-y-auto">
            <h2 className="text-lg font-bold text-cyan-700 mb-3">
                Conversaciones
            </h2>

            {conversaciones.length === 0 ? (
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
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-700 font-bold flex-shrink-0">
                            {conv.nombre_otro[0].toUpperCase()}
                        </div>
                        <p className="font-medium text-gray-700">
                            {conv.nombre_otro}
                        </p>
                    </button>
                ))
            )}
        </div>
    );
}

export default ListaConversaciones;

import { useState } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3000";

function BuscarUsuario({ usuario, onChatIniciado }) {
    const [correo, setCorreo] = useState("");
    const [resultado, setResultado] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const usuarioId = usuario?.id_usuario || usuario?.id;

    const buscar = () => {
        if (!correo.trim()) return;

        fetch(`${API}/usuarios/buscar?email=${correo.trim()}`)
            .then((res) => {
                if (!res.ok) throw new Error("Error en la búsqueda");
                return res.json();
            })
            .then((data) => {
                if (!data) {
                    setResultado(null);
                    setMensaje("No se encontró ningún usuario con ese correo.");
                } else if (String(data.id_usuario || data.id) === String(usuarioId)) {
                    setResultado(null);
                    setMensaje("Ese eres tú 😄");
                } else {
                    setResultado(data);
                    setMensaje("");
                }
            })
            .catch((err) => {
                console.error(err);
                setResultado(null);
                setMensaje("Ocurrió un error al buscar el usuario.");
            });
    };

    const iniciarChat = () => {
        const targetId = resultado?.id_usuario || resultado?.id;

        if (!usuarioId || !targetId) return;

        fetch(`${API}/participantes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id_usuario: usuarioId,
                id_participante: targetId,
            }),
        })
            .then((res) => {
                if (!res.ok) throw new Error("No se pudo iniciar la conversación");
                return res.json();
            })
            .then((data) => {
                const nombreOtro = `${resultado.nombre} ${resultado.apellido || ""}`.trim();
                if (data.existe) {
                    Swal.fire({
                        title: "Chat ya existe",
                        text: `Ya tienes una conversación con ${nombreOtro}`,
                        icon: "info",
                        confirmButtonColor: "#0891b2",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } else {
                    Swal.fire({
                        title: "¡Chat creado!",
                        text: `Ahora puedes chatear con ${nombreOtro}`,
                        icon: "success",
                        confirmButtonColor: "#0891b2",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
                limpiar();
                onChatIniciado(data.id_conversacion, nombreOtro);
            })
            .catch((err) => {
                console.error(err);
                Swal.fire("Error", "No se pudo iniciar el chat.", "error");
            });
    };

    // Limpia el input y el resultado
    const limpiar = () => {
        setCorreo("");
        setResultado(null);
        setMensaje("");
    };

    return (
        <div className="bg-white rounded-2xl shadow p-6 max-w-md">
            <h2 className="text-lg font-bold text-cyan-700 mb-4">Nuevo chat</h2>

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    placeholder="Buscar por correo..."
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && buscar()}
                    className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-300"
                />
                <button
                    onClick={buscar}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm transition cursor-pointer"
                >
                    Buscar
                </button>
            </div>

            {mensaje && <p className="text-sm text-gray-400">{mensaje}</p>}

            {resultado && (
                <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                    <div>
                        <p className="font-semibold text-gray-700">
                            {resultado.nombre} {resultado.apellido || ""}
                        </p>
                        <p className="text-xs text-gray-400">
                            {resultado.email || resultado.correo}
                        </p>
                    </div>
                    <button
                        onClick={iniciarChat}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg text-sm transition cursor-pointer"
                    >
                        Chatear
                    </button>
                </div>
            )}
        </div>
    );
}

export default BuscarUsuario;

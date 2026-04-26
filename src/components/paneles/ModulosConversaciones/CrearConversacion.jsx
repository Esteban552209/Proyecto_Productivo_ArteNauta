import { useState } from "react";
import Swal from "sweetalert2";

const API = "http://localhost:3002";

function BuscarUsuario({ usuario, onChatIniciado }) {
    const [correo, setCorreo] = useState("");
    const [resultado, setResultado] = useState(null);
    const [mensaje, setMensaje] = useState("");

    const buscar = () => {
        if (!correo.trim()) return;

        fetch(`${API}/usuarios?correo=${correo}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.length === 0) {
                    setResultado(null);
                    setMensaje("No se encontró ningún usuario con ese correo.");
                } else if (data[0].id === usuario.id) {
                    setResultado(null);
                    setMensaje("Ese eres tú 😄");
                } else {
                    setResultado(data[0]);
                    setMensaje("");
                }
            });
    };

    const iniciarChat = () => {
        fetch(`${API}/participantes?id_usuario=${usuario.id}`)
            .then((res) => res.json())
            .then((misParticipaciones) => {
                // 2. Por cada una, reviso si el otro usuario ya está
                const checks = misParticipaciones.map((p) =>
                    fetch(
                        `${API}/participantes?id_conversacion=${p.id_conversacion}`,
                    )
                        .then((res) => res.json())
                        .then((todos) => {
                            const encontrado = todos.some(
                                (x) =>
                                    String(x.id_usuario) ===
                                    String(resultado.id),
                            );
                            return {
                                encontrado,
                                id_conversacion: p.id_conversacion,
                            };
                        }),
                );

                Promise.all(checks).then((resultados) => {
                    const yaExiste = resultados.find((r) => r.encontrado);

                    if (yaExiste) {
                        // ✅ Ya existe — solo abrir sin crear
                        Swal.fire({
                            title: "Chat ya existe",
                            text: `Ya tienes una conversación con ${resultado.nombre}`,
                            icon: "info",
                            confirmButtonColor: "#0891b2",
                            timer: 2000,
                            showConfirmButton: false,
                        });
                        limpiar();
                        onChatIniciado(
                            yaExiste.id_conversacion,
                            resultado.nombre,
                        );
                        return;
                    }

                    // 3. No existe — crear nueva conversación
                    fetch(`${API}/conversaciones`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            fecha_creacion: new Date().toISOString(),
                        }),
                    })
                        .then((res) => res.json())
                        .then((nuevaConv) => {
                            const agregarYo = fetch(`${API}/participantes`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_conversacion: nuevaConv.id,
                                    id_usuario: usuario.id,
                                    nombre_usuario: usuario.nombre,
                                }),
                            });

                            const agregarOtro = fetch(`${API}/participantes`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    id_conversacion: nuevaConv.id,
                                    id_usuario: resultado.id,
                                    nombre_usuario: resultado.nombre,
                                }),
                            });

                            Promise.all([agregarYo, agregarOtro]).then(() => {
                                Swal.fire({
                                    title: "¡Chat creado!",
                                    text: `Ahora puedes chatear con ${resultado.nombre}`,
                                    icon: "success",
                                    confirmButtonColor: "#0891b2",
                                    timer: 2000,
                                    showConfirmButton: false,
                                });
                                limpiar();
                                onChatIniciado(nuevaConv.id, resultado.nombre);
                            });
                        });
                });
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
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-xl text-sm transition"
                >
                    Buscar
                </button>
            </div>

            {mensaje && <p className="text-sm text-gray-400">{mensaje}</p>}

            {resultado && (
                <div className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
                    <div>
                        <p className="font-semibold text-gray-700">
                            {resultado.nombre} {resultado.apellido}
                        </p>
                        <p className="text-xs text-gray-400">
                            {resultado.correo}
                        </p>
                    </div>
                    <button
                        onClick={iniciarChat}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg text-sm transition"
                    >
                        Chatear
                    </button>
                </div>
            )}
        </div>
    );
}

export default BuscarUsuario;

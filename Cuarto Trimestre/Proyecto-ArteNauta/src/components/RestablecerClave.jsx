import { useState, useEffect } from "react";
import Swal from "sweetalert2";

function RestablecerClave() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const tokenUrl = params.get("token");
        if (tokenUrl) {
            setToken(tokenUrl);
        } else {
            Swal.fire({
                icon: "error",
                title: "Enlace inválido",
                text: "No se encontró un token válido en la URL.",
                confirmButtonColor: "#0891b2",
            });
        }
    }, []);

    const manejarEnvio = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "Las contraseñas no coinciden.",
                confirmButtonColor: "#0891b2",
            });
            return;
        }

        if (password.length < 6) {
            Swal.fire({
                icon: "warning",
                title: "Atención",
                text: "La contraseña debe tener al menos 6 caracteres.",
                confirmButtonColor: "#0891b2",
            });
            return;
        }

        setCargando(true);

        try {
            const respuesta = await fetch("http://localhost:3000/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token, newPassword: password }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                Swal.fire({
                    icon: "success",
                    title: "¡Contraseña actualizada!",
                    text: data.mensaje,
                    confirmButtonColor: "#0891b2",
                }).then(() => {
                    window.location.href = "/";
                });
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: data.mensaje || "No se pudo actualizar la contraseña.",
                    confirmButtonColor: "#0891b2",
                });
            }
        } catch (error) {
            console.log(error);
            Swal.fire({
                icon: "error",
                title: "Error de conexión",
                text: "No es posible conectarse al servidor",
                confirmButtonColor: "#0891b2",
            });
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-t from-cyan-800 via-cyan-600 to-cyan-950 flex flex-col items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animar-pop border border-cyan-100">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-cyan-600 mb-2">ArteNauta</h1>
                    <h2 className="text-xl font-semibold text-gray-800">Crear Nueva Contraseña</h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Por favor, ingresa tu nueva contraseña a continuación.
                    </p>
                </div>

                <form onSubmit={manejarEnvio} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Al menos 6 caracteres"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            placeholder="Repite tu contraseña"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-shadow"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        disabled={cargando || !token}
                        className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                    >
                        {cargando ? "Actualizando..." : "Restablecer Contraseña"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-sm text-cyan-600 hover:text-cyan-800 font-medium hover:underline transition-all">
                        ← Volver a la página principal
                    </a>
                </div>
            </div>
        </div>
    );
}

export default RestablecerClave;

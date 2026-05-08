import { useState } from "react"
import { supabase } from "../lib/supabase"
import Swal from "sweetalert2";

function LoginModal({ isOpen, onClose, setVista }) {
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    if (!isOpen) return null

    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            const { data: usuarioEncontrado, error } = await supabase
                .from("usuarios")
                .select("*")
                .eq("email", correo)
                .eq("clave", password)
                .maybeSingle();

            if (error) throw error;
            
            if (usuarioEncontrado) {
                localStorage.setItem("usuario", JSON.stringify(usuarioEncontrado));
                const token = `jwt-${usuarioEncontrado.id_rol}--${Date.now()}`;
                localStorage.setItem("token", token);
                onClose();
                setVista(usuarioEncontrado.id_rol); // Cambiado a id_rol
                Swal.fire({
                    icon: "success",
                    title: "¡Bienvenido de nuevo!",
                    text: "Inicio de sesión exitoso",
                    confirmButtonColor: "#0891b2",
                    background: "#ecfeff",
                    color: "#164e63",
                    timer: 2000,
                    showConfirmButton: false,
                });
            } else {
                console.log("datos incorrectos");
                Swal.fire({
                    icon: "error",
                    title: "Ups...",
                    text: "Correo o contraseña incorrectos",
                    confirmButtonColor: "#0891b2",
                    confirmButtonText: "Intentar de nuevo",
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
        }
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-center text-cyan-600 mb-1">
                    Iniciar Sesión
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Bienvenido de nuevo a ArteNauta
                </p>
                <div className="flex flex-col gap-4">
                    <form onSubmit={manejarLogin}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input type="email" placeholder="Correo Electronico" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" value={correo} onChange={(e) => setCorreo(e.target.value)} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <input type="password" placeholder="Contraseña" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <p className="text-right text-sm text-cyan-600 my-3 hover:underline cursor-pointer">
                            ¿Olvidaste tu contraseña?
                        </p>
                        <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition">
                            Entrar
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-500">
                        ¿No tienes cuenta? {" "}
                        <span className="text-cyan-600 hover:underline cursor-pointer font-medium">
                            Regístrate
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
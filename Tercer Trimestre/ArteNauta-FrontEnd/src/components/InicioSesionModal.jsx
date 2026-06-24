import { useState } from "react";
import Swal from "sweetalert2";

function LoginModal({ isOpen, onClose, setVista, alCambiarAModalRegistro }) {
    const [isClosing, setIsClosing] = useState(false);
    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    
    if (!isOpen && !isClosing) return null;

    const manejarCierre = () => {
        setIsClosing(true); 
        setTimeout(() => {
            onClose(); 
            setIsClosing(false); 
        }, 300); 
    };

    const manejarLogin = async (e) => {
        e.preventDefault();

        try {
            const respuesta = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: correo, password: password }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                localStorage.setItem("usuario", JSON.stringify(data.usuario));
                localStorage.setItem("token", data.token);
                
                onClose();
                setVista(data.usuario.id_rol);
                
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
                console.log(data.mensaje);
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
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm animar-fondo" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative ${isClosing ? "animar-pop-salida" : "animar-pop"}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={manejarCierre} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl animar-pop">
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
                        <div className="mt-4">
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
                        <span onClick={alCambiarAModalRegistro} className="text-cyan-600 hover:underline cursor-pointer font-medium">
                            Regístrate
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginModal;
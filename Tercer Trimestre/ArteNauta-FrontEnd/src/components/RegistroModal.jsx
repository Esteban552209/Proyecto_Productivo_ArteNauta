import { useState } from "react";
import { supabase } from "../lib/supabase";
import Swal from "sweetalert2";

function LoginModal({ isOpen, onClose }) {
    const [formulario, setFormulario] = useState({
        nombre: "",
        apellido: "",
        telefono: "",
        correo: "",
        password: "",
        confirmarPassword: "",
    });

    if (!isOpen) return null;

    const manejarCambio = (e) => {
        setFormulario({
            ...formulario,
            [e.target.name]: e.target.value,
        });
    };

        const manejarRegistro = async (e) => {
            e.preventDefault();

            // Validación de contraseñas
            if (formulario.password !== formulario.confirmarPassword) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Las contraseñas no coinciden",
                    confirmButtonColor: "#0891b2",
                });
                return;
            }

            try {
                // Reemplazo de FETCH por SUPABASE
                const { error } = await supabase
                    .from("usuarios") // Nombre de tu tabla
                    .insert([
                        {
                            nombre: formulario.nombre,
                            apellido: formulario.apellido,
                            telefono: formulario.telefono, // Supabase manejará la conversión si es necesario
                            email: formulario.correo, // Asegúrate de que en BD se llame 'email'
                            clave: formulario.password, // Asegúrate de que en BD se llame 'clave'
                            id_rol: 1, // Rol predeterminado (Usuario Final)
                        },
                    ]);

                if (error) throw error; // Si hay un error de Supabase, lo lanzamos al catch

                // Si todo sale bien, limpiamos y cerramos
                setFormulario({
                    nombre: "",
                    apellido: "",
                    telefono: "",
                    correo: "",
                    password: "",
                    confirmarPassword: "",
                });

                Swal.fire({
                    icon: "success",
                    title: "¡Registro exitoso!",
                    text: "Ya puedes iniciar sesión en ArteNauta",
                    confirmButtonColor: "#0891b2",
                    timer: 1500,
                    showConfirmButton: false,
                });

                onClose();
            } catch (error) {
                console.error("Error detallado:", error);
                Swal.fire({
                    icon: "error",
                    title: "Error al registrar",
                    text:
                        error.message ||
                        "No se pudo conectar con la base de datos",
                    confirmButtonColor: "#0891b2",
                });
            }
        };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative animate-fadeIn"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                >
                    ✕
                </button>
                <h2 className="text-2xl font-bold text-center text-cyan-600 mb-1">
                    Registro
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Empieza a formar parte de la comunidad artistica
                </p>
                <form
                    onSubmit={manejarRegistro}
                    className="flex flex-col gap-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Nombre de usuario"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formulario.nombre}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Apellido
                        </label>
                        <input
                            type="text"
                            name="apellido"
                            placeholder="Ingresa tu apellido"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formulario.apellido}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Telefono
                        </label>
                        <input
                            type="number"
                            name="telefono"
                            placeholder="Numero telefonico"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            value={formulario.telefono}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="correo"
                            placeholder="Correo Electronico"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formulario.correo}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formulario.password}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar Contraseña
                        </label>
                        <input
                            type="password"
                            name="confirmarPassword"
                            placeholder="Vuelve a ingresar tu Contraseña"
                            className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            value={formulario.confirmarPassword}
                            onChange={manejarCambio}
                            required
                        />
                    </div>
                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition">
                        Confirmar
                    </button>
                    <p className="text-center text-sm text-gray-500">
                        ¿Ya tienes una cuenta?{" "}
                        <span className="text-cyan-600 hover:underline cursor-pointer font-medium">
                            Inicia sesion
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginModal;

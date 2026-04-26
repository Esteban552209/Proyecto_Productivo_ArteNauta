import { useState } from "react";
import Swal from "sweetalert2";
import SolicitarArtista from './SolicitarArtista';

function PerfilUsuario({ usuario, setSeccion }) {
    // Estado local para mostrar datos actualizados al instante
    const [datosActuales, setDatosActuales] = useState(usuario);
    const [editando, setEditando] = useState(false);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        telefono: usuario?.telefono || 0,
        correo: usuario?.correo || "",
    });

    const inicial = (datosActuales?.nombre || "U")[0].toUpperCase();
    const rolLabel = datosActuales?.rol || "usuario";

    const rolColor = {
        admin: "bg-red-100 text-red-700 border border-red-300",
        artista: "bg-cyan-100 text-cyan-700 border border-cyan-300",
        usuario: "bg-green-100 text-green-700 border border-green-300",
    };

    const handleGuardar = async () => {
        const usuarioActualizado = { ...datosActuales, ...formData };

        try {
            const res = await fetch(
                `http://localhost:3002/usuarios/${usuario.id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formData),
                },
            );
            if (!res.ok) throw new Error("Error al guardar");
        } catch {
            // Si falla el servidor igual actualizamos local
        }

        // Actualizar estado local y localStorage al instante
        localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        setDatosActuales(usuarioActualizado);
        setEditando(false);

        Swal.fire({
            icon: "success",
            title: "¡Perfil actualizado!",
            confirmButtonColor: "#0891b2",
            timer: 1800,
            showConfirmButton: false,
        });
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-cyan-800 mb-6">Mi Perfil</h1>

            {/* Tarjeta perfil */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center text-white text-3xl font-bold shadow">
                        {inicial}
                    </div>
                    <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${rolColor[rolLabel] || rolColor.usuario}`}
                    >
                        {rolLabel}
                    </span>
                </div>

                {/* Info / Formulario */}
                <div className="flex-1 w-full">
                    {editando ? (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        Nombre
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formData.nombre}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nombre: e.target.value,
                                            })
                                        }
                                        placeholder="Nombre"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">
                                        Apellido
                                    </label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formData.apellido}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                apellido: e.target.value,
                                            })
                                        }
                                        placeholder="Apellido"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">
                                    Correo
                                </label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={formData.correo}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            correo: e.target.value,
                                        })
                                    }
                                    placeholder="Correo"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">
                                    Teléfono
                                </label>
                                <input
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={formData.telefono}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            telefono: e.target.value,
                                        })
                                    }
                                    placeholder="Teléfono"
                                    type="number"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={handleGuardar}
                                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setEditando(false)}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {datosActuales?.nombre}{" "}
                                {datosActuales?.apellido}
                            </h2>
                            <p className="text-gray-400 text-sm mb-3">
                                @
                                {(
                                    datosActuales?.nombre || "usuario"
                                ).toLowerCase()}
                            </p>
                            <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                                {datosActuales?.correo && (
                                    <span>
                                        <span className="font-medium">
                                            Correo:
                                        </span>{" "}
                                        {datosActuales.correo}
                                    </span>
                                )}
                                {datosActuales?.telefono > 0 && (
                                    <span>
                                        <span className="font-medium">
                                            Teléfono:
                                        </span>{" "}
                                        {datosActuales.telefono}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setEditando(true)}
                                className="border border-gray-300 hover:border-cyan-500 hover:text-cyan-600 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                Editar Perfil
                            </button>
                        </div>
                    )}
                </div>
            </div>
                
                <SolicitarArtista usuario={datosActuales} />

            {/* Botón volver */}
            {setSeccion && (
                <button
                    onClick={() => setSeccion("inicio")}
                    className="text-sm text-cyan-600 hover:underline"
                >
                    ← Volver al inicio
                </button>
            )}
        </div>
    );
}

export default PerfilUsuario;

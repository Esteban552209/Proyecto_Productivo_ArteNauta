import { useState } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/supabase";
import MisObras from "./MisObras";

function PerfilUsuario({ usuario, setSeccion }) {
    const [datosActuales, setDatosActuales] = useState(usuario);
    const [editando, setEditando] = useState(false);
    const [solicitando, setSolicitando] = useState(false);
    const [formData, setFormData] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        telefono: usuario?.telefono || 0,
        email: usuario?.email || "",
    });

    const inicial = (datosActuales?.nombre || "U")[0].toUpperCase();
    const rolMap = { 1: "Usuario Final", 2: "Artista", 3: "Admin" };
    const rolLabel = rolMap[datosActuales?.id_rol] || "usuario";
    const rolKey = { 1: "usuario", 2: "artista", 3: "admin" }[datosActuales?.id_rol] || "usuario";
    const rolColor = {
        admin: "bg-red-100 text-red-700 border border-red-300",
        artista: "bg-cyan-100 text-cyan-700 border border-cyan-300",
        usuario: "bg-green-100 text-green-700 border border-green-300",
    };
    const token = localStorage.getItem("token");

    const handleGuardar = async () => {
        const usuarioActualizado = { ...datosActuales, ...formData };
        try {
            const { error } = await supabase
                .from("usuarios")
                .update({
                    nombre: formData.nombre,
                    apellido: formData.apellido,
                    telefono: formData.telefono,
                    email: formData.email,
                })
                .eq("id_usuario", usuario.id_usuario);
            if (error) throw error;
        } catch (err) {
            console.error(err);
        }

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

    const handleSolicitarArtista = async () => {
        const confirm = await Swal.fire({
            title: "¿Solicitar ser artista?",
            text: "Se enviará una solicitud al administrador para cambiar tu rol.",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0891b2",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, solicitar",
            cancelButtonText: "Cancelar",
        });

        if (!confirm.isConfirmed) return;

        setSolicitando(true);
        try {
            const { data: existentes, error: errCheck } = await supabase
                .from("solicitudes")
                .select("id_solicitud")
                .eq("id_usuario", usuario?.id_usuario)
                .eq("estado_solicitud", "Pendiente");

            if (errCheck) throw errCheck;

            if (existentes && existentes.length > 0) {
                Swal.fire({
                    icon: "info",
                    title: "Ya tienes una solicitud pendiente",
                    text: "El administrador aún no ha respondido.",
                    confirmButtonColor: "#0891b2",
                });
                return;
            }

            const { error: errInsert } = await supabase
                .from("solicitudes")
                .insert({
                    id_usuario: usuario?.id_usuario,
                    fecha_solicitud: new Date().toISOString(),
                    tipo_solicitud: "artista",
                    estado_solicitud: "Pendiente",
                });

            if (errInsert) throw errInsert;

            Swal.fire({
                icon: "success",
                title: "¡Solicitud enviada!",
                text: "El administrador revisará tu solicitud pronto.",
                confirmButtonColor: "#0891b2",
                timer: 2500,
                showConfirmButton: false,
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: error?.message || "No se pudo enviar la solicitud.",
                confirmButtonColor: "#0891b2",
            });
        } finally {
            setSolicitando(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-cyan-800 mb-6">Mi Perfil</h1>

            {/* Tarjeta perfil */}
            <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center text-white text-3xl font-bold shadow">
                        {inicial}
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${rolColor[rolKey]}`}>
                        {rolLabel}
                    </span>
                </div>

                <div className="flex-1 w-full">
                    {editando ? (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Apellido</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formData.apellido}
                                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Email</label>
                                <input
                                    type="email"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Teléfono</label>
                                <input
                                    type="number"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={formData.telefono}
                                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button onClick={handleGuardar} className="bg-cyan-600 hover:bg-cyan-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition">
                                    Guardar
                                </button>
                                <button onClick={() => setEditando(false)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition">
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {datosActuales?.nombre} {datosActuales?.apellido}
                            </h2>
                            <p className="text-gray-400 text-sm mb-3">
                                @{(datosActuales?.nombre || "usuario").toLowerCase()}
                            </p>
                            <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                                {datosActuales?.email && (
                                    <span><span className="font-medium">Email:</span> {datosActuales.email}</span>
                                )}
                                {datosActuales?.telefono > 0 && (
                                    <span><span className="font-medium">Teléfono:</span> {datosActuales.telefono}</span>
                                )}
                            </div>
                            <button onClick={() => setEditando(true)} className="border border-gray-300 hover:border-cyan-500 hover:text-cyan-600 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition">
                                Editar Perfil
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Solicitar ser Artista — solo Usuario_Final */}
            {datosActuales?.id_rol === 1 && (
                <div className="bg-white rounded-2xl shadow p-6 mb-6">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">🎨</span>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">¿Quieres ser Artista?</h3>
                            <p className="text-xs text-gray-400">Solicita el cambio de rol al administrador.</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSolicitarArtista}
                        disabled={solicitando}
                        className="w-full border-2 border-dashed border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 text-cyan-600 py-3 rounded-xl font-semibold transition text-sm disabled:opacity-50"
                    >
                        {solicitando ? "Enviando solicitud..." : "Solicitar ser Artista"}
                    </button>
                </div>
            )}

            {datosActuales?.id_rol === 2 && (
                <MisObras
                    idUsuario={datosActuales?.id_usuario || datosActuales?.id}
                    token={token}
                />
            )}

            {setSeccion && (
                <button onClick={() => setSeccion("inicio")} className="text-sm text-cyan-600 hover:underline mt-2 block">
                    &larr; Volver al inicio
                </button>
            )}
        </div>
    );
}

export default PerfilUsuario;
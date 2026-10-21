import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { supabase } from "../../lib/supabase";
import MisObras from "./MisObras";

const API_LOCAL_BACKEND = "http://localhost:3000";

function PerfilUsuario({ usuario, setSeccion }) {
    const token = localStorage.getItem("token");

    const [perfil, setPerfil] = useState(null); 
    const [cargandoPerfil, setCargandoPerfil] = useState(true);

    const [editandoDatos, setEditandoDatos] = useState(false);
    const [guardandoDatos, setGuardandoDatos] = useState(false);
    const [formDatos, setFormDatos] = useState({ nombre: "", apellido: "", telefono: "" });

    const [editandoExtra, setEditandoExtra] = useState(false);
    const [guardandoExtra, setGuardandoExtra] = useState(false);
    const [formExtra, setFormExtra] = useState({ descripcion: "", ocupacion: "" });

    const [solicitando, setSolicitando] = useState(false);

    const rolMap = { 1: "Usuario Final", 2: "Artista", 3: "Admin" };
    const rolLabel = rolMap[usuario?.id_rol] || "usuario";
    const rolKey = { 1: "usuario", 2: "artista", 3: "admin" }[usuario?.id_rol] || "usuario";
    const rolColor = {
        admin: "bg-red-100 text-red-700 border border-red-300",
        artista: "bg-cyan-100 text-cyan-700 border border-cyan-300",
        usuario: "bg-green-100 text-green-700 border border-green-300",
    };

    const inicial = (perfil?.nombre || usuario?.nombre || "U")[0].toUpperCase();

    const obtenerPerfil = async () => {
        try {
            setCargandoPerfil(true);
            const res = await fetch(`${API_LOCAL_BACKEND}/perfil`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al obtener el perfil");

            const data = await res.json();
            setPerfil(data);
            setFormDatos({
                nombre: data.nombre || "",
                apellido: data.apellido || "",
                telefono: data.telefono || "",
            });
            setFormExtra({
                descripcion: data.descripcion || "",
                ocupacion: data.ocupacion || "",
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "No se pudo cargar tu perfil",
                confirmButtonColor: "#0891b2",
                confirmButtonText: "Entendido",
            });
        } finally {
            setCargandoPerfil(false);
        }
    };

    useEffect(() => {
        obtenerPerfil();
    }, []);

    const handleGuardarDatos = async () => {
        setGuardandoDatos(true);
        try {
            const res = await fetch(`${API_LOCAL_BACKEND}/perfil/usuario`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nombre: formDatos.nombre,
                    apellido: formDatos.apellido,
                    telefono: formDatos.telefono,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al actualizar tus datos");

            setPerfil((prev) => ({ ...prev, ...formDatos }));
            setEditandoDatos(false);

            Swal.fire({
                icon: "success",
                title: "¡Perfil actualizado!",
                confirmButtonColor: "#0891b2",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: err.message || "No se pudieron guardar tus datos",
                confirmButtonColor: "#0891b2",
                confirmButtonText: "Intentar de nuevo",
            });
        } finally {
            setGuardandoDatos(false);
        }
    };

    const handleGuardarExtra = async () => {
        setGuardandoExtra(true);
        try {
            const res = await fetch(`${API_LOCAL_BACKEND}/perfil`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    descripcion: formExtra.descripcion,
                    ocupacion: formExtra.ocupacion,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al guardar la información");

            setPerfil((prev) => ({
                ...prev,
                descripcion: data.descripcion,
                ocupacion: data.ocupacion,
                foto_perfil: data.foto_perfil,
            }));
            setEditandoExtra(false);

            Swal.fire({
                icon: "success",
                title: "¡Información guardada!",
                confirmButtonColor: "#0891b2",
                timer: 1800,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: err.message || "No se pudo guardar la información",
                confirmButtonColor: "#0891b2",
                confirmButtonText: "Intentar de nuevo",
            });
        } finally {
            setGuardandoExtra(false);
        }
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

    if (cargandoPerfil) {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center text-gray-400">
                Cargando perfil...
            </div>
        );
    }

    const tieneInfoExtra = perfil?.descripcion || perfil?.ocupacion || perfil?.foto_perfil;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-cyan-800 mb-6">Mi Perfil</h1>

            <div className="bg-white rounded-2xl shadow p-6 mb-6 flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-2 min-w-[90px]">
                    {perfil?.foto_perfil ? (
                        <img
                            src={perfil.foto_perfil}
                            alt="Foto de perfil"
                            className="w-20 h-20 rounded-full object-cover shadow"
                        />
                    ) : (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-800 flex items-center justify-center text-white text-3xl font-bold shadow">
                            {inicial}
                        </div>
                    )}
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${rolColor[rolKey]}`}>
                        {rolLabel}
                    </span>
                </div>

                <div className="flex-1 w-full">
                    {editandoDatos ? (
                        <div className="flex flex-col gap-3">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formDatos.nombre}
                                        onChange={(e) => setFormDatos({ ...formDatos, nombre: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-500 mb-1 block">Apellido</label>
                                    <input
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        value={formDatos.apellido}
                                        onChange={(e) => setFormDatos({ ...formDatos, apellido: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-500 mb-1 block">Teléfono</label>
                                <input
                                    type="tel"
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                    value={formDatos.telefono}
                                    onChange={(e) => setFormDatos({ ...formDatos, telefono: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-2 mt-1">
                                <button
                                    onClick={handleGuardarDatos}
                                    disabled={guardandoDatos}
                                    className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                    {guardandoDatos ? "Guardando..." : "Guardar"}
                                </button>
                                <button
                                    onClick={() => setEditandoDatos(false)}
                                    disabled={guardandoDatos}
                                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition"
                                >
                                    Cancelar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 mb-1">
                                {perfil?.nombre} {perfil?.apellido}
                            </h2>
                            <p className="text-gray-400 text-sm mb-3">
                                @{(perfil?.nombre || "usuario").toLowerCase()}
                            </p>
                            <div className="flex flex-col gap-1 text-sm text-gray-600 mb-4">
                                {perfil?.email && (
                                    <span><span className="font-medium">Email:</span> {perfil.email}</span>
                                )}
                                {perfil?.telefono && (
                                    <span><span className="font-medium">Teléfono:</span> {perfil.telefono}</span>
                                )}
                            </div>
                            <button
                                onClick={() => setEditandoDatos(true)}
                                className="border border-gray-300 hover:border-cyan-500 hover:text-cyan-600 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                Editar Perfil
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow p-6 mb-6">
                {editandoExtra ? (
                    <div className="flex flex-col gap-3">
                        <h3 className="font-bold text-gray-800 text-sm mb-1">Información adicional</h3>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Ocupación</label>
                            <input
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                placeholder="Ej. Ilustradora freelance"
                                value={formExtra.ocupacion}
                                onChange={(e) => setFormExtra({ ...formExtra, ocupacion: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-gray-500 mb-1 block">Descripción</label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none h-24"
                                placeholder="Cuéntanos un poco sobre ti..."
                                value={formExtra.descripcion}
                                onChange={(e) => setFormExtra({ ...formExtra, descripcion: e.target.value })}
                            />
                        </div>
                        <div className="flex gap-2 mt-1">
                            <button
                                onClick={handleGuardarExtra}
                                disabled={guardandoExtra}
                                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white px-5 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                {guardandoExtra ? "Guardando..." : "Guardar"}
                            </button>
                            <button
                                onClick={() => setEditandoExtra(false)}
                                disabled={guardandoExtra}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2 rounded-lg text-sm font-semibold transition"
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                ) : tieneInfoExtra ? (
                    <div>
                        <h3 className="font-bold text-gray-800 text-sm mb-2">Información adicional</h3>
                        {perfil?.ocupacion && (
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="font-medium">Ocupación:</span> {perfil.ocupacion}
                            </p>
                        )}
                        {perfil?.descripcion && (
                            <p className="text-sm text-gray-600 mb-3">{perfil.descripcion}</p>
                        )}
                        <button
                            onClick={() => setEditandoExtra(true)}
                            className="border border-gray-300 hover:border-cyan-500 hover:text-cyan-600 text-gray-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                        >
                            Editar información
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <p className="text-sm text-gray-400 mb-3">
                            Aún no has añadido información a tu perfil.
                        </p>
                        <button
                            onClick={() => setEditandoExtra(true)}
                            className="border-2 border-dashed border-cyan-300 hover:border-cyan-500 hover:bg-cyan-50 text-cyan-600 px-5 py-2 rounded-xl font-semibold transition text-sm"
                        >
                            + Añade info a tu perfil
                        </button>
                    </div>
                )}
            </div>

            {usuario?.id_rol === 1 && (
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

            {usuario?.id_rol === 2 && (
                <MisObras
                    idUsuario={usuario?.id_usuario}
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

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import Swal from "sweetalert2";

function SolicitarArtista() {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idUsuario = usuario?.id_usuario;
    const idRol = usuario?.id_rol;

    const [solicitud, setSolicitud] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [cargando, setCargando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mostrarForm, setMostrarForm] = useState(false);

    // Solo visible para rol usuario (id_rol === 1)
    if (idRol !== 1) return null;

    useEffect(() => { cargar(); }, []);

    async function cargar() {
        const { data } = await supabase
            .from("solicitudes")
            .select("*")
            .eq("id_usuario", idUsuario)
            .eq("tipo_solicitud", "artista")
            .order("fecha_solicitud", { ascending: false })
            .limit(1)
            .maybeSingle();
        setSolicitud(data);
        setCargando(false);
    }

   async function enviar() {
    setEnviando(true);
    try {
        const { data: pendienteExistente, error: errorCheck } = await supabase
            .from("solicitudes")
            .select("id_solicitud")
            .eq("id_usuario", idUsuario)
            .eq("tipo_solicitud", "artista")
            .eq("estado_solicitud", "pendiente")
            .maybeSingle();

        if (errorCheck) throw errorCheck;

        if (pendienteExistente) {
            await cargar(); 
            Swal.fire({
                icon: "info",
                title: "Ya tienes una solicitud pendiente",
                text: "Espera la respuesta del administrador antes de enviar otra.",
                confirmButtonColor: "#0891b2",
            });
            setEnviando(false);
            return;
        }

        const { error } = await supabase
            .from("solicitudes")
            .insert({
                id_usuario: idUsuario,
                tipo_solicitud: "artista",
                estado_solicitud: "pendiente",
                mensaje: mensaje.trim() || null,
                fecha_solicitud: new Date().toISOString(),
            });

        if (error) throw error;

        const { data: admins } = await supabase
            .from("usuarios")
            .select("id_usuario")
            .eq("id_rol", 3);

        if (admins?.length) {
            await supabase.from("notificaciones").insert(
                admins.map(a => ({
                    id_usuario: a.id_usuario,
                    asunto: "Nueva solicitud de artista",
                    descripcion: `${usuario.nombre} quiere convertirse en artista.`,
                    tipo_notificacion: "nueva_solicitud_artista",
                    leida: false,
                    fecha_notificacion: new Date().toISOString(),
                }))
            );
        }

        setMostrarForm(false);
        setMensaje("");
        await cargar();

        Swal.fire({
            icon: "success",
            title: "¡Solicitud enviada!",
            text: "Te notificaremos cuando el administrador responda.",
            confirmButtonColor: "#0891b2",
            timer: 2500,
            showConfirmButton: false,
        });
    } catch (err) {
        console.error(err);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo enviar la solicitud. Intenta de nuevo.",
            confirmButtonColor: "#0891b2",
        });
    } finally {
        setEnviando(false);
    }
}

    if (cargando) return null;

    // Ya tiene solicitud pendiente (Icono de reloj SVG)
    if (solicitud?.estado_solicitud === "pendiente") {
        return (
            <div className="flex gap-3 items-start p-4 bg-yellow-50 border border-yellow-200 rounded-xl mt-4">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                    <p className="font-semibold text-yellow-800">Solicitud en revisión</p>
                    <p className="text-sm text-yellow-700 mt-1">
                        Tu solicitud está siendo revisada. Te notificaremos cuando haya una respuesta.
                    </p>
                </div>
            </div>
        );
    }

    // Rechazada — puede volver a intentar (Icono de advertencia SVG)
    if (solicitud?.estado_solicitud === "rechazada") {
        return (
            <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                    <p className="font-semibold text-red-800">Solicitud no aprobada</p>
                    <p className="text-sm text-red-700 mt-1">Puedes volver a intentarlo.</p>
                    <button
                        onClick={() => setMostrarForm(true)}
                        className="mt-2 text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-lg transition"
                    >
                        Volver a solicitar
                    </button>
                </div>
            </div>
        );
    }

    if (!mostrarForm) {
        return (
            <button
                onClick={() => setMostrarForm(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition"
            >
                 Solicitar ser artista
            </button>
        );
    }

    return (
        <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
            <h3 className="font-semibold text-gray-800">Solicitar ser artista</h3>
            <p className="text-sm text-gray-600">Cuéntanos sobre tu trabajo (opcional):</p>
            <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Describe tu experiencia o motivación..."
                rows={3}
                maxLength={500}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="flex gap-2 justify-end">
                <button
                    onClick={() => { setMostrarForm(false); setMensaje(""); }}
                    disabled={enviando}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100"
                >
                    Cancelar
                </button>
                <button
                    onClick={enviar}
                    disabled={enviando}
                    className="px-4 py-2 text-sm bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-semibold rounded-lg transition"
                >
                    {enviando ? "Enviando..." : "Enviar solicitud"}
                </button>
            </div>
        </div>
    );
}

export default SolicitarArtista;
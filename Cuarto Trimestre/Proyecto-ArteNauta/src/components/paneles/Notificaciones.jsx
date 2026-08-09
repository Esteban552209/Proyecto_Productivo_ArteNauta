import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';

const API = 'http://localhost:3000';

const iconosNotificacion = {
    solicitud_aprobada: (
        <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    solicitud_rechazada: (
        <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
    censura_obra: (
        <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
    ),
    advertencia: (
        <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
    ),
    mensaje_admin: (
        <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    like_publicacion: (
        <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
        </svg>
    ),
    comentario_publicacion: (
        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
    Mensaje: (
        <svg className="w-5 h-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
    ),
};

function Notificaciones({ usuario, setVista }) {
    const idUsuario = usuario?.id_usuario;
    const idRol = Number(usuario?.id_rol);
    const token = localStorage.getItem('token');

    const [notificaciones, setNotificaciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const ref = useRef(null);

    // Badge: solo cuenta las no leídas + solicitudes pendientes
    const totalBadge = notificaciones.filter(n => !n.leida).length + solicitudes.length;

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    useEffect(() => {
        if (!idUsuario) return;
        cargar();

        const nombreCanalNotif = `notif-${idUsuario}`;
        const nombreCanalSol = `solicitudes-${idUsuario}`;
        const nombreCanalRol = `rol-usuario-${idUsuario}`;

        supabase.getChannels().forEach(ch => {
            const topic = ch.topic.replace('realtime:', '');
            if (topic === nombreCanalNotif || topic === nombreCanalSol || topic === nombreCanalRol) {
                supabase.removeChannel(ch);
            }
        });

        // Canal notificaciones en tiempo real
        const canal = supabase
            .channel(nombreCanalNotif)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notificaciones',
                filter: `id_usuario=eq.${idUsuario}`,
            }, payload => {
                setNotificaciones(prev => [payload.new, ...prev]);
            })
            .subscribe();

        // Canal solicitudes (solo admin)
        let canalSol = null;
        if (idRol === 3) {
            canalSol = supabase
                .channel(nombreCanalSol)
                .on('postgres_changes', {
                    event: '*', schema: 'public', table: 'solicitudes',
                }, () => cargarSolicitudes())
                .subscribe();
        }

        // Canal cambio de rol
        const canalRol = supabase
            .channel(nombreCanalRol)
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'usuarios',
                filter: `id_usuario=eq.${idUsuario}`,
            }, async (payload) => {
                const nuevoRol = Number(payload.new.id_rol);
                const usuarioActual = JSON.parse(localStorage.getItem('usuario'));
                if (nuevoRol !== Number(usuarioActual?.id_rol)) {
                    localStorage.setItem('usuario', JSON.stringify({ ...usuarioActual, id_rol: nuevoRol }));
                    await Swal.fire({
                        icon: 'success',
                        title: '¡Ahora eres Artista!',
                        text: 'Serás redirigido a tu nuevo panel.',
                        confirmButtonColor: '#0891b2',
                        confirmButtonText: 'Ir a mi panel',
                    });
                    setVista(nuevoRol);
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(canal);
            supabase.removeChannel(canalRol);
            if (canalSol) supabase.removeChannel(canalSol);
        };
    }, [idUsuario, idRol]);

    useEffect(() => {
        const fn = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setAbierto(false);
        };
        document.addEventListener('mousedown', fn);
        return () => document.removeEventListener('mousedown', fn);
    }, []);

    async function cargar() {
        try {
            const res = await fetch(`${API}/notificaciones?id_usuario=${idUsuario}`, { headers });
            if (!res.ok) throw new Error('Error al cargar notificaciones');
            const data = await res.json();
            setNotificaciones(data);
        } catch (e) {
            console.error(e);
        }
        if (idRol === 3) cargarSolicitudes();
    }

    async function cargarSolicitudes() {
        try {
            const res = await fetch(`${API}/notificaciones/solicitudes`, { headers });
            if (!res.ok) throw new Error('Error al cargar solicitudes');
            const data = await res.json();
            setSolicitudes(data);
        } catch (e) {
            console.error(e);
        }
    }

    // Marca todas las notificaciones como leídas en BD y en estado local
    async function marcarTodasLeidas() {
        try {
            await fetch(`${API}/notificaciones/marcar-leidas`, {
                method: 'PATCH',
                headers,
            });
            setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
        } catch (e) {
            console.error('Error marcando notificaciones:', e);
        }
    }

    async function aprobarSolicitud(sol) {
        try {
            const res = await fetch(
                `${API}/notificaciones/solicitudes/${sol.id_solicitud}/aprobar`,
                { method: 'PATCH', headers, body: JSON.stringify({ id_usuario: sol.id_usuario }) }
            );
            if (!res.ok) throw new Error('Error al aprobar');
            setSolicitudes(prev => prev.filter(s => s.id_solicitud !== sol.id_solicitud));
            Swal.fire({ icon: 'success', title: '¡Solicitud aprobada!', confirmButtonColor: '#0891b2', timer: 2000, showConfirmButton: false });
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Error', text: e.message, confirmButtonColor: '#0891b2' });
        }
    }

    async function rechazarSolicitud(sol) {
        try {
            const res = await fetch(
                `${API}/notificaciones/solicitudes/${sol.id_solicitud}/rechazar`,
                { method: 'PATCH', headers, body: JSON.stringify({ id_usuario: sol.id_usuario }) }
            );
            if (!res.ok) throw new Error('Error al rechazar');
            setSolicitudes(prev => prev.filter(s => s.id_solicitud !== sol.id_solicitud));
            Swal.fire({ icon: 'info', title: 'Solicitud rechazada', confirmButtonColor: '#0891b2', timer: 2000, showConfirmButton: false });
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Error', text: e.message, confirmButtonColor: '#0891b2' });
        }
    }

    function tiempoRelativo(fecha) {
        const diff = Date.now() - new Date(fecha).getTime();
        const m = Math.floor(diff / 60000);
        const h = Math.floor(diff / 3600000);
        const d = Math.floor(diff / 86400000);
        if (m < 1) return 'Ahora';
        if (m < 60) return `Hace ${m} min`;
        if (h < 24) return `Hace ${h}h`;
        return `Hace ${d}d`;
    }

    return (
        <div className="relative" ref={ref}>
            {/* Botón campana */}
            <button
                onClick={() => {
                    const abriendo = !abierto;
                    setAbierto(abriendo);
                    // Al abrir, marcar todas como leídas si hay alguna sin leer
                    if (abriendo && notificaciones.some(n => !n.leida)) {
                        marcarTodasLeidas();
                    }
                }}
                className="relative bg-cyan-600 hover:bg-cyan-900 p-2 rounded transition"
                title="Notificaciones"
            >
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {totalBadge > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                        {totalBadge > 9 ? '9+' : totalBadge}
                    </span>
                )}
            </button>

            {abierto && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-3 bg-cyan-50 border-b border-cyan-100">
                        <h3 className="font-semibold text-cyan-800 text-sm">Notificaciones</h3>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {/* Solicitudes pendientes — solo admin */}
                        {idRol === 3 && solicitudes.length > 0 && (
                            <div className="divide-y divide-cyan-100">
                                {solicitudes.map(sol => (
                                    <div key={sol.id_solicitud} className="px-4 py-3 bg-cyan-50/60 hover:bg-cyan-50 transition">
                                        <div className="flex items-start gap-2 mb-2">
                                            <svg className="w-5 h-5 text-cyan-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div>
                                                <p className="text-sm font-semibold text-cyan-950">
                                                    {sol.usuarios?.nombre} {sol.usuarios?.apellido} quiere ser artista
                                                </p>
                                                <p className="text-xs text-cyan-600">{tiempoRelativo(sol.fecha_solicitud)}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => aprobarSolicitud(sol)}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => rechazarSolicitud(sol)}
                                                className="flex-1 bg-red-400 hover:bg-red-500 text-white text-xs py-1.5 rounded-lg font-semibold transition flex items-center justify-center gap-1"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Sin notificaciones */}
                        {notificaciones.length === 0 && solicitudes.length === 0 && (
                            <div className="p-8 text-center flex flex-col items-center justify-center">
                                <svg className="w-10 h-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                <p className="text-gray-400 text-sm">Sin notificaciones</p>
                            </div>
                        )}

                        {/* Lista de notificaciones */}
                        {notificaciones.length > 0 && (
                            <div className="divide-y divide-gray-50">
                                {notificaciones.map(n => (
                                    <div
                                        key={n.id_notificacion}
                                        className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition ${!n.leida ? 'bg-cyan-50/40' : ''}`}
                                    >
                                        <span className="flex-shrink-0 mt-0.5">
                                            {iconosNotificacion[n.tipo_notificacion] || (
                                                <svg className="w-5 h-5 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                                                </svg>
                                            )}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 leading-snug">{n.asunto}</p>
                                            <span className="text-xs text-gray-400 mt-1 block">{tiempoRelativo(n.fecha_notificacion)}</span>
                                        </div>
                                        {/* Punto azul si no leída */}
                                        {!n.leida && (
                                            <span className="w-2 h-2 bg-cyan-500 rounded-full flex-shrink-0 mt-2" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notificaciones;
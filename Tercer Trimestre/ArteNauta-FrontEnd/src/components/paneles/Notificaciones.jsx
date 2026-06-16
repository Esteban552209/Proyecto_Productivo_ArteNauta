import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';

const API = 'http://localhost:3000';

function Notificaciones({ usuario, setVista }) {
    const idUsuario = usuario?.id_usuario;
    const idRol = Number(usuario?.id_rol);
    const token = localStorage.getItem('token');

    const [notificaciones, setNotificaciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [abierto, setAbierto] = useState(false);
    const ref = useRef(null);

    const totalBadge = notificaciones.length + solicitudes.length;

    // ── Headers reutilizables ──────────────────────────
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    useEffect(() => {
        if (!idUsuario) return;
        cargar();

        // Realtime — solo para recibir notificaciones nuevas en vivo
        const canal = supabase
            .channel(`notif-${idUsuario}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notificaciones',
                filter: `id_usuario=eq.${idUsuario}`,
            }, payload => {
                setNotificaciones(prev => [payload.new, ...prev]);
            })
            .subscribe();

        // Realtime solicitudes (solo admin)
        let canalSol;
        if (idRol === 3) {
            canalSol = supabase
                .channel(`solicitudes-${idUsuario}`)
                .on('postgres_changes', {
                    event: '*', schema: 'public', table: 'solicitudes',
                }, () => cargarSolicitudes())
                .subscribe();
        }

        // Realtime cambio de rol
        const canalRol = supabase
            .channel(`rol-usuario-${idUsuario}`)
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
                        title: '🎉 ¡Ahora eres Artista!',
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

    // ── GET notificaciones → backend ──────────────────
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

    // ── GET solicitudes → backend ─────────────────────
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

    // ── PATCH aprobar → backend ───────────────────────
    async function aprobarSolicitud(sol) {
        try {
            const res = await fetch(
                `${API}/notificaciones/solicitudes/${sol.id_solicitud}/aprobar`,
                {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ id_usuario: sol.id_usuario }),
                }
            );
            if (!res.ok) throw new Error('Error al aprobar');

            setSolicitudes(prev => prev.filter(s => s.id_solicitud !== sol.id_solicitud));
            Swal.fire({ icon: 'success', title: '¡Solicitud aprobada!', confirmButtonColor: '#0891b2', timer: 2000, showConfirmButton: false });
        } catch (e) {
            console.error(e);
            Swal.fire({ icon: 'error', title: 'Error', text: e.message, confirmButtonColor: '#0891b2' });
        }
    }

    // ── PATCH rechazar → backend ──────────────────────
    async function rechazarSolicitud(sol) {
        try {
            const res = await fetch(
                `${API}/notificaciones/solicitudes/${sol.id_solicitud}/rechazar`,
                {
                    method: 'PATCH',
                    headers,
                    body: JSON.stringify({ id_usuario: sol.id_usuario }),
                }
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

    const iconos = {
        solicitud_aprobada:  '✅',
        solicitud_rechazada: '❌',
        censura_obra:        '🚫',
        advertencia:         '⚠️',
        mensaje_admin:       '💬',
    };

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setAbierto(!abierto)}
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
                        {totalBadge > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                                {totalBadge}
                            </span>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {/* Solicitudes pendientes — solo admin */}
                        {idRol === 3 && solicitudes.length > 0 && (
                            <div className="divide-y divide-yellow-100">
                                {solicitudes.map(sol => (
                                    <div key={sol.id_solicitud} className="px-4 py-3 bg-yellow-50">
                                        <div className="flex items-start gap-2 mb-2">
                                            <span className="text-lg">⏳</span>
                                            <div>
                                                <p className="text-sm font-semibold text-yellow-800">
                                                    {sol.usuarios?.nombre} {sol.usuarios?.apellido} quiere ser artista
                                                </p>
                                                <p className="text-xs text-yellow-600">
                                                    {tiempoRelativo(sol.fecha_solicitud)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => aprobarSolicitud(sol)}
                                                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs py-1.5 rounded-lg font-semibold transition"
                                            >
                                                ✅ Aprobar
                                            </button>
                                            <button
                                                onClick={() => rechazarSolicitud(sol)}
                                                className="flex-1 bg-red-400 hover:bg-red-500 text-white text-xs py-1.5 rounded-lg font-semibold transition"
                                            >
                                                ❌ Rechazar
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Vacío */}
                        {notificaciones.length === 0 && solicitudes.length === 0 && (
                            <div className="p-8 text-center">
                                <div className="text-3xl mb-2">🔔</div>
                                <p className="text-gray-400 text-sm">Sin notificaciones</p>
                            </div>
                        )}

                        {/* Notificaciones normales */}
                        {notificaciones.length > 0 && (
                            <div className="divide-y divide-gray-50">
                                {notificaciones.map(n => (
                                    <div key={n.id_notificacion} className="flex gap-3 px-4 py-3 hover:bg-gray-50 transition">
                                        <span className="text-xl flex-shrink-0 mt-0.5">
                                            {iconos[n.tipo_notificacion] || '📢'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 leading-snug">
                                                {n.asunto}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                {tiempoRelativo(n.fecha_notificacion)}
                                            </span>
                                        </div>
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
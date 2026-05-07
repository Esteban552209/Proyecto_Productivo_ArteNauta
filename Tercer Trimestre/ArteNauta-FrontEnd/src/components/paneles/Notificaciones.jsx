import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';

function Notificaciones({ usuario }) {
    const [notificaciones, setNotificaciones] = useState([]);
    const [solicitudes, setSolicitudes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            // Cargar notificaciones del usuario
            const { data: notifs, error: errorNotifs } = await supabase
                .from('notificaciones')
                .select('*')
                .eq('id_usuario', usuario?.id_usuario)
                .order('fecha_notificacion', { ascending: false });

            if (errorNotifs) throw errorNotifs;

            // Si es admin, cargar solicitudes pendientes
            if (usuario?.id_rol === 3) {
                const { data: solicitudesData, error: errorSolicitudes } = await supabase
                    .from('solicitudes')
                    .select('*, usuarios(nombre, apellido)')
                    .eq('estado_solicitud', 'pendiente');

                if (!errorSolicitudes) setSolicitudes(solicitudesData || []);
            }

            setNotificaciones(notifs || []);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    // Admin: aprobar solicitud
    const aprobarSolicitud = async (solicitud) => {
        try {
            // Cambiar estado de la solicitud
            await supabase
                .from('solicitudes')
                .update({ estado_solicitud: 'aprobada' })
                .eq('id_solicitud', solicitud.id_solicitud);

            // Cambiar rol del usuario a artista
            await supabase
                .from('usuarios')
                .update({ id_rol: 2 }) // 2 = artista
                .eq('id_usuario', solicitud.id_usuario);

            // Crear notificación para el usuario
            await supabase
                .from('notificaciones')
                .insert({
                    asunto: '¡Tu solicitud para ser artista fue aprobada! Ya puedes subir obras.',
                    tipo_notificacion: 'solicitud_aprobada',
                    id_usuario: solicitud.id_usuario,
                    fecha_notificacion: new Date().toISOString(),
                });

            setSolicitudes(prev =>
                prev.filter(s => s.id_solicitud !== solicitud.id_solicitud)
            );

            Swal.fire({
                icon: 'success',
                title: 'Solicitud aprobada',
                text: 'El usuario ahora es artista',
                confirmButtonColor: '#0891b2',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.log(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo aprobar', confirmButtonColor: '#0891b2' });
        }
    };

    // Admin: rechazar solicitud
    const rechazarSolicitud = async (solicitud) => {
        try {
            await supabase
                .from('solicitudes')
                .update({ estado_solicitud: 'rechazada' })
                .eq('id_solicitud', solicitud.id_solicitud);

            // Notificar al usuario
            await supabase
                .from('notificaciones')
                .insert({
                    asunto: 'Tu solicitud para ser artista fue rechazada.',
                    tipo_notificacion: 'solicitud_rechazada',
                    id_usuario: solicitud.id_usuario,
                    fecha_notificacion: new Date().toISOString(),
                });

            setSolicitudes(prev =>
                prev.filter(s => s.id_solicitud !== solicitud.id_solicitud)
            );

            Swal.fire({
                icon: 'info',
                title: 'Solicitud rechazada',
                confirmButtonColor: '#0891b2',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch (error) {
            console.log(error);
            Swal.fire({ icon: 'error', title: 'Error', confirmButtonColor: '#0891b2' });
        }
    };

    const tipoConfig = {
        solicitud_aprobada: { color: 'border-l-green-400 bg-green-50', icono: '✅', label: 'Aprobada' },
        solicitud_rechazada: { color: 'border-l-red-400 bg-red-50', icono: '❌', label: 'Rechazada' },
        censura_obra: { color: 'border-l-red-400 bg-red-50', icono: '⚠️', label: 'Censura' },
    };

    if (loading) return <p className="text-center text-gray-400 py-10">Cargando notificaciones...</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-cyan-800">Notificaciones</h1>
            </div>

            {/* Solicitudes pendientes — solo admin */}
            {usuario?.id_rol === 1 && solicitudes.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-lg font-bold text-yellow-700 mb-3">⏳ Solicitudes pendientes</h2>
                    <div className="flex flex-col gap-3">
                        {solicitudes.map(sol => (
                            <div key={sol.id_solicitud} className="rounded-2xl shadow border-l-4 border-l-yellow-400 bg-yellow-50 p-4">
                                <p className="text-sm font-semibold text-gray-700">
                                    🎨 {sol.usuarios?.nombre} {sol.usuarios?.apellido} solicita ser artista
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(sol.fecha_solicitud).toLocaleDateString('es-ES', {
                                        day: '2-digit', month: 'long', year: 'numeric'
                                    })}
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={() => aprobarSolicitud(sol)}
                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-semibold transition"
                                    >
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => rechazarSolicitud(sol)}
                                        className="bg-red-400 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-lg font-semibold transition"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Notificaciones del usuario */}
            {notificaciones.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
                    <p className="text-4xl mb-3">🔔</p>
                    <p>No tienes notificaciones</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notificaciones.map(notif => {
                        const config = tipoConfig[notif.tipo_notificacion] || { color: 'border-l-gray-300 bg-white', icono: '🔔' };
                        return (
                            <div key={notif.id_notificacion} className={`rounded-2xl shadow border-l-4 p-4 ${config.color}`}>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">{config.icono}</span>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-700">{notif.asunto}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            {new Date(notif.fecha_notificacion).toLocaleDateString('es-ES', {
                                                day: '2-digit', month: 'long', year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Notificaciones;
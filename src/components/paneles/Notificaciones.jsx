import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API = 'http://localhost:3002';

function Notificaciones({ usuario }) {
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    // Cargar notificaciones del usuario actual
    useEffect(() => {
        cargarNotificaciones();
    }, []);

    const cargarNotificaciones = () => {
        fetch(`${API}/notificaciones`)
            .then(res => res.json())
            .then(data => {
                const mias = data.filter(n => String(n.id_destinatario) === String(usuario?.id));
                const ordenadas = mias.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setNotificaciones(ordenadas);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };
    // Marcar como leída
    const marcarLeida = (id) => {
        fetch(`${API}/notificaciones/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ leida: true }),
        }).then(() => {
            setNotificaciones(prev =>
                prev.map(n => n.id === id ? { ...n, leida: true } : n)
            );
        });
    };

    // Marcar todas como leídas
    const marcarTodasLeidas = () => {
        const noLeidas = notificaciones.filter(n => !n.leida);
        Promise.all(
            noLeidas.map(n =>
                fetch(`${API}/notificaciones/${n.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ leida: true }),
                })
            )
        ).then(() => {
            setNotificaciones(prev => prev.map(n => ({ ...n, leida: true })));
        });
    };

    // Admin: aprobar solicitud de artista
    const aprobarSolicitud = async (notif) => {
        try {
            // Cambiar rol del usuario a artista
            await fetch(`${API}/usuarios/${notif.id_remitente}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rol: 'artista' }),
            });

            // Crear notificación para el usuario que solicitó
            await fetch(`${API}/notificaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'solicitud_aprobada',
                    mensaje: '¡Tu solicitud para ser artista fue aprobada! Ya puedes subir obras.',
                    id_remitente: usuario?.id,
                    id_destinatario: notif.id_remitente,
                    rol_destinatario: 'usuario',
                    estado: 'info',
                    leida: false,
                    fecha: new Date().toISOString(),
                }),
            });

            // Actualizar la notificación original a procesada
            await fetch(`${API}/notificaciones/${notif.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'aprobada', leida: true }),
            });

            setNotificaciones(prev =>
                prev.map(n => n.id === notif.id ? { ...n, estado: 'aprobada', leida: true } : n)
            );

            Swal.fire({
                icon: 'success',
                title: 'Solicitud aprobada',
                text: 'El usuario ahora es artista',
                confirmButtonColor: '#0891b2',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo aprobar', confirmButtonColor: '#0891b2' });
        }
    };

    // Admin: rechazar solicitud de artista
    const rechazarSolicitud = async (notif) => {
        try {
            // Notificar al usuario del rechazo
            await fetch(`${API}/notificaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'solicitud_rechazada',
                    mensaje: 'Tu solicitud para ser artista fue rechazada.',
                    id_remitente: usuario?.id,
                    id_destinatario: notif.id_remitente,
                    rol_destinatario: 'usuario',
                    estado: 'info',
                    leida: false,
                    fecha: new Date().toISOString(),
                }),
            });

            await fetch(`${API}/notificaciones/${notif.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: 'rechazada', leida: true }),
            });

            setNotificaciones(prev =>
                prev.map(n => n.id === notif.id ? { ...n, estado: 'rechazada', leida: true } : n)
            );

            Swal.fire({
                icon: 'info',
                title: 'Solicitud rechazada',
                confirmButtonColor: '#0891b2',
                timer: 2000,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', confirmButtonColor: '#0891b2' });
        }
    };

    // Íconos y colores por tipo
    const tipoConfig = {
        solicitud_artista: { color: 'border-l-yellow-400 bg-yellow-50', icono: '', label: 'Solicitud' },
        solicitud_aprobada: { color: 'border-l-green-400 bg-green-50', icono: '', label: 'Aprobada' },
        solicitud_rechazada: { color: 'border-l-red-400 bg-red-50', icono: '', label: 'Rechazada' },
        censura_obra: { color: 'border-l-red-400 bg-red-50', icono: '', label: 'Censura' },
        contacto_artista: { color: 'border-l-cyan-400 bg-cyan-50', icono: '', label: 'Contacto' },
    };

    const noLeidas = notificaciones.filter(n => !n.leida).length;

    if (loading) return <p className="text-center text-gray-400 py-10">Cargando notificaciones...</p>;

    return (
        <div className="max-w-2xl mx-auto">
            {/* Encabezado */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-bold text-cyan-800">Notificaciones</h1>
                    {noLeidas > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {noLeidas}
                        </span>
                    )}
                </div>
                {noLeidas > 0 && (
                    <button
                        onClick={marcarTodasLeidas}
                        className="text-sm text-cyan-600 hover:underline"
                    >
                        Marcar todas como leídas
                    </button>
                )}
            </div>

            {/* Lista */}
            {notificaciones.length === 0 ? (
                <div className="bg-white rounded-2xl shadow p-10 text-center text-gray-400">
                    <p className="text-4xl mb-3">🔔</p>
                    <p>No tienes notificaciones</p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {notificaciones.map(notif => {
                        const config = tipoConfig[notif.tipo] || { color: 'border-l-gray-300 bg-white', icono: '🔔', label: '' };
                        return (
                            <div
                                key={notif.id}
                                className={`rounded-2xl shadow border-l-4 p-4 ${config.color} ${!notif.leida ? 'opacity-100' : 'opacity-60'} transition`}
                                onClick={() => !notif.leida && marcarLeida(notif.id)}
                            >
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-2xl">{config.icono}</span>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-700">{notif.mensaje}</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(notif.fecha).toLocaleDateString('es-ES', {
                                                    day: '2-digit', month: 'long', year: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2 shrink-0">
                                        {!notif.leida && (
                                            <span className="w-2 h-2 rounded-full bg-cyan-500 mt-1"></span>
                                        )}
                                        {/* Botones para admin en solicitudes pendientes */}
                                        {usuario?.rol === 'admin' &&
                                            notif.tipo === 'solicitud_artista' &&
                                            notif.estado === 'pendiente' && (
                                                <div className="flex gap-2 mt-1">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); aprobarSolicitud(notif); }}
                                                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded-lg font-semibold transition"
                                                    >
                                                        Aprobar
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); rechazarSolicitud(notif); }}
                                                        className="bg-red-400 hover:bg-red-500 text-white text-xs px-3 py-1 rounded-lg font-semibold transition"
                                                    >
                                                        Rechazar
                                                    </button>
                                                </div>
                                            )}
                                        {/* Badge de estado */}
                                        {notif.estado !== 'pendiente' && (
                                            <span className="text-xs text-gray-400 capitalize">{notif.estado}</span>
                                        )}
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
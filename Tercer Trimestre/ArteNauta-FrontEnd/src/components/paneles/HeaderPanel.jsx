import { useState, useEffect, useRef } from 'react';
import Swal from 'sweetalert2';
import { supabase } from '../../lib/supabase';
import Notificaciones from './Notificaciones'; //

function HeaderPanel({ seccion, setSeccion, setVista, onSubirArte }) {
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem('usuario')));
    const [notifCount, setNotifCount] = useState(0);
    const [notifPreview, setNotifPreview] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const rol = usuario?.rol;

    const rolLabel = {
        admin: 'Panel Administrador',
        artista: 'Panel Artista',
        usuario: 'Panel Usuario',
    };

    const cargarNotificaciones = async () => {
        if (!usuario?.id_usuario) return;

        const { data: notifs } = await supabase
            .from('notificaciones')
            .select('*')
            .eq('id_usuario', usuario.id_usuario)
            .order('fecha_notificacion', { ascending: false })
            .limit(5);

        let total = notifs?.length || 0;
        if (notifs) setNotifPreview(notifs);

        if (usuario?.id_rol === 3) {
            const { data: solicitudes } = await supabase
                .from('solicitudes')
                .select('id_solicitud')
                .eq('estado_solicitud', 'Pendiente');
            total += solicitudes?.length || 0;
        }

        setNotifCount(total);
    };

    useEffect(() => {
        cargarNotificaciones();

        const handleStorageChange = () => setUsuario(JSON.parse(localStorage.getItem('usuario')));
        window.addEventListener('storage', handleStorageChange);

        const channelNotifs = supabase
            .channel('notificaciones-header')
            .on('postgres_changes', {
                event: 'INSERT', schema: 'public', table: 'notificaciones',
                filter: `id_usuario=eq.${usuario?.id_usuario}`,
            }, () => cargarNotificaciones())
            .subscribe();

        let channelSolicitudes;
        if (usuario?.id_rol === 3) {
            channelSolicitudes = supabase
                .channel('solicitudes-header')
                .on('postgres_changes', { event: '*', schema: 'public', table: 'solicitudes' },
                    () => cargarNotificaciones())
                .subscribe();
        }

        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setDropdownOpen(false);
        };
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            supabase.removeChannel(channelNotifs);
            if (channelSolicitudes) supabase.removeChannel(channelSolicitudes);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [usuario?.id_usuario]);

    const cerrarSesion = () => {
        Swal.fire({
            title: '¿Cerrar sesión?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0891b2',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, salir',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                setVista(null);
            }
        });
    };

    const btn = (seccionId) =>
        `px-4 py-2 rounded font-medium transition ${seccion === seccionId
            ? 'bg-white text-cyan-700'
            : 'bg-cyan-600 hover:bg-cyan-900'
        }`;

    return (
        <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center">

            {/* IZQUIERDA: Logo + Rol */}
            <div className="flex items-center gap-3">
                <img
                    src="../src/assets/LOGO.png"
                    alt="Logo"
                    className="h-20"
                    onError={(e) => e.target.style.display = 'none'}
                />
                <div className="flex flex-col">
                    <span className="font-bold text-lg leading-tight">
                        {rolLabel[rol] || 'ArteNauta'}
                    </span>
                    <span className="text-xs opacity-75">
                        Hola, {usuario?.nombre}
                    </span>
                </div>
            </div>

            {/* DERECHA: Navegación */}
            <nav className="flex gap-2 items-center">
                <button onClick={() => setSeccion('inicio')} className={btn('inicio')}>
                    Inicio
                </button>

                {rol === 'artista' && (
                    <button onClick={onSubirArte} className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-cyan-900">
                        Subir Arte
                    </button>
                )}

                {rol === 'admin' && (
                    <>
                        <button onClick={() => setSeccion('usuarios')} className={btn('usuarios')}>Usuarios</button>
                        <button onClick={() => setSeccion('publicaciones')} className={btn('publicaciones')}>Publicaciones</button>
                        <button onClick={() => setSeccion('comentarios')} className={btn('comentarios')}>Comentarios</button>
                    </>
                )}

                <button onClick={() => setSeccion('conversaciones')} className={btn('conversaciones')}>
                    Conversaciones
                </button>

                <button onClick={() => setSeccion('perfil')} className={btn('perfil')}>
                    Mi Perfil
                </button>

                

                {/* 🔔 Campanita */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="relative px-3 py-2 rounded font-medium transition bg-cyan-600 hover:bg-cyan-900 flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {notifCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-cyan-900 animate-bounce">
                                {notifCount > 9 ? '9+' : notifCount}
                            </span>
                        )}
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl z-50 overflow-hidden border border-gray-100 text-gray-800">
                            <div className="px-4 py-3 bg-gray-50 border-b flex justify-between items-center">
                                <span className="text-sm font-bold text-gray-700">Notificaciones</span>
                                {usuario?.id_rol === 3 && (
                                    <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full">Admin</span>
                                )}
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {notifPreview.length === 0 ? (
                                    <div className="p-6 text-center text-gray-400 text-sm">
                                        <p className="text-2xl mb-1"></p>
                                        No hay avisos nuevos
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-50">
                                        {notifPreview.map((n) => (
                                            <li key={n.id_notificacion} className="p-3 hover:bg-cyan-50 transition">
                                                <div className="flex gap-3">
                                                    <span className="text-xl"></span>
                                                    <div>
                                                        <p className="text-xs font-semibold text-gray-800">{n.asunto}</p>
                                                        <p className="text-[10px] text-gray-500">
                                                            {new Date(n.fecha_notificacion).toLocaleDateString('es-ES')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <button
                                onClick={() => { setSeccion('notificaciones'); setDropdownOpen(false); }}
                                className="w-full p-3 text-xs font-bold text-cyan-600 border-t hover:bg-gray-50 transition"
                            >
                                Ver todo el historial →
                            </button>
                        </div>
                    )}
                </div>

                <button onClick={cerrarSesion} className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-red-800">
                    Cerrar Sesión
                </button>
            </nav>
        </header>
    );
}

export default HeaderPanel;
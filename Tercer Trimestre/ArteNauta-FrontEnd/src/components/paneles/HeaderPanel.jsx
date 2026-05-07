<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API = 'http://localhost:3002';

function HeaderPanel({ seccion, setSeccion, setVista, onSubirArte }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario?.rol;
    // Estado para el contador de notificaciones no leídas
    const [noLeidas, setNoLeidas] = useState(0);

    // Cargar contador de notificaciones al montar y cada 30 segundos
    useEffect(() => {
        cargarContador();
        const intervalo = setInterval(cargarContador, 30000);
        return () => clearInterval(intervalo);
    }, []);

    // Actualizar contador cuando se cambia a notificaciones
    useEffect(() => {
        if (seccion === 'notificaciones') {
            setNoLeidas(0);
        }
    }, [seccion]);

    const cargarContador = () => {
        fetch(`${API}/notificaciones`)
            .then(res => res.json())
            .then(data => {
                const mias = data.filter(n => String(n.id_destinatario) === String(usuario?.id) && n.leida === false);
                setNoLeidas(mias.length);
            })
            .catch(() => setNoLeidas(0));
    };
=======
import Swal from 'sweetalert2';

function HeaderPanel({ seccion, setSeccion, setVista, onSubirArte }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario?.rol;
>>>>>>> master

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
                localStorage.removeItem('usuario');
                localStorage.removeItem('token');
                setVista(null);
            }
        });
    };

    const btn = (seccionId) =>
        `px-4 py-2 rounded font-medium transition ${seccion === seccionId
            ? 'bg-white text-cyan-700'
            : 'bg-cyan-600 hover:bg-cyan-900'
        }`;

    const titulos = {
        admin: 'Panel Admin',
        artista: 'Panel Artista',
        usuario: 'Panel Usuario',
    };

    return (
        <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
<<<<<<< HEAD
                <img
                    src="../src/assets/LOGO.png"
                    alt=""
                    className="h-14"
                    onError={(e) => e.target.style.display = 'none'}
                />
                <span className="font-bold text-lg">{titulos[rol]}</span>
            </div>

            <nav className="flex gap-2 items-center"></nav>
            {/* Campana PRIMERO a la izquierda */}
            <button
                onClick={() => setSeccion('notificaciones')}
                className="relative p-2 rounded-full hover:bg-cyan-800 transition"
            >
                🔔
                {noLeidas > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {noLeidas > 9 ? '9+' : noLeidas}
                    </span>
                )}
            </button>
            <div className="w-px h-6 bg-white opacity-30 mx-1"></div>

            
        

            <nav className="flex gap-2 items-center">
                <button onClick={() => setSeccion('inicio')} className={btn('inicio')}>
=======
                <img src="../src/assets/LOGO.png" alt="" className="h-14"
                    onError={(e) => e.target.style.display = 'none'} />
                <span className="font-bold text-lg">{titulos[rol]}</span>
            </div>

            <nav className="flex gap-2">
                <button
                    onClick={() => setSeccion('inicio')}
                    className={btn('inicio')}
                >
>>>>>>> master
                    Inicio
                </button>

                {rol === 'artista' && (
                    <button
                        onClick={onSubirArte}
                        className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-cyan-900"
                    >
                        Subir Arte
                    </button>
                )}

                {rol === 'admin' && (
<<<<<<< HEAD
                    <>
                        <button onClick={() => setSeccion('usuarios')} className={btn('usuarios')}>
                            Usuarios
                        </button>
                        <button onClick={() => setSeccion('publicaciones')} className={btn('publicaciones')}>
                            Publicaciones
                        </button>



                        <button onClick={() => setSeccion('comentarios')} className={btn('comentarios')}>
                            Comentarios
                        </button>
                    </>
                )}

                <button onClick={() => setSeccion('conversaciones')} className={btn('conversaciones')}>
                    Conversaciones
                </button>

                {/* Botón notificaciones con badge */}
                {/* Separador visual */}

                <div className="w-px h-6 bg-white opacity-30 mx-1"></div>

                <button onClick={() => setSeccion('perfil')} className={btn('perfil')}>
=======
                    <button
                        onClick={() => setSeccion('usuarios')}
                        className={btn('usuarios')}
                    >
                        Usuarios
                    </button>
                )}

                {rol === 'admin' && (
                    <button
                        onClick={() => setSeccion('publicaciones')}
                        className={btn('publicaciones')}
                    >
                        Publicaciones
                    </button>
                )}

                {rol === 'admin' && (
                    <button
                        onClick={() => setSeccion('comentarios')}
                        className={btn('comentarios')}
                    >
                        Comentarios
                    </button>
                )}

                <button
                    onClick={() => setSeccion('conversaciones')}
                    className={btn('conversaciones')}
                >
                    Conversaciones
                </button>

                <button
                    onClick={() => setSeccion('perfil')}
                    className={btn('perfil')}
                >
>>>>>>> master
                    Mi Perfil
                </button>

                <button
                    onClick={cerrarSesion}
                    className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-red-800"
                >
                    Cerrar Sesión
                </button>
            </nav>
        </header>
    );
}

<<<<<<< HEAD
export default HeaderPanel;
=======
export default HeaderPanel;
>>>>>>> master

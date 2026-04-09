import Swal from 'sweetalert2';

function HeaderPanel({ seccion, setSeccion, setVista, onSubirArte }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const rol = usuario?.rol;

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
        `px-4 py-2 rounded font-medium transition ${
            seccion === seccionId
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
                <img src="../src/assets/LOGO.png" alt="Logo" className="h-14" />
                <span className="font-bold text-lg">{titulos[rol]}</span>
            </div>

            <nav className="flex gap-2">
                <button
                    onClick={() => setSeccion('inicio')}
                    className={btn('inicio')}
                >
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
                    Mi Perfil
                </button>

                <button
                    onClick={cerrarSesion}
                    className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-cyan-900"
                >
                    Cerrar Sesión
                </button>
            </nav>
        </header>
    );
}

export default HeaderPanel;

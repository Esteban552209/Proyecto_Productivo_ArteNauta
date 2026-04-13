import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
const API_PUBLICACIONES ='http://localhost:3002/publicaciones';

function Publicaciones() {
    const [publicaciones, setPublicaciones] = useState([]);

    const obtenerPublicaciones = async () => {
        try {
            const res = await fetch(`${API_PUBLICACIONES}`);
            if (!res.ok) throw new Error('Error al obtener las publicaciones');
            const data = await res.json();
            setPublicaciones(data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar las publicaciones', 'error');
        }
    };

    useEffect(() => {
        obtenerPublicaciones();
    }, []);

    const handleEliminar = async (url, id, setter, lista, idField = 'id') => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar?',
            text: 'Esta acción no se puede deshacer',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#0891b2',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirmacion.isConfirmed) return;

        try {
            const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('No se pudo eliminar');
            setter(lista.filter((item) => item[idField] !== id));
            Swal.fire({
                title: 'Eliminado',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-cyan-800 mb-6 ">
                Publicaciones
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {publicaciones.map((pub) => (
                    <div
                        key={pub.id}
                        className="bg-white rounded-2xl shadow p-4 relative"
                    >
                        <button
                            onClick={() =>
                                handleEliminar(
                                    API_PUBLICACIONES,
                                    pub.id,
                                    setPublicaciones,
                                    publicaciones,
                                )
                            }
                            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition"
                            title="Eliminar publicación"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                <path d="M10 11v6M14 11v6" />
                                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                            </svg>
                        </button>
                        {pub.ArchivoAdjunto && (
                            <div className="w-full  rounded-lg mb-3 overflow-hidden bg-gray-100">
                                <img
                                    src={pub.ArchivoAdjunto}
                                    alt={pub.Titulo}
                                    className="w-full h-full object-cover"
                                    onError={(e) =>
                                        (e.target.src =
                                            'https://placehold.co/300x200?text=Sin+imagen')
                                    }
                                />
                            </div>
                        )}
                        <p className="font-semibold text-gray-700 pr-6">
                            {pub.Titulo}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            {pub.Descripcion}
                        </p>
                        <p className="text-xs text-pink-400 mt-2">
                            ♥ {pub.Likes ?? 0} likes
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Publicaciones;

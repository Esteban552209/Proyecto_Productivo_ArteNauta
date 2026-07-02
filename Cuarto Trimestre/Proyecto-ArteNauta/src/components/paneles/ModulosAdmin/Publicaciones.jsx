import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_PUBLICACIONES = 'http://localhost:3000/Muro-Publicaciones';

function Publicaciones() {
    const [publicaciones, setPublicaciones] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [filtro, setFiltro] = useState('recientes');
    const obtenerPublicaciones = async () => {
        try {
            const token = localStorage.getItem('token');

            let url = `${API_PUBLICACIONES}?`;

            if (busqueda) {
                url += `buscar=${busqueda}&`;
            }
            if (filtro === 'likes') {
                url += `ordenLikes=desc&`;
            } else if (filtro === 'recientes') {
                url += `ordenFecha=desc&`;
            } else if (filtro === 'antiguas') {
                url += `ordenFecha=asc&`;
            }

            const res = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Error al obtener las publicaciones');
            const data = await res.json();
            setPublicaciones(data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar las publicaciones', 'error');
        }
    };

    useEffect(() => {
        const delayBusqueda = setTimeout(() => {
            obtenerPublicaciones();
        }, 300);

        return () => clearTimeout(delayBusqueda);
    }, [busqueda, filtro]);

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar publicación?',
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
            const token = localStorage.getItem('token');

            const res = await fetch(`${API_PUBLICACIONES}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('No se pudo eliminar');

            setPublicaciones(publicaciones.filter((pub) => pub.id_publicacion !== id)); // Asumo que tu ID es id_publicacion

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
        <div className="p-4">
            <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                Gestión de Publicaciones
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm">

                <input
                    type="text"
                    placeholder="Buscar por título o descripción..."
                    className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                    <button
                        onClick={() => setFiltro('recientes')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filtro === 'recientes' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Recientes
                    </button>
                    <button
                        onClick={() => setFiltro('antiguas')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filtro === 'antiguas' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Antiguas
                    </button>
                    <button
                        onClick={() => setFiltro('likes')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${filtro === 'likes' ? 'bg-cyan-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                    >
                        Más Likes ♥
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {publicaciones.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center py-10">No se encontraron publicaciones...</p>
                ) : (
                    publicaciones.map((pub) => (
                        <div
                            key={pub.id_publicacion || pub.id}
                            className="bg-white rounded-2xl shadow-md p-4 relative border border-gray-50 hover:shadow-lg transition flex flex-col h-full"
                        >
                            <button
                                onClick={() => handleEliminar(pub.id_publicacion || pub.id)}
                                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-500 text-red-500 hover:text-white transition shadow-sm z-10"
                                title="Eliminar publicación"
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                                    <path d="M10 11v6M14 11v6" />
                                    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                </svg>
                            </button>

                            {pub.contenido ? (
                                <div className="w-full h-40 rounded-lg mb-3 overflow-hidden bg-gray-100 flex-shrink-0">
                                    <img
                                        src={pub.contenido}
                                        alt={pub.titulo}
                                        className="w-full h-full object-cover"
                                        onError={(e) => (e.target.src = 'https://placehold.co/300x200?text=Sin+imagen')}
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-40 rounded-lg mb-3 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                                    Sin imagen
                                </div>
                            )}
                            <div className="flex-grow">
                                <h3 className="font-bold text-gray-800 pr-8 leading-tight">
                                    {pub.titulo}
                                </h3>

                                {pub.usuarios && (
                                    <p className="text-xs text-cyan-700 font-medium mt-1">
                                        Por: {pub.usuarios.nombre}
                                    </p>
                                )}

                                <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                                    {pub.descripcion}
                                </p>
                            </div>
                            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-semibold text-pink-500 bg-pink-50 px-2 py-1 rounded-md">
                                    ♥ {pub.likes ?? 0} likes
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(pub.fecha_publicacion).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Publicaciones;
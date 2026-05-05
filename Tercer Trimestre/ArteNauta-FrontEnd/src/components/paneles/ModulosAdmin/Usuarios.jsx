import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
const API_LOCAL_USUARIOS = 'http://localhost:3002';

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch(`${API_LOCAL_USUARIOS}/usuarios`);
            if (!res.ok) throw new Error('Error al obtener los usuarios');
            const data = await res.json();
            setUsuarios(data);
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'No se pudieron cargar los usuarios', 'error');
        }
    };

    useEffect(() => {
        obtenerUsuarios();
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
        <section>
            <div>
                <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                    Usuarios registrados
                </h2>
                <div className="bg-white rounded-2xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-cyan-50 text-cyan-700">
                            <tr>
                                <th className="text-left px-6 py-3">Nombre</th>
                                <th className="text-left px-6 py-3">
                                    Apellido
                                </th>
                                <th className="text-left px-6 py-3">Correo</th>
                                <th className="text-left px-6 py-3">Rol</th>
                                <th className="text-left px-6 py-3">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className={
                                        i % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                    }
                                >
                                    <td className="px-6 py-3 font-medium text-gray-700">
                                        {u.nombre}
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">
                                        {u.apellido}
                                    </td>
                                    <td className="px-6 py-3 text-gray-500">
                                        {u.correo}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                u.rol === 'admin'
                                                    ? 'bg-cyan-100 text-cyan-700'
                                                    : u.rol === 'usuarioArtista'
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-600'
                                            }`}
                                        >
                                            {u.rol}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <button
                                            onClick={() =>
                                                handleEliminar(
                                                    `${API_LOCAL_USUARIOS}/usuarios`,
                                                    u.id,
                                                    setUsuarios,
                                                    usuarios,
                                                )
                                            }
                                            className="text-red-400 hover:text-red-600 transition"
                                            title="Eliminar usuario"
                                        >
                                            <svg
                                                width="16"
                                                height="16"
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
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}

export default Usuarios;

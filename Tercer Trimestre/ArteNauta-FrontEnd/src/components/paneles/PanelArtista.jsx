import { useState } from 'react';
import Swal from 'sweetalert2';
import PerfilUsuario from './PerfilUsuario';
import FormPublicaciones from '../FormPublicaciones';
import HeaderPanel from './HeaderPanel';
import Conversaciones from './ModulosConversaciones/VistaChats';

function PanelArtista({ setVista }) {
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const [seccion, setSeccion] = useState('inicio');
    const [showModal, setShowModal] = useState(false);
    const [obras, setObras] = useState([]);

    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar obra?',
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
            const res = await fetch(
                `https://69d0711b90cd06523d5d38c4.mockapi.io/ApiAplicaciones/${id}`,
                { method: 'DELETE' },
            );

            if (!res.ok) throw new Error('No se pudo eliminar');
            setObras((prev) => prev.filter((obra) => obra.Id != id));

            Swal.fire({
                title: 'Eliminada',
                text: 'Tu publicacion fue eliminada correctamente',
                icon: 'success',
                confirmButtonColor: '#0891b2',
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        }
    };
    const handleNuevaPublicacion = (nueva) => {
        setObras((prev) => [nueva, ...prev]);
    };

    return (
        <div className="min-h-screen bg-cyan-50 flex flex-col">
            <HeaderPanel
                seccion={seccion}
                setSeccion={setSeccion}
                setVista={setVista}
                onSubirArte={() => setShowModal(true)}
            />
            <main className="flex-1 p-8 max-w-6xl mx-auto w-full">
                {seccion === 'inicio' && (
                    <div>
                        <h1 className="text-2xl font-bold text-cyan-800 mb-2">
                            Bienvenido, {usuario?.nombre}
                        </h1>
                        <p className="text-gray-500 mb-8">
                            Tu espacio creativo en ArteNauta
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-cyan-500">
                                <p className="text-gray-500 text-sm">
                                    Mis obras publicadas
                                </p>
                                <p className="text-3xl font-bold text-cyan-700 mt-1">
                                    {obras.length}
                                </p>
                            </div>
                            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-pink-500">
                                <p className="text-gray-500 text-sm">
                                    Me gusta recibidos
                                </p>
                                <p className="text-3xl font-bold text-pink-600 mt-1">
                                    0
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 bg-white rounded-2xl shadow p-6">
                            <h2 className="text-lg font-bold text-cyan-700 mb-4">
                                Mis Obras
                            </h2>

                            {obras.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <svg
                                        className="w-12 h-12 mb-3 text-gray-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                        />
                                    </svg>
                                    <p className="text-sm mb-4">
                                        Aún no has subido ninguna obra.
                                    </p>
                                    <button
                                        onClick={() => setShowModal(true)}
                                        className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Subir mi primera obra
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {obras.map((obra) => (
                                        <div
                                            key={obra.id}
                                            className="border border-gray-100 rounded-xl p-4 relative"
                                        >
                                            <button
                                                onClick={() =>
                                                    handleEliminar(obra.id)
                                                }
                                                className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-400 hover:text-red-600 transition"
                                                title="Eliminar obra"
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

                                            {obra.ArchivoAdjunto && (
                                                <img
                                                    src={obra.ArchivoAdjunto}
                                                    alt={obra.Titulo}
                                                    className="w-full object-contain rounded-lg mb-3 bg-gray-50"
                                                />
                                            )}
                                            <p className="font-semibold text-gray-700">
                                                {obra.Titulo}
                                            </p>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {obra.Descripcion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {seccion === "conversaciones" && (
                  <Conversaciones usuario={usuario}/>
                )}

                {seccion === 'perfil' && <PerfilUsuario usuario={usuario} />}
            </main>

            {showModal && (
                <FormPublicaciones
                    onNuevaPublicacion={handleNuevaPublicacion}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default PanelArtista;

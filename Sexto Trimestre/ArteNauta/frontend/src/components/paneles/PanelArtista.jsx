import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PerfilUsuario from "./PerfilUsuario";
import FormPublicaciones from "../FormPublicaciones";
import PublicacionesCom from "../PublicacionesCom";
import HeaderPanel from "./HeaderPanel";
import Conversaciones from "./ModulosConversaciones/VistaChats";
import Notificaciones from "./Notificaciones";

const API_LOCAL_BACKEND = "http://localhost:3000";

function PanelArtista({ setVista }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [seccion, setSeccion] = useState("inicio");
    const [showModal, setShowModal] = useState(false);
    const [obras, setObras] = useState([]);
    const [publicaciones, setPublicaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [busqueda, setBusqueda] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("desc");
    const [filtroLikes, setFiltroLikes] = useState("");
    const [showModalFiltros, setShowModalFiltros] = useState(false);
    const obtenerPublicacionesMuro = async () => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            let url = `${API_LOCAL_BACKEND}/Muro-Publicaciones?buscar=${encodeURIComponent(busqueda)}&ordenFecha=${filtroFecha}`;
            if (filtroLikes) url += `&ordenLikes=${filtroLikes}`;

            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (res.status === 401) {
                localStorage.removeItem("token");
                localStorage.removeItem("usuario");
                Swal.fire({
                    icon: "warning",
                    title: "Sesión Expirada",
                    text: "Tu sesión ha terminado por seguridad. Vuelve a ingresar a ArteNauta.",
                    confirmButtonColor: "#0891b2",
                }).then(() => window.location.reload());
                return;
            }

            if (!res.ok) throw new Error("Error al obtener las publicaciones del muro");
            const data = await res.json();
            setPublicaciones(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron cargar las obras del muro", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (seccion === "inicio") {
            obtenerPublicacionesMuro();
        }
    }, [seccion, busqueda, filtroFecha, filtroLikes]);

    const handleNuevaPublicacion = (nueva) => {
        setObras((prev) => [nueva, ...prev]);
        setShowModal(false);
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
                {seccion === "inicio" && (
                    <div>
                        {/* Header con bienvenida y buscador */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-cyan-800 mb-1">
                                    Bienvenido, {usuario?.nombre}
                                </h1>
                                <p className="text-gray-500 text-sm">Tu espacio creativo en ArteNauta</p>
                            </div>

                            {/*barra de búsqueda */}
                            <div className="flex items-center gap-2 w-full md:w-96">
                                <input
                                    type="text"
                                    placeholder="Buscar por título o descripción..."
                                    value={busqueda}
                                    onChange={(e) => setBusqueda(e.target.value)}
                                    className="w-full px-4 py-2 text-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm text-gray-700"
                                />
                                                                <button
                                    onClick={() => setShowModalFiltros(true)}
                                    className="px-3 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition shadow-sm flex items-center gap-1 font-medium text-sm whitespace-nowrap"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    Filtros
                                </button>
                            </div>
                        </div>

                        {/* Muro de publicaciones */}
                        <div className="bg-white rounded-2xl shadow p-6">
                            <h2 className="text-lg font-bold text-cyan-700 mb-4">Obras destacadas</h2>

                            {loading && (
                                <p className="text-center text-gray-400 py-10">Cargando publicaciones...</p>
                            )}

                            {!loading && publicaciones.length === 0 && (
                                <p className="text-center text-gray-400 py-10">
                                    No se encontraron obras que coincidan con los filtros aplicados.
                                </p>
                            )}

                            {!loading && publicaciones.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {publicaciones.map((item) => (
                                        <PublicacionesCom key={item.id_publicacion || item.id} item={item} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {seccion === "notificaciones" && <Notificaciones usuario={usuario} />}
                {seccion === "conversaciones" && <Conversaciones usuario={usuario} />}
                {seccion === "perfil" && <PerfilUsuario usuario={usuario} setSeccion={setSeccion} />}
            </main>

            {/* Modal subir obra */}
            {showModal && (
                <FormPublicaciones
                    onNuevaPublicacion={handleNuevaPublicacion}
                    onClose={() => setShowModal(false)}
                    idArtistaActivo={usuario?.id}
                />
            )}

            {showModalFiltros && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
                    onClick={() => setShowModalFiltros(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700">Filtros Avanzados</h3>
                            <button onClick={() => setShowModalFiltros(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Ordenar por Fecha:</label>
                                <select
                                    value={filtroFecha}
                                    onChange={(e) => { setFiltroFecha(e.target.value); setFiltroLikes(""); }}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white text-gray-700"
                                >
                                    <option value="desc">Más recientes primero</option>
                                    <option value="asc">Más antiguas primero</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Ordenar por Popularidad (Likes):</label>
                                <select
                                    value={filtroLikes}
                                    onChange={(e) => setFiltroLikes(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white text-gray-700"
                                >
                                    <option value="">Por defecto</option>
                                    <option value="desc">Más populares</option>
                                    <option value="asc">Menos populares</option>
                                </select>
                            </div>
                            <button
                                onClick={() => setShowModalFiltros(false)}
                                className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 rounded-xl text-sm transition"
                            >
                                Aplicar filtros
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PanelArtista;
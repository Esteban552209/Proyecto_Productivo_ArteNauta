import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import PerfilUsuario from "./PerfilUsuario";
import FormPublicaciones from "../FormPublicaciones";
import HeaderPanel from "./HeaderPanel";
import Conversaciones from "./ModulosConversaciones/VistaChats";
import Notificaciones from "./Notificaciones";
import { supabase } from "../../lib/supabase";

function PanelArtista({ setVista }) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const [seccion, setSeccion] = useState("inicio");
    const [showModal, setShowModal] = useState(false);
    const [obras, setObras] = useState([]);

    // --- CARGAR PUBLICACIONES DIRECTO DESDE SUPABASE ---
    useEffect(() => {
        const cargarMisObras = async () => {
            if (!usuario?.id) return;
            try {
                // Hacemos la consulta a la tabla 'publicaciones'
                const { data, error } = await supabase
                    .from('publicaciones')
                    .select('*')
                    .eq('id_artista', usuario.id) // Supabase filtra directamente en el servidor
                    .order('created_at', { ascending: false }); // Trae las más recientes primero

                if (error) throw error;

                setObras(data || []);
            } catch (error) {
                console.error("Error cargando obras desde Supabase:", error);
                Swal.fire("Error", "No se pudieron cargar tus obras desde la base de datos", "error");
            }
        };
        cargarMisObras();
    }, [usuario?.id]);

    // --- ELIMINAR PUBLICACIÓN DIRECTO EN SUPABASE ---
    const handleEliminar = async (id) => {
        const confirmacion = await Swal.fire({
            title: "¿Eliminar obra?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#0891b2",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (!confirmacion.isConfirmed) return;

        try {
            // Borramos la fila en Supabase cuyo ID coincida
            // Gracias a las políticas RLS, si el usuario no es dueño de la obra, Supabase rechazará la petición
            const { error } = await supabase
                .from('publicaciones')
                .delete()
                .eq('id', id);

            if (error) throw error;

            // Si Supabase lo borra con éxito, actualizamos la interfaz inmediatamente
            setObras((prev) => prev.filter((obra) => obra.id !== id));
            
            Swal.fire({
                title: "Eliminada",
                text: "Tu publicación fue eliminada correctamente de Supabase",
                icon: "success",
                confirmButtonColor: "#0891b2",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            console.error("Error al eliminar:", err);
            Swal.fire("Error", "No se pudo eliminar la obra. Verifica tus políticas RLS.", "error");
        }
    };

    const handleNuevaPublicacion = (nueva) => {
        setObras((prev) => [nueva, ...prev]);
        setShowModal(false); // Cierra el modal automáticamente al subir la obra
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
                        <h1 className="text-2xl font-bold text-cyan-800 mb-2">
                            Bienvenido, {usuario?.nombre}
                        </h1>
                        <p className="text-gray-500 mb-8">Tu espacio creativo en ArteNauta</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-cyan-500">
                                <p className="text-gray-500 text-sm">Mis obras publicadas</p>
                                <p className="text-3xl font-bold text-cyan-700 mt-1">{obras.length}</p>
                            </div>
                            <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-pink-500">
                                <p className="text-gray-500 text-sm">Me gusta recibidos</p>
                                <p className="text-3xl font-bold text-pink-600 mt-1">0</p>
                            </div>
                        </div>

                        <div className="mt-8 bg-white rounded-2xl shadow p-6">
    <h2 className="text-lg font-bold text-cyan-700 mb-4">Mis Obras</h2>

    {obras.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
            <svg className="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <p className="text-sm mb-4">Aún no has subido ninguna obra.</p>
            <button
                onClick={() => setShowModal(true)}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
                Subir mi primera obra
            </button>
        </div>
    ) : (
        /* Cambiamos a un diseño de rejilla (Grid) responsivo y limpio */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {obras.map((obra) => (
                <div key={obra.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 relative flex flex-col justify-between shadow-sm hover:shadow-md transition">
                    
                    {/* Botón de eliminar posicionado arriba a la derecha */}
                    <button
                        onClick={() => handleEliminar(obra.id)}
                        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 text-red-500 hover:text-red-700 transition z-10"
                        title="Eliminar obra"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                        </svg>
                    </button>

                    {/* CONTENEDOR DE LA PREVISUALIZACIÓN DE LA IMAGEN */}
                    <div className="w-full h-48 flex items-center justify-center overflow-hidden rounded-lg bg-gray-200 mb-4 relative">
                        {/* IMPORTANTE: Verifica si en tu tabla de Supabase la columna se llama 
                          "Contenido" (con C mayúscula) o "contenido" (minúscula). 
                          De igual manera con "Titulo" y "Descripcion".
                        */}
                        {obra.Contenido || obra.contenido ? (
                            <img
                                src={obra.Contenido || obra.contenido}
                                alt={obra.Titulo || obra.titulo}
                                className="w-full h-full object-cover rounded-lg hover:scale-105 transition duration-300"
                            />
                        ) : (
                            /* En caso de que la obra no tenga imagen cargada o la URL falle */
                            <div className="flex flex-col items-center text-gray-400 text-xs">
                                <svg className="w-8 h-8 mb-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                Sin vista previa
                            </div>
                        )}
                    </div>

                    {/* TEXTOS DE LA PUBLICACIÓN */}
                    <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 text-base truncate mb-1">
                            {obra.Titulo || obra.titulo || "Sin título"}
                        </p>
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {obra.Descripcion || obra.descripcion || "Sin descripción proporcionada."}
                        </p>
                    </div>
                    
                </div>
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

            {showModal && (
                <FormPublicaciones
                    onNuevaPublicacion={handleNuevaPublicacion}
                    onClose={() => setShowModal(false)}
                    idArtistaActivo={usuario?.id}
                />
            )}
        </div>
    );
}

export default PanelArtista;
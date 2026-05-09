import React, { useEffect, useState } from "react";
import supabase from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import Swal from "sweetalert2";

function AdminArtistRequests() {
    const { role } = useAuth();
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectMessage, setRejectMessage] = useState("");

    // Cargar solicitudes pendientes
    useEffect(() => {
        if (role !== "administrador") return;

        const fetchRequests = async () => {
            try {
                const { data, error } = await supabase
                    .from("artist_requests")
                    .select(`
                        *,
                        profiles:user_id (username, avatar_url)
                    `)
                    .eq("status", "pending")
                    .order("created_at", { ascending: true });

                if (error) {
                    console.error("Error al cargar solicitudes:", error);
                } else if (data) {
                    setRequests(data);
                }
            } catch (err) {
                console.error("Error inesperado:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [role]);

    const handleAccept = async (id) => {
        try {
            // Optimistic update
            setRequests((prev) => prev.filter((r) => r.id !== id));

            const { error } = await supabase
                .from("artist_requests")
                .update({ status: "accepted", updated_at: new Date().toISOString() })
                .eq("id", id);

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Solicitud Aceptada",
                text: "El usuario ahora es artista y ha sido notificado.",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error aceptando la solicitud:", error);
            Swal.fire("Error", "No se pudo aceptar la solicitud.", "error");
        }
    };

    const openRejectModal = (id) => {
        setRejectingId(id);
        setRejectMessage("");
        setIsModalOpen(true);
    };

    const handleReject = async () => {
        if (!rejectingId) return;

        try {
            const idToReject = rejectingId;
            setIsModalOpen(false);
            
            // Optimistic update
            setRequests((prev) => prev.filter((r) => r.id !== idToReject));

            const { error } = await supabase
                .from("artist_requests")
                .update({ 
                    status: "rejected", 
                    message: rejectMessage,
                    updated_at: new Date().toISOString() 
                })
                .eq("id", idToReject);

            if (error) throw error;

            Swal.fire({
                icon: "success",
                title: "Solicitud Rechazada",
                text: "El usuario ha sido notificado del rechazo.",
                timer: 2000,
                showConfirmButton: false
            });
        } catch (error) {
            console.error("Error rechazando la solicitud:", error);
            Swal.fire("Error", "No se pudo rechazar la solicitud.", "error");
        } finally {
            setRejectingId(null);
        }
    };

    if (role !== "administrador") return null;

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500">Cargando solicitudes...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Solicitudes de Artistas</h2>

            {requests.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <p className="text-green-600 font-medium text-lg">No hay solicitudes pendientes ✅</p>
                    <p className="text-gray-500 mt-1">Todo está al día.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {requests.map((req) => (
                        <div key={req.id} className="border rounded-xl p-5 hover:shadow-lg transition-shadow bg-gray-50">
                            <div className="flex items-center space-x-4 mb-4">
                                {req.profiles?.avatar_url ? (
                                    <img 
                                        src={req.profiles.avatar_url} 
                                        alt={req.profiles?.username} 
                                        className="w-14 h-14 rounded-full object-cover border-2 border-cyan-200"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-xl border-2 border-cyan-200">
                                        {req.profiles?.username?.charAt(0).toUpperCase() || "?"}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800">{req.profiles?.username}</h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(req.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex space-x-3 mt-4">
                                <button 
                                    onClick={() => handleAccept(req.id)}
                                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Aceptar
                                </button>
                                <button 
                                    onClick={() => openRejectModal(req.id)}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                >
                                    Rechazar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Rechazo */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Motivo del Rechazo</h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Explica brevemente por qué la solicitud no fue aceptada. Este mensaje le llegará al usuario en sus notificaciones.
                        </p>
                        <textarea
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-cyan-500 outline-none resize-none h-32"
                            placeholder="Ej. Tu perfil no cumple con las políticas de calidad..."
                            value={rejectMessage}
                            onChange={(e) => setRejectMessage(e.target.value)}
                        />
                        <div className="flex justify-end space-x-3 mt-6">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="px-5 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleReject}
                                className="px-5 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                                Confirmar Rechazo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminArtistRequests;

import React, { useEffect, useState } from "react";
import supabase from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import Swal from "sweetalert2";

function SolicitarArtista() {
    const { currentUser, role } = useAuth();
    const [requestStatus, setRequestStatus] = useState(null); // 'pending', 'accepted', 'rejected', or null
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!currentUser?.id) {
            setIsLoading(false);
            return;
        }

        const fetchRequestStatus = async () => {
            try {
                const { data, error } = await supabase
                    .from("artist_requests")
                    .select("status")
                    .eq("user_id", currentUser.id)
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (error && error.code !== "PGRST116") {
                    // PGRST116 means zero rows returned, which is fine
                    console.error("Error fetching request status:", error);
                } else if (data) {
                    setRequestStatus(data.status);
                }
            } catch (err) {
                console.error("Unexpected error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequestStatus();
    }, [currentUser?.id]);

    const handleSolicitar = async () => {
        setIsSubmitting(true);

        const { error } = await supabase
            .from("artist_requests")
            .insert({ user_id: currentUser.id, status: "pending" });

        if (error) {
            console.error("Error inserting request:", error);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "No se pudo enviar la solicitud. Intenta nuevamente.",
                confirmButtonColor: "#0891b2",
            });
            setIsSubmitting(false);
        } else {
            setRequestStatus("pending");
            Swal.fire({
                icon: "success",
                title: "Tu solicitud fue enviada exitosamente ✅",
                text: "El administrador revisará tu perfil.",
                confirmButtonColor: "#0891b2",
                timer: 2500,
                showConfirmButton: false,
            });
            setIsSubmitting(false);
        }
    };

    if (role !== "usuario") return null;
    if (isLoading) return <div className="text-sm text-gray-500 mt-4 text-center">Cargando estado...</div>;
    if (requestStatus === "accepted") return null;

    const isPending = requestStatus === "pending";

    return (
        <button
            onClick={handleSolicitar}
            disabled={isPending || isSubmitting}
            className={`w-full mt-4 border-2 border-dashed py-3 rounded-xl font-semibold transition text-sm ${
                isPending || isSubmitting
                    ? "border-gray-300 text-gray-400 cursor-not-allowed"
                    : "border-cyan-300 hover:border-cyan-500 text-cyan-600 hover:text-cyan-700"
            }`}
        >
            {isSubmitting
                ? "Procesando..."
                : isPending
                ? "Solicitud en revisión..."
                : "Solicitar ser artista"}
        </button>
    );
}

export default SolicitarArtista;
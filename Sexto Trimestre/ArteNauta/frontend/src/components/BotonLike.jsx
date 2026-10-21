import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function BotonLike({
    idPublicacion,
    idUsuarioActual,
    className = "",
    showText = true,
    iconSize = "16"
}) {

    const [totalLikes, setTotalLikes] = useState(0);
    const [dioLike, setDioLike] = useState(false);
    const [cargando, setCargando] = useState(true);

    useEffect(() => {

        const obtenerDatosLikes = async () => {
            try {

                const res = await fetch(
                    `http://localhost:3000/publicaciones/${idPublicacion}/likes-info?id_usuario=${idUsuarioActual || ""}`
                );

                if (!res.ok) {
                    throw new Error("No se pudieron obtener los likes.");
                }

                const data = await res.json();

                setTotalLikes(data.totalLikes ?? 0);
                setDioLike(data.usuarioDioLike ?? false);

            } catch (error) {
                console.error("Error al traer los likes:", error);
            } finally {
                setCargando(false);
            }
        };

        if (idPublicacion) {
            obtenerDatosLikes();
        }

    }, [idPublicacion, idUsuarioActual]);

    const handleLikeClick = async (e) => {
        e.stopPropagation();

        if (!idUsuarioActual) {
            Swal.fire({
                icon: "warning",
                title: "Sesión requerida",
                text: "Debes iniciar sesión para dar me gusta.",
                confirmButtonColor: "#0891b2"
            });
            return;
        }

        const estadoPrevioLike = dioLike;
        const contadorPrevio = totalLikes;

        setDioLike(!dioLike);
        setTotalLikes(prev => dioLike ? prev - 1 : prev + 1);

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `http://localhost:3000/publicaciones/${idPublicacion}/like`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token && {
                            Authorization: `Bearer ${token}`
                        })
                    },
                    body: JSON.stringify({
                        id_usuario: idUsuarioActual
                    })
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || "No se pudo procesar el like."
                );
            }

        } catch (error) {

            console.error("Error al procesar el like:", error);
            setDioLike(estadoPrevioLike);
            setTotalLikes(contadorPrevio);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: error.message,
                confirmButtonColor: "#0891b2"
            });
        }
    };

    if (cargando) {
        return (
            <span className="text-xs text-gray-400">
                ...
            </span>
        );
    }

    const estiloBoton = className || `
        flex items-center gap-1.5 px-3 py-1.5 rounded-full
        border transition text-xs font-medium
        ${
            dioLike
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-400"
        }
    `;

    return (
        <button
            onClick={handleLikeClick}
            className={estiloBoton}
        >
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 24 24"
                fill={dioLike ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z" />
            </svg>

            {showText && (
                <span>
                    {totalLikes}
                </span>
            )}
        </button>
    );
}
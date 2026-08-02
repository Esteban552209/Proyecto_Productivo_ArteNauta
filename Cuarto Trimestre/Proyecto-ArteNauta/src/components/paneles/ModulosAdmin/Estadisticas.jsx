import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const API_BASE = 'http://localhost:3000';

const StatCard = ({ label, value, colorBorder, textColor, icon }) => (
    <div className={`bg-white rounded-2xl shadow-sm p-6 border-l-4 ${colorBorder} flex items-center justify-between transition-all hover:shadow-md`}>
        <div>
            <p className="text-gray-400 font-medium text-xs uppercase tracking-wider">{label}</p>
            <p className={`text-3xl font-bold ${textColor} mt-1`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gray-50 text-gray-500`}>
            {icon}
        </div>
    </div>
);

function Estadisticas() {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalArtistas: 0,
        totalPublicaciones: 0,
        totalComentarios: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const obtenerEstadisticas = async () => {
            const token = localStorage.getItem("token");
            try {
                setLoading(true);
                const res = await fetch(`${API_BASE}/dashboard/estadisticas`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (res.status === 401) return window.location.reload();
                if (!res.ok) throw new Error("No se pudieron cargar las métricas.");

                const data = await res.json();
                setStats(data);
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
                Swal.fire("Error", "No se pudieron sincronizar los contadores en tiempo real", "error");
            } finally {
                setLoading(false);
            }
        };

        obtenerEstadisticas();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-400 text-sm animate-pulse">Sincronizando métricas en tiempo real...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Usuarios Registrados */}
                <StatCard
                    label="Usuarios en total"
                    value={stats.totalUsuarios}
                    colorBorder="border-cyan-500"
                    textColor="text-cyan-700"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                            <circle cx="9" cy="7" r="4"></circle>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                        </svg>
                    }
                />

                <StatCard
                    label="Artistas verificados"
                    value={stats.totalArtistas}
                    colorBorder="border-purple-500"
                    textColor="text-purple-700"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 14.7255 3.09032 17.1962 4.85857 19H12V22Z" />
                            <circle cx="12" cy="11" r="3" />
                        </svg>
                    }
                />

                <StatCard
                    label="Obras publicadas"
                    value={stats.totalPublicaciones}
                    colorBorder="border-green-500"
                    textColor="text-green-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                        </svg>
                    }
                />
                
                <StatCard
                    label="Comentarios"
                    value={stats.totalComentarios}
                    colorBorder="border-amber-500"
                    textColor="text-amber-600"
                    icon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                        </svg>
                    }
                />
            </div>
        </div>
    );
}

export default Estadisticas;
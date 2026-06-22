import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000';
const API_PUBLICACIONES = 'https://69d0711b90cd06523d5d38c4.mockapi.io/ApiAplicaciones';

const StatCard = ({ label, value, colorBorder, textColor }) => (
    <div
        className={`bg-white rounded-2xl shadow p-6 border-l-4 ${colorBorder}`}
    >
        <p className="text-gray-500 text-sm">{label}</p>
        <p className={`text-3xl font-bold ${textColor} mt-1`}>{value}</p>
    </div>
);

function Estadisticas() {
    const [stats, setStats] = useState({
        usuarios: 0,
        publicaciones: 0,
        comentarios: 0,
    });

    useEffect(() => {
        const obtenerEstadisticas = async () => {
            try {
                const [resUsers, resPosts, resComments] = await Promise.all([
                    fetch(`${API_BASE}/usuarios`),
                    fetch(`${API_PUBLICACIONES}`),
                    fetch(`${API_BASE}/comentarios`),
                ]);

                const dataUsers = await resUsers.json();
                const dataPosts = await resPosts.json();
                const dataComments = await resComments.json();

                setStats({
                    usuarios: dataUsers.length,
                    publicaciones: dataPosts.length,
                    comentarios: dataComments.length,
                });
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
            }
        };

        obtenerEstadisticas();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
                label="Usuarios registrados"
                value={stats.usuarios}
                colorBorder="border-cyan-500"
                textColor="text-cyan-700"
            />
            <StatCard
                label="Publicaciones"
                value={stats.publicaciones}
                colorBorder="border-green-500"
                textColor="text-green-600"
            />
            <StatCard
                label="Comentarios"
                value={stats.comentarios}
                colorBorder="border-purple-500"
                textColor="text-purple-600"
            />
        </div>
    );
}

export default Estadisticas;

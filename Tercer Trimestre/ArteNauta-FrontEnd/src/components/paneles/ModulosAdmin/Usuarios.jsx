import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const API_LOCAL_USUARIOS = "http://localhost:3000";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);

    const [filtro, setFiltro] = useState("todos");

    const obtenerUsuarios = async () => {
        try {
            const res = await fetch(
                `${API_LOCAL_USUARIOS}/usuarios?estado=${filtro}`,
            );
            if (!res.ok) throw new Error("Error al obtener los usuarios");
            const data = await res.json();
            setUsuarios(data);
        } catch (err) {
            console.error(err);
            Swal.fire("Error", "No se pudieron cargar los usuarios", "error");
        }
    };

    useEffect(() => {
        obtenerUsuarios();
    }, [filtro]);

    const handleEliminar = async (url, id, setter, lista, idField = "id") => {
        const confirmacion = await Swal.fire({
            title: "¿Eliminar?",
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
            const res = await fetch(`${url}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("No se pudo eliminar");
            setter(lista.filter((item) => item[idField] !== id));
            Swal.fire({
                title: "Eliminado",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });
        } catch (err) {
            Swal.fire("Error", err.message, "error");
        }
    };

    return (
        <section>
            <div>
                <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                    Usuarios registrados
                </h2>

                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setFiltro("todos")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filtro === "todos"
                                ? "bg-cyan-600 text-white shadow-md"
                                : "bg-white text-cyan-600 border border-cyan-600 hover:bg-cyan-50"
                        }`}
                    >
                        Todos
                    </button>
                    <button
                        onClick={() => setFiltro("true")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filtro === "true"
                                ? "bg-green-900 text-white shadow-md"
                                : "bg-white text-green-700 border border-green-700 hover:bg-green-50"
                        }`}
                    >
                        Activos
                    </button>
                    <button
                        onClick={() => setFiltro("false")}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filtro === "false"
                                ? "bg-red-900 text-white shadow-md"
                                : "bg-white text-red-700 border border-red-700 hover:bg-red-50"
                        }`}
                    >
                        Desactivados
                    </button>
                </div>

                    <table className="w-full text-sm rounded-3xl shadow">
                        <thead className="bg-cyan-100 text-cyan-700">
                            <tr>
                                <th className="text-left px-6 py-3">Id</th>
                                <th className="text-left px-6 py-3">Nombre</th>
                                <th className="text-left px-6 py-3">Apellido</th>
                                <th className="text-left px-6 py-3">Email</th>
                                <th className="text-left px-6 py-3">Fecha Registro</th>
                                <th className="text-left px-6 py-3">Estado</th>
                                <th className="text-left px-6 py-3">Rol</th>
                                <th className="text-left px-6 py-3">Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((u, i) => (
                                <tr
                                    key={u.id}
                                    className={
                                        i % 2 === 0 ? "bg-white" : "bg-gray-50"
                                    }
                                >
                                    <td className="px-6 py-3 font-medium text-gray-700">
                                        {u.id_usuario}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {u.nombre}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {u.apellido}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {u.email}
                                    </td>
                                    <td className="px-6 py-3 text-gray-700">
                                        {new Date(u.fecha_registro).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                u.estado_cuenta === true
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {u.estado_cuenta === true
                                                ? "Activo"
                                                : "Desactivado"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                u.roles.nombre_rol ===
                                                "Administrador"
                                                    ? "bg-cyan-100 text-cyan-800"
                                                    : u.roles?.nombre_rol ===
                                                        "Artista"
                                                        ? "bg-purple-100 text-purple-800"
                                                        : "bg-gray-100 text-green-600"
                                            }`}
                                        >
                                            {u.roles?.nombre_rol}
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
        </section>
    );
}

export default Usuarios;

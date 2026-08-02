import { useState, useEffect } from "react";
import Swal from "sweetalert2";
const API_LOCAL_USUARIOS = "http://localhost:3000";

function Usuarios() {
    const [usuarios, setUsuarios] = useState([]);
    const [filtro, setFiltro] = useState("todos");
    const [busqueda, setBusqueda] = useState("");
    const [rol, setRol] = useState("");
    const [showModalFiltros, setShowModalFiltros] = useState(false);

    const obtenerUsuarios = async () => {
        const token = localStorage.getItem("token");

        try {
            const params = new URLSearchParams();

            if (filtro !== "todos") params.append("estado", filtro);
            if (busqueda.trim() !== "") params.append("buscar", busqueda);
            if (rol !== "") params.append("rol", rol);

            const res = await fetch(
                `${API_LOCAL_USUARIOS}/usuarios?${params.toString()}`,
                {
                    method: "GET",
                    headers: { 
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            if (res.status === 401) return window.location.reload();
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
    }, [filtro, busqueda, rol]);

    const handleEditar = async (usuario) => {
        const { value: formValues } = await Swal.fire({
            title: '<h3 class="text-2xl font-bold text-cyan-800">Editar Usuario</h3>',
            html: `
            <div class="flex flex-col gap-4 text-left mt-4 px-2">
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Nombre</label>
                    <input id="swal-nombre" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow" value="${usuario.nombre}">
                </div>
                
                <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-1">Apellido</label>
                    <input id="swal-apellido" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-shadow" value="${usuario.apellido}">
                </div>
                <div class="flex gap-4">
                    <div class="w-1/2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Estado</label>
                        <select id="swal-estado" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white">
                            <option value="true" ${usuario.estado_cuenta ? "selected" : ""}>Activo</option>
                            <option value="false" ${!usuario.estado_cuenta ? "selected" : ""}>Desactivado</option>
                        </select>
                    </div>
                    <div class="w-1/2">
                        <label class="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
                        <select id="swal-rol" class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white">
                            <option value="3" ${usuario.roles?.id_rol === 3 ? "selected" : ""}>Administrador</option>
                            <option value="2" ${usuario.roles?.id_rol === 2 ? "selected" : ""}>Artista</option>
                            <option value="1" ${usuario.roles?.id_rol === 1 ? "selected" : ""}>Usuario Final</option>
                        </select>
                    </div>
                </div>
            </div>
        `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: "Guardar Cambios",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#0891b2",
            preConfirm: () => {
                return {
                    nombre: document.getElementById("swal-nombre").value,
                    apellido: document.getElementById("swal-apellido").value,
                    estado_cuenta:
                        document.getElementById("swal-estado").value === "true",
                    id_rol: document.getElementById("swal-rol").value,
                };
            },
        });

        if (formValues) {
            const token = localStorage.getItem("token");

            try {
                const res = await fetch(
                    `${API_LOCAL_USUARIOS}/usuarios/${usuario.id_usuario}`,
                    {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(formValues),
                    },
                );
                if (res.status === 401) return window.location.reload();
                if (!res.ok)
                    throw new Error("No se pudo actualizar el usuario");
                const usuarioActualizado = await res.json();
                setUsuarios(
                    usuarios.map((u) =>
                        u.id_usuario === usuario.id_usuario
                            ? usuarioActualizado
                            : u,
                    ),
                );
                Swal.fire({
                    title: "Actualizado",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } catch (err) {
                Swal.fire("Error", err.message, "error");
            }
        }
    };

    return (
        <section>
            <div>
                <h2 className="text-2xl font-bold text-cyan-800 mb-6">
                    Usuarios registrados
                </h2>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Buscar nombre, apellido o email..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full md:w-80 px-4 py-2 text-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm text-gray-700"
                        />
                        <button
                            onClick={() => setShowModalFiltros(true)}
                            className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition shadow-sm flex items-center gap-2 font-medium text-sm whitespace-nowrap"
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

                <table className="w-full text-sm rounded-3xl shadow">
                    <thead className="bg-cyan-100 text-cyan-700">
                        <tr>
                            <th className="text-left px-6 py-3">Id</th>
                            <th className="text-left px-6 py-3">Nombre</th>
                            <th className="text-left px-6 py-3">Apellido</th>
                            <th className="text-left px-6 py-3">Email</th>
                            <th className="text-left px-6 py-3">
                                Fecha Registro
                            </th>
                            <th className="text-left px-6 py-3">Estado</th>
                            <th className="text-left px-6 py-3">Rol</th>
                            <th className="text px-6 py-3">Editar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u, i) => (
                            <tr
                                key={u.id_usuario}
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
                                    {new Date(
                                        u.fecha_registro,
                                    ).toLocaleDateString()}
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
                                            u.roles?.nombre_rol ===
                                            "Administrador"
                                                ? "bg-cyan-100 text-cyan-800"
                                                : u.roles?.nombre_rol === "Artista"
                                                ? "bg-purple-100 text-purple-800"
                                                : "bg-gray-100 text-green-600"
                                        }`}
                                    >
                                        {u.roles?.nombre_rol}
                                    </span>
                                </td>
                                <td className="px-6 py-3 flex gap-3">
                                    <button
                                        onClick={() => handleEditar(u)}
                                        className="text-blue-500 hover:text-blue-700 transition"
                                        title="Editar usuario"
                                    >
                                        <svg
                                            width="18"
                                            height="18"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

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
                            <h3 className="text-lg font-bold text-gray-700">
                                Filtros Avanzados
                            </h3>
                            <button
                                onClick={() => setShowModalFiltros(false)}
                                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">
                                    Estado de la cuenta:
                                </label>
                                <select
                                    value={filtro}
                                    onChange={(e) => setFiltro(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white text-gray-700"
                                >
                                    <option value="todos">
                                        Todos los usuarios
                                    </option>
                                    <option value="true">Solo Activos</option>
                                    <option value="false">
                                        Solo Desactivados
                                    </option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">
                                    Rol de usuario:
                                </label>
                                <select
                                    value={rol}
                                    onChange={(e) => setRol(e.target.value)}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none bg-white text-gray-700"
                                >
                                    <option value="">Todos los roles</option>
                                    <option value="3">Administradores</option>
                                    <option value="2">Artistas</option>
                                    <option value="1">Usuarios Finales</option>
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
        </section>
    );
}

export default Usuarios;

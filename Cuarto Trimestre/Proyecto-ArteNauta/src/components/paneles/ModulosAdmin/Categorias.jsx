import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const API_LOCAL_BACKEND = "http://localhost:3000";

function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [busqueda, setBusqueda] = useState("");
    const [modalAbierto, setModalAbierto] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [formulario, setFormulario] = useState({
        id_categoria: null,
        nombre_categoria: "",
        descripcion: ""
    });

    const obtenerCategorias = async (buscar = "") => {
        const token = localStorage.getItem("token");
        try {
            setLoading(true);
            const params = buscar ? `?buscar=${encodeURIComponent(buscar)}` : "";
            const res = await fetch(`${API_LOCAL_BACKEND}/categorias${params}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al obtener las categorías");

            const data = await res.json();
            setCategorias(data);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: "No se pudieron cargar las categorías",
                confirmButtonColor: "#0891b2",
                confirmButtonText: "Entendido",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        obtenerCategorias();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            obtenerCategorias(busqueda);
        }, 400);

        return () => clearTimeout(timeoutId);
    }, [busqueda]);

    const abrirModalCrear = () => {
        setFormulario({ id_categoria: null, nombre_categoria: "", descripcion: "" });
        setModoEdicion(false);
        setModalAbierto(true);
    };

    const abrirModalEditar = (categoria) => {
        setFormulario({
            id_categoria: categoria.id_categoria,
            nombre_categoria: categoria.nombre_categoria || "",
            descripcion: categoria.descripcion || "",
        });
        setModoEdicion(true);
        setModalAbierto(true);
    };

    const guardarCategoria = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        setGuardando(true);

        try {
            if (modoEdicion) {
                const res = await fetch(`${API_LOCAL_BACKEND}/categorias/${formulario.id_categoria}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nombre_categoria: formulario.nombre_categoria,
                        descripcion: formulario.descripcion,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al editar la categoría");

                Swal.fire({
                    icon: "success",
                    title: "¡Listo!",
                    text: data.mensaje || "Categoría editada con éxito",
                    confirmButtonColor: "#0891b2",
                    confirmButtonText: "Aceptar",
                });
            } else {
                const res = await fetch(`${API_LOCAL_BACKEND}/categorias`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        nombre_categoria: formulario.nombre_categoria,
                        descripcion: formulario.descripcion,
                    }),
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Error al crear la categoría");

                Swal.fire({
                    icon: "success",
                    title: "¡Listo!",
                    text: "Categoría creada con éxito",
                    confirmButtonColor: "#0891b2",
                    confirmButtonText: "Aceptar",
                });
            }

            setModalAbierto(false);
            await obtenerCategorias(busqueda);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Ups...",
                text: err.message || "Ocurrió un error al guardar la categoría",
                confirmButtonColor: "#0891b2",
                confirmButtonText: "Intentar de nuevo",
            });
        } finally {
            setGuardando(false);
        }
    };

    return (
        <div className="w-full flex flex-col p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-cyan-800 mb-1">
                        Gestión de Categorías
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Administra las clasificaciones de las obras de ArteNauta.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className="w-full md:w-64 px-4 py-2 text-sm border border-cyan-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white shadow-sm text-gray-700"
                    />
                    <button
                        onClick={abrirModalCrear}
                        className="px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition shadow-sm font-medium text-sm whitespace-nowrap"
                    >
                        + Añadir Categoría
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
                {loading ? (
                    <p className="text-center text-gray-400 py-10">Cargando categorías...</p>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-sm">
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Descripción</th>
                                <th className="p-4 font-semibold text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.length > 0 ? (
                                categorias.map((cat) => (
                                    <tr key={cat.id_categoria} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                                        <td className="p-4 font-medium text-gray-700">{cat.nombre_categoria}</td>
                                        <td className="p-4 text-sm text-gray-500">{cat.descripcion}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => abrirModalEditar(cat)}
                                                className="text-cyan-600 hover:text-cyan-800 text-sm font-medium mr-3"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-gray-400 py-10">
                                        No se encontraron categorías.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {modalAbierto && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => !guardando && setModalAbierto(false)}>
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-700">
                                {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
                            </h3>
                            <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-gray-600 font-bold text-lg">✕</button>
                        </div>

                        <form onSubmit={guardarCategoria} className="flex flex-col gap-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    value={formulario.nombre_categoria}
                                    onChange={(e) => setFormulario({...formulario, nombre_categoria: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-500 block mb-1">Descripción</label>
                                <textarea
                                    required
                                    value={formulario.descripcion}
                                    onChange={(e) => setFormulario({...formulario, descripcion: e.target.value})}
                                    className="w-full p-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none resize-none h-20"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={guardando}
                                className="mt-2 w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-medium py-2 rounded-xl text-sm transition"
                            >
                                {guardando ? "Guardando..." : "Guardar Categoría"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Categorias;

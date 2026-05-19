import Swal from "sweetalert2";
import Notificaciones from "./Notificaciones";
import AdminSidebar from "./AdminSidebar";

function HeaderPanel({
    seccion,
    setSeccion,
    setVista,
    onSubirArte,
    sidebarAbierto,
    setSidebarAbierto,
}) {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const idRol = Number(usuario?.id_rol);

    const cerrarSesion = () => {
        Swal.fire({
            title: "¿Cerrar sesión?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#0891b2",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, salir",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.clear();
                setVista(null);
            }
        });
    };

    const btn = (seccionId) =>
        `px-4 py-2 rounded font-medium transition ${
            seccion === seccionId
                ? "bg-white text-cyan-700"
                : "bg-cyan-600 hover:bg-cyan-900"
        }`;

    const rolLabel = {
        3: "Panel Administrador",
        2: "Panel Artista",
        1: "Panel Usuario",
    };

    return (
        <div>
            <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center shadow-lg">
                <div className="flex items-center gap-3">
                    {idRol === 3 && (
                        <button
                            onClick={() => setSidebarAbierto(!sidebarAbierto)}
                            className="p-2 rounded hover:bg-cyan-700 transition mr-1"
                            aria-label="Abrir menú"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    )}

                    <img
                        src="../src/assets/LOGO.png"
                        alt="Logo"
                        className="h-20"
                        onError={(e) => (e.target.style.display = "none")}
                    />
                    <div className="flex flex-col">
                        <span className="font-bold text-lg leading-tight">
                            {rolLabel[idRol] || "ArteNauta"}
                        </span>
                        <span className="text-xs opacity-75">
                            Bienvenido, {usuario?.nombre}
                        </span>
                    </div>
                </div>

                <nav className="flex gap-2 items-center">
                    {idRol === 1 && (
                        <>
                            <button
                                onClick={() => setSeccion("inicio")}
                                className={btn("inicio")}
                            >
                                Inicio
                            </button>
                            <button
                                onClick={() => setSeccion("conversaciones")}
                                className={btn("conversaciones")}
                            >
                                Conversaciones
                            </button>
                            <button
                                onClick={() => setSeccion("perfil")}
                                className={btn("perfil")}
                            >
                                Mi Perfil
                            </button>
                        </>
                    )}

                    {idRol === 2 && (
                        <>
                            <button
                                onClick={() => setSeccion("inicio")}
                                className={btn("inicio")}
                            >
                                Inicio
                            </button>
                            <button
                                onClick={onSubirArte}
                                className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-cyan-900"
                            >
                                Subir Arte
                            </button>
                            <button
                                onClick={() => setSeccion("conversaciones")}
                                className={btn("conversaciones")}
                            >
                                Conversaciones
                            </button>
                            <button
                                onClick={() => setSeccion("perfil")}
                                className={btn("perfil")}
                            >
                                Mi Perfil
                            </button>
                        </>
                    )}

                    <Notificaciones usuario={usuario} />

                    <button
                        onClick={cerrarSesion}
                        className="px-4 py-2 rounded font-medium transition bg-cyan-600 hover:bg-red-800"
                    >
                        Cerrar Sesión
                    </button>
                </nav>
            </header>

            {idRol === 3 && (
                <AdminSidebar
                    seccion={seccion}
                    setSeccion={setSeccion}
                    abierto={sidebarAbierto}
                    onCerrar={() => setSidebarAbierto(false)}
                />
            )}
        </div>
    );
}

export default HeaderPanel;

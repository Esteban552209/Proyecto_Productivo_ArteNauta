function AdminSidebar({ seccion, setSeccion, abierto, onCerrar }) {
    const items = [
        {
            id: "inicio",
            label: "Inicio",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                </svg>
            ),
        },
        {
            id: "usuarios",
            label: "Usuarios",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
            ),
        },
        {
            id: "publicaciones",
            label: "Publicaciones",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            id: "comentarios",
            label: "Comentarios",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                </svg>
            ),
        },
        {
            id: "conversaciones",
            label: "Conversaciones",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                </svg>
            ),
        },
        {
            id: "perfil",
            label: "Mi Perfil",
            icon: (
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                </svg>
            ),
        },
    ];

    const handleNavegar = (id) => {
        setSeccion(id);
        onCerrar();
    };

    return (
        <div>
            {abierto && (
                <div
                    className="fixed inset-0 z-30"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.25)" }}
                    onClick={onCerrar}
                />
            )}

            <aside
                className={`
                    fixed top-0 left-0 h-full w-64 z-40
                    bg-gradient-to-b from-cyan-900 to-cyan-800
                    text-white shadow-2xl
                    transform transition-transform duration-300 ease-in-out
                    ${abierto ? "translate-x-0" : "-translate-x-full"}
                `}
            >
                <div className="flex items-center justify-between p-4 border-b border-cyan-700">
                    <span className="font-bold text-lg tracking-wide">
                        ArteNauta
                    </span>
                    <button
                        onClick={onCerrar}
                        className="p-1 rounded hover:bg-cyan-700 transition"
                        aria-label="Cerrar menú"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <div className="px-4 py-3 bg-cyan-950 bg-opacity-40">
                    <span className="text-xs font-semibold uppercase tracking-widest text-cyan-300">
                        Administrador
                    </span>
                </div>

                <nav className="flex flex-col gap-1 p-3 mt-2">
                    {items.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavegar(item.id)}
                            className={`
                                flex items-center gap-3 px-4 py-3 rounded-lg text-left
                                font-medium transition-all duration-150
                                ${
                                    seccion === item.id
                                        ? "bg-white text-cyan-800 shadow"
                                        : "hover:bg-cyan-700 hover:bg-opacity-60 text-white"
                                }
                            `}
                        >
                            {item.icon}
                            <span>{item.label}</span>

                            {seccion === item.id && (
                                <span className="ml-auto w-2 h-2 rounded-full bg-cyan-500" />
                            )}
                        </button>
                    ))}
                </nav>
            </aside>
        </div>
    );
}

export default AdminSidebar;

function LoginModal({ isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.5)" }} onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative" onClick={(e) => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl">
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-center text-cyan-600 mb-1">
                    Iniciar Sesión
                </h2>
                <p className="text-center text-gray-500 text-sm mb-6">
                    Bienvenido de nuevo a ArteNauta
                </p>

                <div className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input type="email" placeholder="Correo Electronico" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input type="password" placeholder="Contarseña" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                    </div>

                    <p className="text-right text-sm text-cyan-600 hover:underline cursor-pointer">
                        ¿Olvidaste tu contraseña?
                    </p>

                    <button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-lg transition">
                        Entrar
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        ¿No tienes cuenta? {" "}
                        <span className="text-cyan-600 hover:underline cursor-pointer font-medium">
                            Regístrate
                        </span>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
import { useState, useEffect } from "react"
import InicioSesionModal from '../components/InicioSesionModal'
import RegistroModal from "../components/RegistroModal"

function Header({setPagina, setVista}){
    const [showLogin, setShowLogin] = useState(false)
    const [showRegistro, setShowRegistro] = useState(false)
    const [animate, setAnimate] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(timer);
    }, []);

    return(
        <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center relative">
            <div className={`transition-all duration-[1000ms] ease-out ${animate ? 'translate-x-0 translate-y-0 opacity-100' : '-translate-x-6 -translate-y-2 opacity-0'}`}>    
                <img src="../src/assets/LOGO.png" alt="Logo" className="h-20" />
            </div>
            <nav className={`transition-all duration-[1000ms] ease-out delay-150 ${animate ? 'translate-x-0 translate-y-0 opacity-100' : 'translate-x-6 -translate-y-2 opacity-0'}`}>
                <ul>
                    <button onClick={() => setPagina("home")} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900 transition-colors duration-300 cursor-pointer">Inicio</button>
                    <button onClick={() => setPagina("contacto")} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900 transition-colors duration-300 cursor-pointer">Contáctanos</button>
                    <button onClick={() => setShowRegistro(true)} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900 transition-colors duration-300 cursor-pointer">Regístrate</button>
                    <button onClick={() => setShowLogin(true)} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900 transition-colors duration-300 cursor-pointer">Iniciar Sesión</button>
                </ul>
            </nav>
            <InicioSesionModal isOpen={showLogin} onClose={() => setShowLogin(false)} setVista={setVista}/>
            <RegistroModal isOpen={showRegistro} onClose={() => setShowRegistro(false)}/>
        </header>
    )
}

export default Header
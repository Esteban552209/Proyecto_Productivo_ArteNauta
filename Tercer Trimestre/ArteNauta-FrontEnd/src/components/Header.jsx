import { useState } from "react"
import InicioSesionModal from '../components/InicioSesionModal'
import RegistroModal from "../components/RegistroModal"

function Header({setPagina, setVista}){
    const [showLogin, setShowLogin] = useState(false)
    const [showRegistro, setShowRegistro] = useState(false)
    return(
        <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center">
            <div>    
                <img src="../src/assets/LOGO.png" alt="Logo" className="h-20" />
            </div>
            <nav>
                <ul>
                    <button onClick={() => setPagina("home")} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Inicio</button>
                    <button onClick={() => setPagina("contacto")} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Contáctanos</button>
                    <button onClick={() => setShowRegistro(true)} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Regístrate</button>
                    <button onClick={() => setShowLogin(true)} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Iniciar Sesión</button>
                </ul>
            </nav>
            <InicioSesionModal isOpen={showLogin} onClose={() => setShowLogin(false)} setVista={setVista}/>
                <RegistroModal isOpen={showRegistro} onClose={() => setShowRegistro(false)}/>
        </header>
    )
}

export default Header
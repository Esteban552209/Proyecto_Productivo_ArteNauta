import { useState } from "react"
import InicioSesionModal from '../components/InicioSesionModal'

function Header(){
    const [showLogin, setShowLogin] = useState(false)
    return(
        <header className="bg-gradient-to-r from-cyan-900 to-cyan-400 text-white p-4 flex justify-between items-center">
            <div>    
                <h1>Logo ArteNauta</h1>
            </div>
            <nav>
                <ul>
                    <button className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Contáctanos</button>
                    <button className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Regístrate</button>
                    <button onClick={() => setShowLogin(true)} className="bg-cyan-600 box-border p-2 rounded mx-1 hover:bg-cyan-900">Iniciar Sesión</button>
                </ul>
            </nav>
            <InicioSesionModal isOpen={showLogin} onClose={() => setShowLogin(false)}/>
        </header>
    )
}

export default Header
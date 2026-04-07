function PanelArtista({setVista}){
    const cerrarSesion = () => {
        localStorage.removeItem("usuario");
        localStorage.removeItem("token");
        setVista(null);
    }
    
    return(
        <div>
            <h1>Bienvenido Artista</h1>
            <button className="bg-cyan-600 text-white box-border p-2 rounded px-8 mx-1 hover:bg-cyan-900" onClick={cerrarSesion}>Cerrar Sesión</button>
        </div>
    )
}

export default PanelArtista
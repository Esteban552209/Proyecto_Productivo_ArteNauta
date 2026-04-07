import { useState } from 'react'
import './App.css'
import Categorias from './components/Categorias'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Contacto from './components/Contacto'
import PanelAdmin from './components/paneles/PanelAdmin'
import PanelArtista from './components/paneles/PanelArtista'
import PanelUsuario from './components/paneles/PanelUsuario'

function App() {
  const [pagina, setPagina] = useState("home")
  const [vista, setVista] = useState(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (!usuarioGuardado || !token) return null;

    try {
      const usuario = JSON.parse(usuarioGuardado);

      if (usuario.rol === "admin") return "admin";
      if (usuario.rol === "artista") return "artista";
      if (usuario.rol === "usuario") return "usuario";

      return null;
    } catch (error) {
      console.log(error)
      return null;
    }
  });

  if (vista === "admin") return <PanelAdmin setVista={setVista}/>
  if (vista === "artista") return <PanelArtista setVista={setVista}/>
  if (vista === "usuario") return <PanelUsuario setVista={setVista}/>

  return (
    <div className='flex flex-col min-h-screen'>
      <Header setPagina={setPagina} setVista={setVista}/>
      <Hero pagina={pagina}/>
      <main className='flex-1'>
        {pagina === "home" && <Categorias/>}
        {pagina === "contacto" && <Contacto/>}
      </main>
      <Footer/>
    </div>
  )
}

export default App

import { useState } from 'react'
import './App.css'
import Categorias from './components/Categorias'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Contacto from './components/Contacto'

function App() {
  const [pagina, setPagina] = useState("home")

  return (
    <div className='flex flex-col min-h-screen'>
      <Header setPagina={setPagina}/>
      <main className='flex-1'>
        {pagina === "home" && <Hero/>}
        {pagina === "home" && <Categorias/>}
        {pagina === "contacto" && <Contacto/>}
      </main>
      <Footer/>
    </div>
  )
}

export default App

import './App.css'
import Categorias from './components/Categorias'
import Footer from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'

function App() {

  return (
    <div className='flex flex-col min-h-screen'>
      <Header/>
      <Hero/>
      <main className='flex-1'>
        <Categorias/>
      </main>
      <Footer/>
    </div>
  )
}

export default App

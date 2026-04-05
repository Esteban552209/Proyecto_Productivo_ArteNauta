import categoria1 from "../assets/categoria1.jpg"
import categoria2 from "../assets/categoria2.jpg"
import categoria3 from "../assets/categoria3.jpg"
function Categorias(){
    return(
        <section className="py-6 max-w-7xl mx-auto">
            <h2 className="text-cyan-600 text-3xl font-bold mb-6 text-center">Categorias</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria1} alt="Artes Plasticas" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Plasticas</h3>
                    <p className="text-center px-2">Pinturas, Esculturas, Dibujo, Grabado, etc.</p>
                </div>
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria2} alt="Artes Musicales" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Musicales</h3>
                    <p className="text-center px-2">Trabajos musicales independientes, Composiciones y Construccion de samples.</p>
                </div>
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria3} alt="Artes Danzarias" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Danzarias</h3>
                    <p className="text-center px-2">Coreografias basadas en hip hop, breaking, locking, popping, house, dancehall y waacking.</p>
                </div>
            </div>
        </section>
    )
}

export default Categorias
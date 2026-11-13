import categoria1 from "../assets/categoria1.jpg"
import categoria2 from "../assets/categoria2.jpg"
import categoria3 from "../assets/categoria3.jpg"
import categoria4 from "../assets/categoria4.jpg"
import categoria5 from "../assets/categoria5.jpg"
import categoria6 from "../assets/categoria6.jpg"
function Categorias(){
    return(
        <section className="py-6 max-w-7xl mx-auto">
            <h2 className="text-cyan-600 text-3xl font-bold mb-6 text-center">Categorias</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria1} alt="Artes Plasticas" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Plasticas</h3>
                    <p className="text-center px-2">Pinturas, Esculturas, Dibujo, Grabado, etc.</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria2} alt="Artes Musicales" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Musicales</h3>
                    <p className="text-center px-2">Trabajos musicales independientes, Composiciones y Construccion de samples.</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria3} alt="Artes Danzarias" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Danzarias</h3>
                    <p className="text-center px-2">Coreografias basadas en hip hop, breaking, locking, popping, house, dancehall y waacking.</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria4} alt="Artes Musicales" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Urbanas</h3>
                    <p className="text-center px-2">Trabajos que toman el espacio público como lienzo.</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria5} alt="Artes Musicales" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Digitales y Multimedia</h3>
                    <p className="text-center px-2">Trabajos Utilizan herramientas informáticas, software y dispositivos digitales como el medio principal de creación y difusión.</p>
                </div>
                <div className="bg-white rounded-2xl shadow p-4 cursor-pointer hover:shadow-md transition relative flex flex-col h-full justify-between">
                    <img src={categoria6} alt="Artes Musicales" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Audiovisuales</h3>
                    <p className="text-center px-2">Es la categoría que combina el sonido y la vista de manera sincrónica para crear experiencias narrativas o expresivas.</p>
                </div>
            </div>
        </section>
    )
}

export default Categorias
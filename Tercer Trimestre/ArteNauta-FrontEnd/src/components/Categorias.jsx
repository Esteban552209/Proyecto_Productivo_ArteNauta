import categoria1 from "../assets/categoria1.jpg"

function Categorias(){
    return(
        <section className="py-6 max-w-7xl mx-auto">
            <h2 className="text-cyan-600 text-3xl font-bold mb-6 text-center">Categorias</h2>
            <div className="grid grid-cols-3 gap-6">
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria1} alt="Artes Plasticas" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Plasticas</h3>
                    <p className="text-center">Pinturas, Esculturas, Dibujo, Grabado, etc.</p>
                </div>
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria1} alt="Artes Plasticas" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Plasticas</h3>
                    <p className="text-center">Pinturas, Esculturas, Dibujo, Grabado, etc.</p>
                </div>
                <div className="shadow-lg rounded overflow-hidden mx-5 pb-5">
                    <img src={categoria1} alt="Artes Plasticas" className="w-full h-52 object-cover"/>
                    <h3 className="py-3 font-medium text-center">Artes Plasticas</h3>
                    <p className="text-center">Pinturas, Esculturas, Dibujo, Grabado, etc.</p>
                </div>
            </div>
        </section>
    )
}

export default Categorias
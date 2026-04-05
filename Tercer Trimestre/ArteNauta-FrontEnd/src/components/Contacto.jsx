function Contacto(){
    return(
        <section className="p-4 flex justify-center">
            <form action="" className="p-4 shadow-lg shadow-cyan-800/60 inset-shadow-sm inset-shadow-cyan-800/20 rounded-xl bg-white w-2xl ">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre
                    </label>
                    <input type="text" placeholder="Nombre Completo" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                </div>
                <div>
                    <label className="block mt-3 text-sm font-medium text-gray-700 mb-1">
                        Email
                    </label>
                    <input type="email" placeholder="Correo Electronico" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2    focus:outline-none focus:ring-2 focus:ring-cyan-500"/>
                </div>
                <div>
                    <label className="block mt-3 text-sm font-medium text-gray-700 mb-1">
                        Mensaje
                    </label>
                    <textarea placeholder="Mensaje" className="text-black w-full border border-gray-300 rounded-lg px-4 py-2    focus:outline-none focus:ring-2 focus:ring-cyan-500" rows="10"/>
                </div>
                <div className="mt-3 text-center">
                    <button className="bg-cyan-600 text-white box-border p-2 rounded px-8 mx-1 hover:bg-cyan-900">Envíar</button>
                </div>
            </form>
        </section>
    )
}

export default Contacto
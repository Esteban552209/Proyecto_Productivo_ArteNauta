import logoWhatsapp from "../assets/logo-whatsapp.svg"
import logoGmail from "../assets/gmail.png"
import logoMaps from "../assets/maps.png"

function Contacto(){
    return(
        <section className="max-w-4xl mx-auto my-4 bg-white rounded-2xl overflow-hidden shadow-md flex flex-col md:flex-row">
            <div className="bg-gradient-to-b from-cyan-900 to-cyan-600 text-white p-10 flex flex-col gap-6 md:w-2/5">
                <div>
                    <h2 className="text-xl font-medium mb-2">Contáctanos</h2>
                    <p className="text-sm text-cyan-200">Llena el formulario o usa cualquiera de nuestros canales de contacto.</p>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <img src={logoGmail} alt="logo de gmail" className="w-5"/>
                        </div>
                        <div>
                            <p className="text-xs text-cyan-300 uppercase tracking-wide">Correo</p>
                            <p className="text-sm">ArteNauta@gmail.com</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <img src={logoWhatsapp} alt="logo de whatsapp" className="w-5"/>
                        </div>
                        <div>
                            <p className="text-xs text-cyan-300 uppercase tracking-wide">Whatsapp</p>
                            <p className="text-sm">3118692159</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-2 rounded-lg">
                            <img src={logoMaps} alt="logo de maps" className="w-5"/>
                        </div>
                        <div>
                            <p className="text-xs text-cyan-300 uppercase tracking-wide">Ubicación</p>
                            <p className="text-sm">Colombia</p>
                        </div>
                    </div>
                </div>
            </div>
            <form action="" className="p-5 flex flex-col gap-4 flex-1">
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
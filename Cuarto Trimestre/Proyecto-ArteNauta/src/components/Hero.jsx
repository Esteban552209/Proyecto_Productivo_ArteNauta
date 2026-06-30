import { useState, useEffect } from "react";

function Hero({pagina}){
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 50);
        return () => clearTimeout(timer);
    }, []);

    let titulo, descripcion
    if (pagina === "home") {
        titulo = "El hogar de los artistas y quienes los admiran"
        descripcion = "Explora publicaciones, reacciona, comenta y chatea directamente con artistas. Una red social hecha para el arte."
    } else if (pagina === "contacto") {
        titulo = "¿Tienes alguna pregunta?"
        descripcion = "¿Dudas, sugerencias o simplemente quieres saludarnos? Escríbenos, leemos todos los mensajes."
    } else {
        titulo = "El hogar de los artistas y quienes los admiran"
        descripcion = "Explora publicaciones, reacciona, comenta y chatea directamente con artistas. Una red social hecha para el arte."
    }
    return(
        <section className="bg-gradient-to-l from-cyan-900 to-cyan-400 text-white text-center pt-8 px-100 overflow-hidden">
            <h1 className={`text-3xl font-semibold mb-4 transition-all duration-[1000ms] ease-out ${animate ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>{titulo}</h1>
            <p className={`text-lg mb-6 transition-all duration-[1200ms] ease-out delay-200 ${animate ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>{descripcion}</p>
        </section>
    )
}

export default Hero
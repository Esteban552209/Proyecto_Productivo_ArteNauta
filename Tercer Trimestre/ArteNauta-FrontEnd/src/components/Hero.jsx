function Hero({pagina}){
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
        <section className="bg-gradient-to-l from-cyan-900 to-cyan-400 text-white text-center pt-8 px-100">
            <h1 className="text-3xl font-semibold mb-4">{titulo}</h1>
            <p className="text-lg mb-6">{descripcion}</p>
        </section>
    )
}

export default Hero
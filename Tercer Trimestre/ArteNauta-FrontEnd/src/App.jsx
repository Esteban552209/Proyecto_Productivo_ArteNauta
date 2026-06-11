import { useState, useEffect } from "react";
import "./App.css";
import Categorias from "./components/Categorias";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Contacto from "./components/Contacto";
import PanelAdmin from "./components/paneles/PanelAdmin";
import PanelArtista from "./components/paneles/PanelArtista";
import PanelUsuario from "./components/paneles/PanelUsuario";
import { supabase } from "./lib/supabase";

function App() {
    const [pagina, setPagina] = useState("home");
    const [vista, setVista] = useState(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        const token = localStorage.getItem("token");
        if (!usuarioGuardado || !token) return null;
        try {
            const usuario = JSON.parse(usuarioGuardado);
            return usuario.id_rol;
        } catch (error) {
            console.log(error);
            return null;
        }
    });

    // Escuchar cambio de rol en tiempo real
    useEffect(() => {
        const usuarioGuardado = localStorage.getItem("usuario");
        if (!usuarioGuardado) return;
        const usuario = JSON.parse(usuarioGuardado);
        if (!usuario?.id_usuario) return;

        const canal = supabase
            .channel(`rol-usuario-${usuario.id_usuario}`)
            .on("postgres_changes", {
                event: "UPDATE",
                schema: "public",
                table: "usuarios",
                filter: `id_usuario=eq.${usuario.id_usuario}`,
            }, (payload) => {
                const nuevoRol = payload.new?.id_rol;
                if (nuevoRol && nuevoRol !== usuario.id_rol) {
                    const actualizado = { ...usuario, id_rol: nuevoRol };
                    localStorage.setItem("usuario", JSON.stringify(actualizado));
                    setVista(nuevoRol);
                }
            })
            .subscribe();

        return () => supabase.removeChannel(canal);
    }, []);

    if (vista === 3) return <PanelAdmin setVista={setVista} />;
    if (vista === 2) return <PanelArtista setVista={setVista} />;
    if (vista === 1) return <PanelUsuario setVista={setVista} />;

    return (
        <div className="flex flex-col min-h-screen">
            <Header setPagina={setPagina} setVista={setVista} />
            <Hero pagina={pagina} />
            <main className="flex-1">
                {pagina === "home" && <Categorias />}
                {pagina === "contacto" && <Contacto />}
            </main>
            <Footer />
        </div>
    );
}

export default App;
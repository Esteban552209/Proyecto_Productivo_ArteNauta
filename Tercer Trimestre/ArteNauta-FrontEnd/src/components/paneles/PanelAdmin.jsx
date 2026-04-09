import { useState, } from "react";
import PerfilUsuario from "./PerfilUsuario";
import HeaderPanel from "./HeaderPanel";
import Conversaciones from "./ModulosConversaciones/VistaChats";
import Usuarios from "./ModulosAdmin/Usuarios";
import Estadisticas from "./ModulosAdmin/Estadisticas";
import Publicaciones from "./ModulosAdmin/Publicaciones";
import Comentarios from "./ModulosAdmin/Comentarios";

function PanelAdmin({ setVista }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [seccion, setSeccion] = useState("inicio");

  return (
    <div className="min-h-screen bg-cyan-50 flex flex-col">
      <HeaderPanel seccion={seccion} setSeccion={setSeccion} setVista={setVista} />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full">
        {seccion === "inicio" && (
          <div>
            <h1 className="text-2xl font-bold text-cyan-800 mb-2">
              Bienvenido, {usuario?.nombre} 
            </h1>
            <p className="text-gray-500 mb-8">Panel de administración de ArteNauta</p>

            <Estadisticas/>
          </div>
        )}

        {seccion === "publicaciones" && (
          <Publicaciones/>
        )}

        {seccion === "usuarios" && (
          <Usuarios/>
        )}

        {seccion === "comentarios" && (
          <Comentarios/>
        )}

        {seccion === "conversaciones" && (
          <Conversaciones usuario={usuario}/>
        )}

        {seccion === "perfil" && (
          <PerfilUsuario usuario={usuario}/>
        )}
      </main>
    </div>
  );
}

export default PanelAdmin;
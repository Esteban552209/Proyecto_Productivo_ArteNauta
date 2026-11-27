import { useState } from "react";
import CrearConversaciones from "./CrearConversacion";
import ListaConversaciones from "./ListaConversaciones";
import Chat from "./Chat";


function VistaChats({ usuario }) {
  const [chatActivo, setChatActivo] = useState(null);
  const [nombreChat, setNombreChat] = useState("");
  const [recargar, setRecargar] = useState(0);

  const abrirChat = (id, nombre) => {
    setChatActivo(id);
    setNombreChat(nombre);
    setRecargar(prev => prev + 1);
  };

  return (
    <div className="flex gap-6 h-[75vh]">

      <div className="w-80 flex flex-col gap-4">
        <CrearConversaciones usuario={usuario} onChatIniciado={abrirChat} recargar={recargar}/>
        <ListaConversaciones usuario={usuario} onAbrirChat={abrirChat} recargar={recargar}/>
      </div>

      <div className="flex-1 bg-white rounded-2xl shadow text-gray-400">
        {chatActivo ? (
          <Chat
            usuario={usuario}
            chatActivo={chatActivo}
            nombreChat={nombreChat}
          />
        ) : (
          <div className="h-full max-w-2xl flex items-center justify-center text-gray-400 text-sm">
            Selecciona una conversación
          </div>
        )}
      </div>
    </div>
  );
}

export default VistaChats;
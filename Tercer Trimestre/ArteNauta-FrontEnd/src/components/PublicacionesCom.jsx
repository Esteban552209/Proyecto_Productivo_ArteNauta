import { useState } from "react"

const API_LOCAL_COMENTARIOS = "http://localhost:3002/comentarios";

export default function PublicacionesCom({ item }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(item.Likes ?? 0)
  const [showComentarios, setShowComentarios] = useState(false)
  const [comentarios, setComentarios] = useState([])
  const [loadingCom, setLoadingCom] = useState(false)
  const [errorCom, setErrorCom] = useState(null)

  const toggleLike = () => {
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const abrirComentarios = () => {
  setShowComentarios(true)
  setLoadingCom(true)
  setErrorCom(null)

  fetch(API_LOCAL_COMENTARIOS)
    .then(res => {
      console.log("Status:", res.status)
      if (!res.ok) throw new Error("Error al cargar comentarios")
      return res.json()
    })
    .then(data => {
      console.log("Todos los comentarios:", data)
      console.log("ID de la publicación:", item.id)

      const filtrados = data.filter(c => {
        console.log("Comparando:", Number(c.id_Publicacion), "===", Number(item.Id))
        return Number(c.id_Publicacion) === Number(item.Id)
      })

      console.log("Comentarios filtrados:", filtrados) 
      setComentarios(filtrados)
      setLoadingCom(false)
    })
    .catch(err => {
      console.log("Error:", err.message)
      setErrorCom(err.message)
      setLoadingCom(false)
    })
}

  return (
    <>
      <div className="bg-white rounded-2xl shadow p-4 hover:shadow-md transition relative">

        {/* Imagen */}
        {item.ArchivoAdjunto && (
          <div className="w-full rounded-lg mb-3 overflow-hidden bg-gray-100">
            <img
              src={item.ArchivoAdjunto}
              alt={item.Titulo}
              className="w-full h-full object-cover"
              onError={(e) => e.target.src = "https://placehold.co/300x200?text=Sin+imagen"}
            />
          </div>
        )}

        <p className="font-semibold text-gray-700">{item.Titulo}</p>
        <p className="text-sm text-gray-400 mt-1 mb-4">{item.Descripcion}</p>

        {/* Botones like y comentarios */}
        <div className="flex items-center gap-3">

          {/* Like */}
          <button
            onClick={toggleLike}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition text-sm ${
              liked
                ? "border-red-400 bg-red-50 text-red-500"
                : "border-gray-200 text-gray-400 hover:border-red-300 hover:text-red-400"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24"
              fill={liked ? "currentColor" : "none"}
              stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21C12 21 3 15.5 3 9.5C3 7 5 5 7.5 5C9.5 5 11 6.5 12 8C13 6.5 14.5 5 16.5 5C19 5 21 7 21 9.5C21 15.5 12 21 12 21Z"/>
            </svg>
            {likes}
          </button>

          {/* Comentarios */}
          <button
            onClick={abrirComentarios}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-cyan-300 hover:text-cyan-500 transition text-sm cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Comentarios
          </button>

        </div>
      </div>

      {/* Modal de comentarios */}
      {showComentarios && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
          onClick={() => setShowComentarios(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header del modal */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-semibold text-gray-700">Comentarios</h2>
                <p className="text-xs text-gray-400 mt-0.5">{item.Titulo}</p>
              </div>
              <button
                onClick={() => setShowComentarios(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Cuerpo del modal */}
            <div className="overflow-y-auto flex-1 p-5">

              {loadingCom && (
                <p className="text-center text-gray-400 py-8">Cargando comentarios...</p>
              )}

              {errorCom && (
                <p className="text-center text-red-400 py-8">Error: {errorCom}</p>
              )}

              {!loadingCom && !errorCom && comentarios.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 text-gray-300">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  <p className="text-sm mt-3">Aún no hay comentarios</p>
                </div>
              )}

              {!loadingCom && !errorCom && comentarios.map(c => (
                <div
                  key={c.id_comentario}
                  className="border-b border-gray-50 py-3 last:border-0"
                >
                  <div className="flex items-center gap-2 mb-1">
                    {/* Avatar con id del usuario */}
                    <div className="w-7 h-7 rounded-full bg-cyan-100 flex items-center justify-center text-xs font-medium text-cyan-700">
                      U{c.id_usuario}
                    </div>
                    <span className="text-xs text-gray-400">{c.FechaComentario}</span>
                  </div>
                  <p className="text-sm text-gray-600 pl-9">{c.Contenido}</p>
                </div>
              ))}

            </div>
          </div>
        </div>
      )}
    </>
  )
}
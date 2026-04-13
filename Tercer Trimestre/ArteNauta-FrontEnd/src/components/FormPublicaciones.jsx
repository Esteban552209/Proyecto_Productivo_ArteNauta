import { useState } from 'react';

const API_URL = 'http://localhost:3002/publicaciones';

export default function FormPublicaciones({ onNuevaPublicacion, onClose, idArtistaActivo }) {
    const [form, setForm] = useState({Titulo: '', Descripcion: '', ArchivoAdjunto: ''});
    const [loading, setLoading] = useState(false);
    const [exito, setExito] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!form.Titulo.trim() || !form.Descripcion.trim()) {
            setError('El título y la descripción son obligatorios');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...form, 
                    Likes: 0, 
                    id_artista: idArtistaActivo 
                }),
            });

            if (!res.ok) throw new Error('No se pudo publicar');

            const nueva = await res.json();
            onNuevaPublicacion(nueva);
            setExito(true);
            setTimeout(() => {
                setExito(false);
                onClose();
            }, 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.32)' }} onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Nueva publicación
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl font-bold">
                        ✕
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <input type="text" name="Titulo" value={form.Titulo} onChange={handleChange} placeholder="Título" className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"/>
                    <textarea name="Descripcion" value={form.Descripcion} onChange={handleChange} placeholder="Descripción" rows={3} className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none"/>
                    <input type="text" name="ArchivoAdjunto" value={form.ArchivoAdjunto} onChange={handleChange} placeholder="URL de la imagen (opcional)" className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"/>

                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    {exito && (
                        <p className="text-green-500 text-sm">
                            ¡Publicado con éxito! ✓
                        </p>
                    )}

                    <button onClick={handleSubmit} disabled={loading} className="bg-cyan-600 text-white rounded-xl py-2 text-sm font-medium hover:bg-cyan-900 transition disabled:opacity-50">
                        {loading ? 'Publicando...' : 'Publicar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
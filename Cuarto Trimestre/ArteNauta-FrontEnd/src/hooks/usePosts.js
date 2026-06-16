import { useState, useEffect } from 'react';

const usePost = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const res = await fetch("http://localhost:3000/Muro-Publicaciones");
        if (!res.ok) throw new Error("Error al obtener las publicaciones del servidor.");
        const data = await res.json();
        setPublicaciones(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerPublicaciones();
  }, []);

  return { publicaciones, loading, error };
};

export default usePost;
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const usePost = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const obtenerPublicaciones = async () => {
      try {
        const { data, error } = await supabase
          .from('publicaciones')
          .select(`
            *,
            usuarios (
              id_usuario,
              nombre
            )
          `)
          .order('fecha_publicacion', { ascending: false }) 
          ;

        if (error) throw error;
        setPublicaciones(data);
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
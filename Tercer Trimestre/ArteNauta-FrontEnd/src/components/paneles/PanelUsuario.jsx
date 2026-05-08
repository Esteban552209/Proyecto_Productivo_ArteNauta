import { useState, useEffect } from 'react';

import PerfilUsuario from './PerfilUsuario';

import PublicacionesCom from '../PublicacionesCom';

import HeaderPanel from './HeaderPanel';

import Conversaciones from './ModulosConversaciones/VistaChats';

import { supabase } from '../../lib/supabase';

function PanelUsuario({ setVista }) {

    const usuario = JSON.parse(localStorage.getItem('usuario'));

    const [seccion, setSeccion] = useState('inicio');

    const [publicaciones, setPublicaciones] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState(null);

    useEffect(() => {

        const obtenerPublicaciones = async () => {

            try {

                const { data, error } = await supabase
                    .from('publicaciones')
                    .select('*');

                if (error) throw error;

                console.log(data);

                setPublicaciones(data);

            } catch (err) {

                console.log(err.message);

                setError(err.message);

            }

            setLoading(false);
        };

        obtenerPublicaciones();

    }, []);

    return (

        <div className="min-h-screen bg-cyan-50 flex flex-col">

            <HeaderPanel
                seccion={seccion}
                setSeccion={setSeccion}
                setVista={setVista}
            />

            <main className="flex-1 p-4 max-w-7xl mx-auto w-full">

                {seccion === 'inicio' && (

                    <div>

                        <h1 className="text-2xl font-bold text-cyan-800 mb-2">
                            Bienvenido, {usuario?.nombre}
                        </h1>

                        <p className="text-gray-500 mb-8">
                            Explora y descubre arte en ArteNauta
                        </p>

                        <div className="bg-white rounded-2xl shadow p-6">

                            <h2 className="text-lg font-bold text-cyan-700 mb-4">
                                Obras destacadas
                            </h2>

                            {loading && (

                                <p className="text-center text-gray-400 py-10">
                                    Cargando publicaciones...
                                </p>

                            )}

                            {error && (

                                <p className="text-center text-red-400 py-10">
                                    Error: {error}
                                </p>

                            )}

                            {!loading &&
                                !error &&
                                publicaciones.length === 0 && (

                                    <p className="text-center text-gray-400 py-10">
                                        Aún no hay obras publicadas.
                                    </p>

                                )}

                            {!loading &&
                                !error &&
                                publicaciones.length > 0 && (

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

                                        {publicaciones.map((item) => (

                                            <PublicacionesCom
                                                key={item.id}
                                                item={item}
                                            />

                                        ))}

                                    </div>

                                )}

                        </div>

                    </div>

                )}

                {seccion === 'conversaciones' && (
                    <Conversaciones usuario={usuario} />
                )}

                {seccion === 'perfil' && (
                    <PerfilUsuario usuario={usuario} />
                )}

            </main>

        </div>
    );
}

export default PanelUsuario;
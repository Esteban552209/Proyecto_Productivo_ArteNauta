import Swal from 'sweetalert2';
import { supabase } from '../lib/supabase';

function SolicitarArtista({ usuario }) {
    const handleSolicitar = async () => {
        const confirm = await Swal.fire({
            title: '¿Solicitar ser artista?',
            text: 'Se enviará una solicitud al administrador para cambiar tu rol.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#0891b2',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, solicitar',
            cancelButtonText: 'Cancelar',
        });

        if (!confirm.isConfirmed) return;

        try {
            // Verificar si ya tiene solicitud pendiente
            const { data: existentes } = await supabase
                .from('solicitudes')
                .select('*')
                .eq('id_usuario', usuario?.id_usuario)
                .eq('estado_solicitud', 'pendiente');

            if (existentes && existentes.length > 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Ya tienes una solicitud pendiente',
                    text: 'El administrador aún no ha respondido.',
                    confirmButtonColor: '#0891b2',
                });
                return;
            }

            // Crear la solicitud
            await supabase
                .from('solicitudes')
                .insert({
                    id_usuario: usuario?.id_usuario,
                    fecha_solicitud: new Date().toISOString(),
                    tipo_solicitud: 'artista',
                    estado_solicitud: 'pendiente',
                });

            Swal.fire({
                icon: 'success',
                title: '¡Solicitud enviada!',
                text: 'El administrador revisará tu solicitud pronto.',
                confirmButtonColor: '#0891b2',
                timer: 2500,
                showConfirmButton: false,
            });
        } catch (error) {
            console.log(error);
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar la solicitud.', confirmButtonColor: '#0891b2' });
        }
    };

    if (usuario?.id_rol !== 1) return null; // 3 = usuario normal

    return (
        <button
            onClick={handleSolicitar}
            className="w-full mt-4 border-2 border-dashed border-cyan-300 hover:border-cyan-500 text-cyan-600 hover:text-cyan-700 py-3 rounded-xl font-semibold transition text-sm"
        >
            Solicitar ser Artista
        </button>
    );
}

export default SolicitarArtista;
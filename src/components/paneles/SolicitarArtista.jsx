import Swal from 'sweetalert2';

const API = 'http://localhost:3002';

// Componente botón para que un usuario solicite ser artista
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
            // Verificar si ya tiene una solicitud pendiente
            const res = await fetch(
                `${API}/notificaciones?id_remitente=${usuario.id}&tipo=solicitud_artista&estado=pendiente`
            );
            const existentes = await res.json();

            if (existentes.length > 0) {
                Swal.fire({
                    icon: 'info',
                    title: 'Ya tienes una solicitud pendiente',
                    text: 'El administrador aún no ha respondido.',
                    confirmButtonColor: '#0891b2',
                });
                return;
            }

            // Obtener el admin para enviarle la notificación
            const resAdmin = await fetch(`${API}/usuarios?rol=admin`);
            const admins = await resAdmin.json();
            const admin = admins[0];

            // Crear la notificación para el admin
            await fetch(`${API}/notificaciones`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipo: 'solicitud_artista',
                    mensaje: `El usuario ${usuario.nombre} ${usuario.apellido} solicita ser artista`,
                    id_remitente: usuario.id,
                    id_destinatario: admin?.id || '1',
                    rol_destinatario: 'admin',
                    estado: 'pendiente',
                    leida: false,
                    fecha: new Date().toISOString(),
                }),
            });

            Swal.fire({
                icon: 'success',
                title: '¡Solicitud enviada!',
                text: 'El administrador revisará tu solicitud pronto.',
                confirmButtonColor: '#0891b2',
                timer: 2500,
                showConfirmButton: false,
            });
        } catch {
            Swal.fire({ icon: 'error', title: 'Error', text: 'No se pudo enviar la solicitud.', confirmButtonColor: '#0891b2' });
        }
    };

    // Solo mostrar si el usuario NO es artista ni admin
    if (usuario?.rol !== 'usuario') return null;

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
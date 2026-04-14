import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';


// 1. Definimos la interfaz basada en tu Swagger
interface Reservation {
  id: string;
  roomId: string;
  roomType: string;
  startDate: string;
  endDate: string;
  status: 'activa' | 'completada' | 'cancelada';
  totalPrice: number;
}

const MyReservations: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { logout } = useAuth(); // Agregamos la función de cierre de sesión
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Simulamos la Consulta (GET)
  useEffect(() => {
    const fetchMyReservations = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); // Simulamos latencia
        
        // Datos Mockeados
        const mockData: Reservation[] = [
          { id: 'RES-001', roomId: '3', roomType: 'Suite', startDate: '2026-05-10', endDate: '2026-05-15', status: 'activa', totalPrice: 1000.00 },
          { id: 'RES-002', roomId: '1', roomType: 'Sencilla', startDate: '2026-04-01', endDate: '2026-04-03', status: 'completada', totalPrice: 100.00 },
        ];
        
        setReservations(mockData);
      } catch (error) {
        console.error("Error al cargar reservas", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyReservations();
  }, []);

  // 3. Simulamos la Cancelación (PATCH)
  const handleCancel = async (reservationId: string) => {
    // Confirmación nativa simple
    const confirm = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    if (!confirm) return;

    try {
      // En la vida real: await ReservationService.cancelReservation(reservationId);
      await new Promise((resolve) => setTimeout(resolve, 500)); 
      
      // Actualizamos el estado local para reflejar el cambio sin recargar la página
      setReservations(prevReservations => 
        prevReservations.map(res => 
          res.id === reservationId ? { ...res, status: 'cancelada' } : res
        )
      );
      
      alert('Reserva cancelada exitosamente.');
    } catch (error) {
      alert('Hubo un error al cancelar la reserva.');
    }
  };

  // Función auxiliar para los colores de las etiquetas de estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'activa': return { bg: '#eef2ff', text: '#003366' }; // Azul institucional
      case 'cancelada': return { bg: '#fee2e2', text: '#991b1b' }; // Rojo
      case 'completada': return { bg: '#dcfce7', text: '#166534' }; // Verde
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        {/* Barra de Navegación */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze in the Moon</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button 
            onClick={() => navigate('/habitaciones')}
            style={{ backgroundColor: '#FFD700', color: '#003366', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Ver Catálogo
          </button>
          <button 
            onClick={logout}
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #FFD700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>
      <main style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ color: '#003366', marginBottom: '10px' }}>Mis Reservas</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Consulta el historial y gestiona tus estadías actuales.</p>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#003366' }}>Cargando tus reservas...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reservations.map((res) => {
              const statusColors = getStatusColor(res.status);
              
              return (
                <div key={res.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  
                  {/* Detalles de la Reserva */}
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#003366' }}>
                      Habitación {res.roomType} <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>({res.id})</span>
                    </h3>
                    <p style={{ margin: '0 0 4px 0', color: '#444', fontSize: '14px' }}>
                      <strong>Fechas:</strong> {res.startDate} hasta {res.endDate}
                    </p>
                    <p style={{ margin: '0', color: '#444', fontSize: '14px' }}>
                      <strong>Total:</strong> ${res.totalPrice.toFixed(2)}
                    </p>
                  </div>

                  {/* Estado y Acciones */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {res.status}
                    </span>
                    
                    {/* Solo mostramos el botón de cancelar si la reserva está activa */}
                    {res.status === 'activa' && (
                      <button 
                        onClick={() => handleCancel(res.id)}
                        style={{ backgroundColor: 'transparent', color: '#991b1b', border: '1px solid #991b1b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        Cancelar Reserva
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
            
            {reservations.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666' }}>No tienes reservas en tu historial.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReservations;
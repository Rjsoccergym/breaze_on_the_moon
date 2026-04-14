import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Booking } from '../../api-client/models/Booking';
import { Room } from '../../api-client/models/Room';
import { BookingsService } from '../../api-client/services/BookingsService';
import { RoomsService } from '../../api-client/services/RoomsService';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as {
      body?: { message?: string; error?: string };
      message?: string;
    };

    return apiError.body?.message ?? apiError.body?.error ?? apiError.message ?? 'No fue posible cargar la información.';
  }

  return 'No fue posible cargar la información.';
};

const bookingStatusLabel: Record<Booking.estado, string> = {
  [Booking.estado.CREADA]: 'Creada',
  [Booking.estado.CONFIRMADA]: 'Confirmada',
  [Booking.estado.CANCELADA]: 'Cancelada',
};

const roomTypeLabel: Record<Room.tipo, string> = {
  [Room.tipo.SENCILLA]: 'Sencilla',
  [Room.tipo.DOBLE]: 'Doble',
  [Room.tipo.SUITE]: 'Suite',
};

const MyReservations: React.FC = () => {
  const navigate = useNavigate();
  const { logout, userId, displayName, role } = useAuth();
  const [reservations, setReservations] = useState<Booking[]>([]);
  const [roomsById, setRoomsById] = useState<Record<string, Room | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const loadReservations = async () => {
    if (!userId) {
      setReservations([]);
      setRoomsById({});
      setLoading(false);
      setError('No fue posible resolver el usuario autenticado desde el token actual.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await BookingsService.getApiV1BookingCliente(userId);
      const sortedReservations = [...data].sort((left, right) => {
        const rightDate = right.createdAt ?? right.fechaInicio ?? '';
        const leftDate = left.createdAt ?? left.fechaInicio ?? '';
        return rightDate.localeCompare(leftDate);
      });
      setReservations(sortedReservations);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadReservations();
  }, [userId]);

  useEffect(() => {
    const loadRooms = async () => {
      const roomIds = [...new Set(reservations.map((reservation) => reservation.habitacionId).filter(Boolean))] as string[];
      if (roomIds.length === 0) {
        setRoomsById({});
        return;
      }

      const entries = await Promise.all(roomIds.map(async (roomId) => {
        try {
          const room = await RoomsService.getApiV1Room1(roomId);
          return [roomId, room] as const;
        } catch {
          return [roomId, null] as const;
        }
      }));

      setRoomsById(Object.fromEntries(entries));
    };

    void loadRooms();
  }, [reservations]);

  const handleCancel = async (reservationId: string) => {
    const confirm = window.confirm('¿Estás seguro de que deseas cancelar esta reserva?');
    if (!confirm) return;

    setMessage('');
    setError('');
    setCancellingId(reservationId);

    try {
      await BookingsService.deleteApiV1Booking(reservationId);
      setMessage('Reserva cancelada correctamente.');
      await loadReservations();
    } catch (cancelError) {
      setError(getErrorMessage(cancelError));
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status?: Booking.estado) => {
    switch (status) {
      case Booking.estado.CREADA: return { bg: '#eef2ff', text: '#003366' };
      case Booking.estado.CANCELADA: return { bg: '#fee2e2', text: '#991b1b' };
      case Booking.estado.CONFIRMADA: return { bg: '#dcfce7', text: '#166534' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        {/* Barra de Navegación */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze in the Moon</h2>
          <p style={{ color: '#dbeafe', margin: '4px 0 0 0', fontSize: '13px' }}>
            {displayName ? `Reservas de ${displayName}` : 'Historial autenticado'}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          {role === 'ADMIN' && (
            <button
              onClick={() => navigate('/admin')}
              style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #FFD700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Panel Admin
            </button>
          )}
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

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {message && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px' }}>
            {message}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#003366' }}>Cargando tus reservas...</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reservations.map((res) => {
              const room = res.habitacionId ? roomsById[res.habitacionId] : null;
              const statusColors = getStatusColor(res.estado);
              const reservationId = res.id;
              
              return (
                <div key={res.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
                  
                  <div>
                    <h3 style={{ margin: '0 0 8px 0', color: '#003366' }}>
                      {room?.tipo ? `Habitación ${roomTypeLabel[room.tipo]}` : 'Reserva de habitación'}{' '}
                      <span style={{ fontSize: '14px', color: '#888', fontWeight: 'normal' }}>({res.id})</span>
                    </h3>
                    <p style={{ margin: '0 0 4px 0', color: '#444', fontSize: '14px' }}>
                      <strong>Habitación:</strong> {room?.numeroIdentificador ?? res.habitacionId}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#444', fontSize: '14px' }}>
                      <strong>Fechas:</strong> {res.fechaInicio} hasta {res.fechaFin}
                    </p>
                    <p style={{ margin: '0 0 4px 0', color: '#444', fontSize: '14px' }}>
                      <strong>Total:</strong> ${(res.precioTotal ?? 0).toFixed(2)}
                    </p>
                    <p style={{ margin: '0', color: '#64748b', fontSize: '13px' }}>
                      <strong>Creada:</strong> {res.createdAt ? new Date(res.createdAt).toLocaleString() : 'Sin marca temporal'}
                    </p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {res.estado ? bookingStatusLabel[res.estado] : 'Sin estado'}
                    </span>
                    
                    {res.estado !== Booking.estado.CANCELADA && reservationId && (
                      <button 
                        onClick={() => handleCancel(reservationId)}
                        disabled={cancellingId === reservationId}
                        style={{ backgroundColor: 'transparent', color: '#991b1b', border: '1px solid #991b1b', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                      >
                        {cancellingId === reservationId ? 'Cancelando...' : 'Cancelar Reserva'}
                      </button>
                    )}
                  </div>

                </div>
              );
            })}
            
            {reservations.length === 0 && (
              <p style={{ textAlign: 'center', color: '#666' }}>No tienes reservas registradas en la base de datos.</p>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyReservations;
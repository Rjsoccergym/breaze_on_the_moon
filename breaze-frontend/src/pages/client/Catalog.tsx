import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookingsService } from '../../api-client/services/BookingsService';
import { RoomsService } from '../../api-client/services/RoomsService';
import { Room } from '../../api-client/models/Room';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as {
      body?: { message?: string; error?: string };
      message?: string;
    };

    return apiError.body?.message ?? apiError.body?.error ?? apiError.message ?? 'No fue posible completar la operación.';
  }

  return 'No fue posible completar la operación.';
};

const roomTypeLabel: Record<Room.tipo, string> = {
  [Room.tipo.SENCILLA]: 'Sencilla',
  [Room.tipo.DOBLE]: 'Doble',
  [Room.tipo.SUITE]: 'Suite',
};

const roomStatusLabel: Record<Room.estado, string> = {
  [Room.estado.DISPONIBLE]: 'Disponible',
  [Room.estado.OCUPADA]: 'Ocupada',
  [Room.estado.MANTENIMIENTO]: 'Mantenimiento',
};

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const { logout, displayName, role } = useAuth();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ==========================================
  // ESTADOS PARA EL MODAL DE RESERVA
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadRooms = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await RoomsService.getApiV1Room();
      const sortedRooms = [...data].sort((left, right) => (left.numeroIdentificador ?? '').localeCompare(right.numeroIdentificador ?? ''));
      setRooms(sortedRooms);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadRooms();
  }, []);

  // ==========================================
  // FUNCIONES DEL MODAL
  // ==========================================
  const handleOpenModal = (room: Room) => {
    if (room.estado !== Room.estado.DISPONIBLE) {
      return;
    }

    setError('');
    setSuccess('');
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
    setCheckIn('');
    setCheckOut('');
  };

  const handleConfirmReservation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedRoom?.id) {
      setError('No fue posible identificar la habitación seleccionada.');
      return;
    }

    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError('Selecciona un rango de fechas válido para registrar la reserva.');
      return;
    }

    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const booking = await BookingsService.postApiV1Booking({
        habitacionId: selectedRoom.id,
        fechaInicio: checkIn,
        fechaFin: checkOut,
      });

      setSuccess(`Reserva ${booking.id ?? ''} creada correctamente con estado ${booking.estado ?? 'CREADA'}.`);
      handleCloseModal();
      await loadRooms();
      navigate('/mis-reservas');
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Barra de Navegación */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze in the Moon</h2>
          <p style={{ color: '#dbeafe', margin: '4px 0 0 0', fontSize: '13px' }}>
            {displayName ? `Sesión: ${displayName}` : 'Sesión autenticada'}
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
            onClick={() => navigate('/mis-reservas')}
            style={{ backgroundColor: '#FFD700', color: '#003366', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Mis Reservas
          </button>
          <button 
            onClick={logout}
            style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #FFD700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: '#003366', marginBottom: '10px' }}>Habitaciones Disponibles</h1>
        <p style={{ color: '#666', marginBottom: '30px' }}>Encuentra el espacio perfecto para tu próxima estadía.</p>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '12px 14px', borderRadius: '6px', marginBottom: '20px' }}>
            {success}
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: '#003366', fontSize: '18px' }}>Cargando catálogo...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {rooms.map((room) => (
              <div key={room.id} style={{ backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '160px', backgroundColor: '#e2e8f0', backgroundImage: 'url(https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ backgroundColor: '#eef2ff', color: '#003366', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                      {room.tipo ? roomTypeLabel[room.tipo] : 'Sin tipo'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                      👤 Máx: {room.capacidadMaxima ?? 0}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 10px 0', color: '#64748b', fontSize: '13px' }}>
                    Habitación {room.numeroIdentificador ?? 'sin número'} · {room.estado ? roomStatusLabel[room.estado] : 'Sin estado'}
                  </p>
                  <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px', flexGrow: 1 }}>{room.descripcion}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div style={{ color: '#003366', fontSize: '20px', fontWeight: 'bold' }}>
                      ${(room.precioNoche ?? 0).toFixed(2)} <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>/ noche</span>
                    </div>
                    <button 
                      disabled={room.estado !== Room.estado.DISPONIBLE}
                      onClick={() => handleOpenModal(room)}
                      style={{ backgroundColor: room.estado === Room.estado.DISPONIBLE ? '#FFD700' : '#cbd5e1', color: '#003366', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: room.estado === Room.estado.DISPONIBLE ? 'pointer' : 'not-allowed' }}
                    >
                      {room.estado === Room.estado.DISPONIBLE ? 'Reservar' : 'No disponible'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && rooms.length === 0 && !error && (
          <p style={{ textAlign: 'center', color: '#666' }}>No hay habitaciones visibles para el rol autenticado.</p>
        )}
      </main>

      {/* ========================================== */}
      {/* VENTANA EMERGENTE (MODAL) DE RESERVA         */}
      {/* ========================================== */}
      {isModalOpen && selectedRoom && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h2 style={{ color: '#003366', margin: '0 0 15px 0' }}>Confirmar Reserva</h2>
            <p style={{ color: '#444', marginBottom: '20px' }}>
              Estás a punto de registrar una reserva real para la habitación <strong>{selectedRoom.numeroIdentificador}</strong>
              {' '}({selectedRoom.tipo ? roomTypeLabel[selectedRoom.tipo] : 'Sin tipo'}) a ${(selectedRoom.precioNoche ?? 0).toFixed(2)} por noche.
            </p>
            
            <form onSubmit={handleConfirmReservation} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Fecha de Ingreso (Check-in)</label>
                <input 
                  type="date" 
                  required 
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Fecha de Salida (Check-out)</label>
                <input 
                  type="date" 
                  required 
                  value={checkOut}
                  min={checkIn} // Evita que salgan antes de entrar
                  onChange={(e) => setCheckOut(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ flex: 1, padding: '12px', backgroundColor: '#003366', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
                >
                  {isSubmitting ? 'Procesando...' : 'Confirmar'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
      
    </div>
  );
};

export default Catalog;
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Booking } from '../../api-client/models/Booking';
import { Room } from '../../api-client/models/Room';
import { RoomInput } from '../../api-client/models/RoomInput';
import { RoomStatusInput } from '../../api-client/models/RoomStatusInput';
import { BookingsService } from '../../api-client/services/BookingsService';
import { RoomsService } from '../../api-client/services/RoomsService';

const getErrorMessage = (error: unknown) => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as {
      body?: { message?: string; error?: string };
      message?: string;
    };

    return apiError.body?.message ?? apiError.body?.error ?? apiError.message ?? 'No fue posible completar la solicitud.';
  }

  return 'No fue posible completar la solicitud.';
};

const roomTypeLabel: Record<Room.tipo, string> = {
  [Room.tipo.SENCILLA]: 'Sencilla',
  [Room.tipo.DOBLE]: 'Doble',
  [Room.tipo.SUITE]: 'Suite',
};

const roomStatusLabel: Record<Room.estado, string> = {
  [Room.estado.DISPONIBLE]: 'Disponible',
  [Room.estado.RESERVADA]: 'Reservada',
  [Room.estado.OCUPADA]: 'Ocupada',
  [Room.estado.MANTENIMIENTO]: 'Mantenimiento',
};

const bookingStatusLabel: Record<Booking.estado, string> = {
  [Booking.estado.RESERVADA]: 'Reservada',
  [Booking.estado.CONFIRMADA]: 'Confirmada',
  [Booking.estado.CANCELADA]: 'Cancelada',
};

const DashboardRooms: React.FC = () => {
  const { logout, displayName } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [roomsByBookingId, setRoomsByBookingId] = useState<Record<string, Room | null>>({});
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [bookingFilter, setBookingFilter] = useState<Booking.estado>(Booking.estado.RESERVADA);
  const [updatingRoomId, setUpdatingRoomId] = useState<string | null>(null);
  const [bookingActionId, setBookingActionId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newRoomForm, setNewRoomForm] = useState<RoomInput>({
    numeroIdentificador: '',
    tipo: RoomInput.tipo.SENCILLA,
    descripcion: '',
    capacidadMaxima: 1,
    precioNoche: 50,
  });

  const loadRooms = async () => {
    setLoadingRooms(true);
    try {
      const data = await RoomsService.getApiV1Room();
      const sortedRooms = [...data].sort((left, right) => (left.numeroIdentificador ?? '').localeCompare(right.numeroIdentificador ?? ''));
      setRooms(sortedRooms);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoadingRooms(false);
    }
  };

  const loadBookings = async (status: Booking.estado) => {
    setLoadingBookings(true);
    try {
      const data = await BookingsService.getApiV1Booking(status);
      const sortedBookings = [...data].sort((left, right) => {
        const rightDate = right.createdAt ?? right.fechaInicio ?? '';
        const leftDate = left.createdAt ?? left.fechaInicio ?? '';
        return rightDate.localeCompare(leftDate);
      });
      setBookings(sortedBookings);
    } catch (fetchError) {
      setError(getErrorMessage(fetchError));
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    void loadRooms();
  }, []);

  useEffect(() => {
    void loadBookings(bookingFilter);
  }, [bookingFilter]);

  useEffect(() => {
    const loadBookingRooms = async () => {
      const roomIds = [...new Set(bookings.map((booking) => booking.habitacionId).filter(Boolean))] as string[];
      if (roomIds.length === 0) {
        setRoomsByBookingId({});
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

      setRoomsByBookingId(Object.fromEntries(entries));
    };

    void loadBookingRooms();
  }, [bookings]);

  const handleStatusChange = async (roomId: string, newStatus: RoomStatusInput.status) => {
    setError('');
    setMessage('');
    setUpdatingRoomId(roomId);

    try {
      await RoomsService.patchApiV1RoomStatus(roomId, { status: newStatus });
      setMessage('Estado de habitación actualizado correctamente.');
      await loadRooms();
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    } finally {
      setUpdatingRoomId(null);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewRoomForm({
      numeroIdentificador: '',
      tipo: RoomInput.tipo.SENCILLA,
      descripcion: '',
      capacidadMaxima: 1,
      precioNoche: 50,
    });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await RoomsService.postApiV1Room({
        numeroIdentificador: newRoomForm.numeroIdentificador.trim(),
        tipo: newRoomForm.tipo,
        descripcion: newRoomForm.descripcion.trim(),
        capacidadMaxima: newRoomForm.capacidadMaxima,
        precioNoche: newRoomForm.precioNoche,
      });
      setMessage('Habitación creada correctamente en la base de datos.');
      handleCloseModal();
      await loadRooms();
      
    } catch (createError) {
      setError(getErrorMessage(createError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    setError('');
    setMessage('');
    setBookingActionId(bookingId);

    try {
      await BookingsService.patchApiV1BookingConfirmar(bookingId);
      setMessage('Reserva confirmada correctamente.');
      await Promise.all([loadBookings(bookingFilter), loadRooms()]);
    } catch (confirmError) {
      setError(getErrorMessage(confirmError));
    } finally {
      setBookingActionId(null);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    const confirm = window.confirm('¿Deseas cancelar esta reserva desde el panel administrativo?');
    if (!confirm) {
      return;
    }

    setError('');
    setMessage('');
    setBookingActionId(bookingId);

    try {
      await BookingsService.deleteApiV1Booking(bookingId);
      setMessage('Reserva cancelada correctamente.');
      await Promise.all([loadBookings(bookingFilter), loadRooms()]);
    } catch (cancelError) {
      setError(getErrorMessage(cancelError));
    } finally {
      setBookingActionId(null);
    }
  };

  const getStatusColor = (status?: Room.estado) => {
    switch (status) {
      case Room.estado.DISPONIBLE: return { bg: '#dcfce7', text: '#166534' };
      case Room.estado.RESERVADA: return { bg: '#dbeafe', text: '#1d4ed8' };
      case Room.estado.OCUPADA: return { bg: '#fee2e2', text: '#991b1b' };
      case Room.estado.MANTENIMIENTO: return { bg: '#fef9c3', text: '#854d0e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const getBookingStatusColor = (status?: Booking.estado) => {
    switch (status) {
      case Booking.estado.RESERVADA: return { bg: '#eef2ff', text: '#003366' };
      case Booking.estado.CONFIRMADA: return { bg: '#dcfce7', text: '#166534' };
      case Booking.estado.CANCELADA: return { bg: '#fee2e2', text: '#991b1b' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  const roomCounts = {
    total: rooms.length,
    disponibles: rooms.filter((room) => room.estado === Room.estado.DISPONIBLE).length,
    reservadas: rooms.filter((room) => room.estado === Room.estado.RESERVADA).length,
    ocupadas: rooms.filter((room) => room.estado === Room.estado.OCUPADA).length,
    mantenimiento: rooms.filter((room) => room.estado === Room.estado.MANTENIMIENTO).length,
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Navegación Admin */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div>
            <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze Admin</h2>
            <p style={{ color: '#dbeafe', margin: '4px 0 0 0', fontSize: '13px' }}>
              {displayName ? `Administrador: ${displayName}` : 'Panel autenticado'}
            </p>
          </div>
          <span style={{ backgroundColor: '#FFD700', color: '#003366', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>PANEL DE CONTROL</span>
        </div>
        <button onClick={logout} style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #FFD700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Total habitaciones</p>
            <h3 style={{ margin: '10px 0 0 0', color: '#003366', fontSize: '28px' }}>{roomCounts.total}</h3>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Disponibles</p>
            <h3 style={{ margin: '10px 0 0 0', color: '#166534', fontSize: '28px' }}>{roomCounts.disponibles}</h3>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Reservadas</p>
            <h3 style={{ margin: '10px 0 0 0', color: '#1d4ed8', fontSize: '28px' }}>{roomCounts.reservadas}</h3>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>Ocupadas</p>
            <h3 style={{ margin: '10px 0 0 0', color: '#991b1b', fontSize: '28px' }}>{roomCounts.ocupadas}</h3>
          </div>
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', padding: '18px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '13px' }}>En mantenimiento</p>
            <h3 style={{ margin: '10px 0 0 0', color: '#854d0e', fontSize: '28px' }}>{roomCounts.mantenimiento}</h3>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <div>
            <h1 style={{ color: '#003366', margin: '0 0 10px 0' }}>Inventario de Habitaciones</h1>
            <p style={{ color: '#666', margin: 0 }}>Gestiona la disponibilidad y datos de todas las habitaciones.</p>
          </div>
          {/* Botón que abre el Modal */}
          <button 
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#003366', color: '#FFD700', border: 'none', padding: '12px 24px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Nueva Habitación
          </button>
        </div>

        {loadingRooms ? (
          <p style={{ textAlign: 'center', color: '#003366' }}>Cargando inventario...</p>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#eef2ff', color: '#003366' }}>
                <tr>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Número</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Tipo</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Descripción</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Capacidad</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Precio/Noche</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Estado</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Acción Rápida</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const statusColors = getStatusColor(room.estado);
                  return (
                    <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px', color: '#444', fontWeight: 'bold' }}>{room.numeroIdentificador}</td>
                      <td style={{ padding: '16px', color: '#003366', fontWeight: 'bold' }}>{room.tipo ? roomTypeLabel[room.tipo] : 'Sin tipo'}</td>
                      <td style={{ padding: '16px', color: '#444' }}>{room.descripcion}</td>
                      <td style={{ padding: '16px', color: '#444' }}>👤 {room.capacidadMaxima}</td>
                      <td style={{ padding: '16px', color: '#444' }}>${(room.precioNoche ?? 0).toFixed(2)}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {room.estado ? roomStatusLabel[room.estado] : 'Sin estado'}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select 
                          disabled={!room.id || updatingRoomId === room.id}
                          value={room.estado}
                          onChange={(e) => room.id && handleStatusChange(room.id, e.target.value as RoomStatusInput.status)}
                          style={{ 
                            padding: '8px', 
                            borderRadius: '4px', 
                            border: '1px solid #ccc', 
                            backgroundColor: '#f9fafb', 
                            cursor: 'pointer',
                            color: '#003366', // <-- Color de texto aplicado
                            fontWeight: 'bold' // <-- Negrita para mayor legibilidad
                          }}
                        >
                          <option value={RoomStatusInput.status.DISPONIBLE}>Marcar Disponible</option>
                          <option value={RoomStatusInput.status.RESERVADA}>Marcar Reservada</option>
                          <option value={RoomStatusInput.status.OCUPADA}>Marcar Ocupada</option>
                          <option value={RoomStatusInput.status.MANTENIMIENTO}>A Mantenimiento</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <section style={{ marginTop: '36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '16px', flexWrap: 'wrap' }}>
            <div>
              <h2 style={{ color: '#003366', margin: '0 0 8px 0' }}>Gestión de Reservas</h2>
              <p style={{ color: '#666', margin: 0 }}>Consulta reservas reales por estado y ejecuta acciones administrativas.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[Booking.estado.RESERVADA, Booking.estado.CONFIRMADA, Booking.estado.CANCELADA].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setBookingFilter(status)}
                  style={{
                    backgroundColor: bookingFilter === status ? '#003366' : '#fff',
                    color: bookingFilter === status ? '#FFD700' : '#003366',
                    border: '1px solid #003366',
                    padding: '10px 14px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  {bookingStatusLabel[status]}
                </button>
              ))}
            </div>
          </div>

          {loadingBookings ? (
            <p style={{ textAlign: 'center', color: '#003366' }}>Cargando reservas...</p>
          ) : (
            <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ backgroundColor: '#eef2ff', color: '#003366' }}>
                  <tr>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Reserva</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Cliente</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Habitación</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Fechas</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Total</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Estado</th>
                    <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const room = booking.habitacionId ? roomsByBookingId[booking.habitacionId] : null;
                    const statusColors = getBookingStatusColor(booking.estado);
                    const bookingId = booking.id;
                    return (
                      <tr key={booking.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '16px', color: '#444', fontWeight: 'bold' }}>{booking.id}</td>
                        <td style={{ padding: '16px', color: '#444' }}>{booking.clienteId}</td>
                        <td style={{ padding: '16px', color: '#444' }}>
                          <div>{room?.numeroIdentificador ?? booking.habitacionId}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{room?.tipo ? roomTypeLabel[room.tipo] : 'Detalle no disponible'}</div>
                        </td>
                        <td style={{ padding: '16px', color: '#444' }}>{booking.fechaInicio} al {booking.fechaFin}</td>
                        <td style={{ padding: '16px', color: '#444' }}>${(booking.precioTotal ?? 0).toFixed(2)}</td>
                        <td style={{ padding: '16px' }}>
                          <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {booking.estado ? bookingStatusLabel[booking.estado] : 'Sin estado'}
                          </span>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            {booking.estado === Booking.estado.RESERVADA && bookingId && (
                              <button
                                type="button"
                                disabled={bookingActionId === bookingId}
                                onClick={() => handleConfirmBooking(bookingId)}
                                style={{ backgroundColor: '#003366', color: '#FFD700', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                {bookingActionId === bookingId ? 'Procesando...' : 'Confirmar'}
                              </button>
                            )}
                            {booking.estado !== Booking.estado.CANCELADA && bookingId && (
                              <button
                                type="button"
                                disabled={bookingActionId === bookingId}
                                onClick={() => handleCancelBooking(bookingId)}
                                style={{ backgroundColor: 'transparent', color: '#991b1b', border: '1px solid #991b1b', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                              >
                                {bookingActionId === bookingId ? 'Procesando...' : 'Cancelar'}
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <p style={{ textAlign: 'center', color: '#666', padding: '18px' }}>No hay reservas con el estado seleccionado.</p>
              )}
            </div>
          )}
        </section>
      </main>

      {/* ========================================== */}
      {/* MODAL DE CREACIÓN DE HABITACIÓN            */}
      {/* ========================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h2 style={{ color: '#003366', margin: '0 0 5px 0' }}>Registrar Nueva Habitación</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>Completa los datos reales de la habitación. Inicialmente nacerá como "Disponible".</p>
            
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Número identificador</label>
                <input
                  type="text"
                  required
                  value={newRoomForm.numeroIdentificador}
                  onChange={(e) => setNewRoomForm({ ...newRoomForm, numeroIdentificador: e.target.value })}
                  placeholder="Ej: HAB-201"
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Tipo de Habitación</label>
                  <select 
                    value={newRoomForm.tipo}
                    onChange={(e) => setNewRoomForm({...newRoomForm, tipo: e.target.value as RoomInput.tipo})}
                    style={{ 
                      width: '100%', 
                      padding: '10px', 
                      borderRadius: '4px', 
                      border: '1px solid #ccc', 
                      backgroundColor: '#fff',
                      color: '#003366', // <-- Color de texto aplicado
                      fontWeight: 'bold' // <-- Negrita para mayor legibilidad
                    }}
                  >
                    <option value={RoomInput.tipo.SENCILLA}>Sencilla</option>
                    <option value={RoomInput.tipo.DOBLE}>Doble</option>
                    <option value={RoomInput.tipo.SUITE}>Suite</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Capacidad (Personas)</label>
                  <input 
                    type="number" min="1" max="10" required
                    value={newRoomForm.capacidadMaxima}
                    onChange={(e) => setNewRoomForm({...newRoomForm, capacidadMaxima: parseInt(e.target.value, 10)})}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Precio por Noche (USD)</label>
                <input 
                  type="number" step="0.01" min="0" required
                  value={newRoomForm.precioNoche}
                  onChange={(e) => setNewRoomForm({...newRoomForm, precioNoche: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Descripción Breve</label>
                <textarea 
                  required maxLength={150} rows={3}
                  value={newRoomForm.descripcion}
                  onChange={(e) => setNewRoomForm({...newRoomForm, descripcion: e.target.value})}
                  placeholder="Ej: Amplia habitación con vista al mar..."
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', resize: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={handleCloseModal} style={{ flex: 1, padding: '12px', backgroundColor: '#e2e8f0', color: '#333', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                  Cancelar
                </button>
                <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '12px', backgroundColor: '#003366', color: '#FFD700', border: 'none', borderRadius: '4px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                  {isSubmitting ? 'Guardando...' : 'Crear Habitación'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default DashboardRooms;
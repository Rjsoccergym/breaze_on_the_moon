import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Room } from '../../api-client/models/Room';

const Catalog: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ESTADOS PARA EL MODAL DE RESERVA
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800)); 
        const mockData: Room[] = [
          { id: '1', tipo: Room.tipo.SENCILLA, descripcion: 'Acogedora habitación con vista al jardín.', capacidadMax: 1, precionoche: 50.00, estado: Room.estado.DISPONIBLE },
          { id: '2', tipo: Room.tipo.DOBLE, descripcion: 'Amplia habitación ideal para parejas, con balcón privado.', capacidadMax: 2, precionoche: 85.50, estado: Room.estado.DISPONIBLE },
          { id: '3', tipo: Room.tipo.SUITE, descripcion: 'Lujosa suite con sala de estar, jacuzzi y vista panorámica.', capacidadMax: 4, precionoche: 200.00, estado: Room.estado.DISPONIBLE },
          { id: '4', tipo: Room.tipo.DOBLE, descripcion: 'Habitación doble estándar cerca de la piscina principal.', capacidadMax: 2, precionoche: 75.00, estado: Room.estado.DISPONIBLE },
        ];
        setRooms(mockData);
      } catch (error) {
        console.error("Error al cargar habitaciones", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  // ==========================================
  // FUNCIONES DEL MODAL
  // ==========================================
  const handleOpenModal = (room: Room) => {
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
    setIsSubmitting(true);

    try {
      // Aquí enviarías el POST a tu API: await ReservationService.create({ roomId: selectedRoom.id, checkIn, checkOut })
      await new Promise((resolve) => setTimeout(resolve, 1200)); // Simulamos guardado
      
      alert(`¡Reserva confirmada con éxito para la habitación ${selectedRoom?.tipo}!`);
      handleCloseModal();
      navigate('/mis-reservas'); // Redirigimos al usuario para que vea su nueva reserva
      
    } catch (error) {
      alert('Hubo un error al procesar tu reserva.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Barra de Navegación */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze in the Moon</h2>
        <div style={{ display: 'flex', gap: '15px' }}>
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
                      {room.tipo}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', fontSize: '14px', color: '#666' }}>
                      👤 Máx: {room.capacidadMax}
                    </span>
                  </div>
                  <p style={{ color: '#444', fontSize: '14px', lineHeight: '1.5', marginBottom: '20px', flexGrow: 1 }}>{room.descripcion}</p>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #eee', paddingTop: '15px' }}>
                    <div style={{ color: '#003366', fontSize: '20px', fontWeight: 'bold' }}>
                      ${room.precionoche?.toFixed(2)} <span style={{ fontSize: '12px', color: '#888', fontWeight: 'normal' }}>/ noche</span>
                    </div>
                    {/* Botón modificado para abrir el Modal */}
                    <button 
                      onClick={() => handleOpenModal(room)}
                      style={{ backgroundColor: '#FFD700', color: '#003366', border: 'none', padding: '10px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* VENTANA EMERGENTE (MODAL) DE RESERVA         */}
      {/* ========================================== */}
      {isModalOpen && selectedRoom && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h2 style={{ color: '#003366', margin: '0 0 15px 0' }}>Confirmar Reserva</h2>
            <p style={{ color: '#444', marginBottom: '20px' }}>Estás a punto de reservar la <strong>Habitación {selectedRoom.tipo}</strong> a ${selectedRoom.precionoche} por noche.</p>
            
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
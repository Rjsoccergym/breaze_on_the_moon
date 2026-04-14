import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

interface Room {
  id: string;
  type: 'sencilla' | 'doble' | 'suite';
  description: string;
  maxCapacity: number;
  pricePerNight: number;
  status: 'disponible' | 'ocupada' | 'mantenimiento';
}

const DashboardRooms: React.FC = () => {
  const { logout } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // ESTADOS PARA EL MODAL DE CREACIÓN
  // ==========================================
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estado para capturar los datos del formulario
  const [newRoomForm, setNewRoomForm] = useState({
    type: 'sencilla' as Room['type'],
    description: '',
    maxCapacity: 1,
    pricePerNight: 50.00
  });

  // 1. Carga inicial del inventario
  useEffect(() => {
    const fetchAllRooms = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const mockData: Room[] = [
          { id: '1', type: 'sencilla', description: 'Vista al jardín.', maxCapacity: 1, pricePerNight: 50.00, status: 'disponible' },
          { id: '2', type: 'doble', description: 'Balcón privado.', maxCapacity: 2, pricePerNight: 85.50, status: 'ocupada' },
          { id: '3', type: 'suite', description: 'Jacuzzi incluido.', maxCapacity: 4, pricePerNight: 200.00, status: 'disponible' },
          { id: '4', type: 'doble', description: 'Cerca a piscina.', maxCapacity: 2, pricePerNight: 75.00, status: 'mantenimiento' },
          { id: '5', type: 'sencilla', description: 'Primer piso.', maxCapacity: 1, pricePerNight: 45.00, status: 'disponible' },
        ];
        setRooms(mockData);
      } catch (error) {
        console.error("Error al cargar inventario", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllRooms();
  }, []);

  // 2. Cambio de estado rápido (PATCH)
  const handleStatusChange = async (roomId: string, newStatus: Room['status']) => {
    try {
      setRooms(prevRooms => prevRooms.map(room => room.id === roomId ? { ...room, status: newStatus } : room));
    } catch (error) {
      alert("Error al actualizar el estado");
    }
  };

  // ==========================================
  // LÓGICA DE CREACIÓN (POST)
  // ==========================================
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Limpiamos el formulario al cerrar
    setNewRoomForm({ type: 'sencilla', description: '', maxCapacity: 1, pricePerNight: 50.00 });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Aquí enviarías el POST a tu API: await RoomService.create(newRoomForm)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulamos guardado

      // Creamos una habitación simulada para añadirla a la tabla
      const newRoom: Room = {
        id: Math.floor(Math.random() * 1000).toString(), // Generamos ID aleatorio temporal
        ...newRoomForm,
        status: 'disponible' // Toda habitación nueva nace disponible
      };

      setRooms(prevRooms => [...prevRooms, newRoom]); // Añadimos la nueva a la lista actual
      alert('¡Habitación creada exitosamente!');
      handleCloseModal();
      
    } catch (error) {
      alert('Hubo un error al crear la habitación.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Función para colores de etiquetas
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponible': return { bg: '#dcfce7', text: '#166534' };
      case 'ocupada': return { bg: '#fee2e2', text: '#991b1b' };
      case 'mantenimiento': return { bg: '#fef9c3', text: '#854d0e' };
      default: return { bg: '#f3f4f6', text: '#374151' };
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Navegación Admin */}
      <nav style={{ backgroundColor: '#003366', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2 style={{ color: '#FFD700', margin: 0 }}>Breaze Admin</h2>
          <span style={{ backgroundColor: '#FFD700', color: '#003366', fontSize: '12px', padding: '4px 8px', borderRadius: '4px', fontWeight: 'bold' }}>PANEL DE CONTROL</span>
        </div>
        <button onClick={logout} style={{ backgroundColor: 'transparent', color: '#fff', border: '1px solid #FFD700', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>
          Cerrar Sesión
        </button>
      </nav>

      <main style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
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

        {loading ? (
          <p style={{ textAlign: 'center', color: '#003366' }}>Cargando inventario...</p>
        ) : (
          <div style={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ backgroundColor: '#eef2ff', color: '#003366' }}>
                <tr>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Tipo</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Capacidad</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Precio/Noche</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Estado</th>
                  <th style={{ padding: '16px', fontWeight: 'bold', borderBottom: '2px solid #ddd' }}>Acción Rápida</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => {
                  const statusColors = getStatusColor(room.status);
                  return (
                    <tr key={room.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '16px', color: '#444' }}>{room.id}</td>
                      <td style={{ padding: '16px', textTransform: 'capitalize', color: '#003366', fontWeight: 'bold' }}>{room.type}</td>
                      <td style={{ padding: '16px', color: '#444' }}>👤 {room.maxCapacity}</td>
                      <td style={{ padding: '16px', color: '#444' }}>${room.pricePerNight.toFixed(2)}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ backgroundColor: statusColors.bg, color: statusColors.text, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {room.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <select 
                          value={room.status}
                          onChange={(e) => handleStatusChange(room.id, e.target.value as Room['status'])}
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
                          <option value="disponible">Marcar Disponible</option>
                          <option value="ocupada">Marcar Ocupada</option>
                          <option value="mantenimiento">A Mantenimiento</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* ========================================== */}
      {/* MODAL DE CREACIÓN DE HABITACIÓN            */}
      {/* ========================================== */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', width: '100%', maxWidth: '500px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            
            <h2 style={{ color: '#003366', margin: '0 0 5px 0' }}>Registrar Nueva Habitación</h2>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>Completa los datos para añadirla al inventario. Inicialmente nacerá como "Disponible".</p>
            
            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Tipo de Habitación</label>
                  <select 
                    value={newRoomForm.type}
                    onChange={(e) => setNewRoomForm({...newRoomForm, type: e.target.value as Room['type']})}
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
                    <option value="sencilla">Sencilla</option>
                    <option value="doble">Doble</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Capacidad (Personas)</label>
                  <input 
                    type="number" min="1" max="10" required
                    value={newRoomForm.maxCapacity}
                    onChange={(e) => setNewRoomForm({...newRoomForm, maxCapacity: parseInt(e.target.value)})}
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Precio por Noche (USD)</label>
                <input 
                  type="number" step="0.01" min="0" required
                  value={newRoomForm.pricePerNight}
                  onChange={(e) => setNewRoomForm({...newRoomForm, pricePerNight: parseFloat(e.target.value)})}
                  style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', color: '#003366', fontWeight: 'bold', fontSize: '14px' }}>Descripción Breve</label>
                <textarea 
                  required maxLength={150} rows={3}
                  value={newRoomForm.description}
                  onChange={(e) => setNewRoomForm({...newRoomForm, description: e.target.value})}
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
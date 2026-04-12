import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/public/Login';
import Catalog from './pages/client/Catalog';
import MyReservations from './pages/client/MyReservations';
import DashboardRooms from './pages/admin/DashboardRooms';

// ==========================================
// 1. COMPONENTES GUARDS (Los guardias de seguridad)
// ==========================================

// Guard para rutas de Clientes (Solo verifica que haya token)
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />; // Lo echa al login
  }
  return <>{children}</>;
};

// Guard para rutas de Admin (Verifica token Y rol ADMIN)
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (role !== 'ADMIN') {
    return <Navigate to="/habitaciones" replace />; // Si es cliente, lo manda al catálogo
  }
  return <>{children}</>;
};


// ==========================================
// 2. COMPONENTES DE PRUEBA (Los reemplazaremos luego)
// ==========================================

const PantallaCatalogo = () => <h2>Catálogo de Habitaciones (Solo Clientes y Admins)</h2>;



// ==========================================
// 3. EL ENRUTADOR PRINCIPAL
// ==========================================
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        
        {/* Rutas Protegidas (Cualquier usuario logueado) */}

        <Route
          path="/habitaciones"
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } 
        />

        {/* Rutas Protegidas (Cualquier usuario logueado) */}
        <Route 
          path="/habitaciones" 
          element={
            <ProtectedRoute>
              <Catalog />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/mis-reservas" 
          element={
            <ProtectedRoute>
              <MyReservations />
            </ProtectedRoute>
          } 
        />
      

        {/* Rutas Administrativas (Solo rol ADMIN) */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <DashboardRooms />
            </AdminRoute>
          } 
        />

        {/* Ruta por defecto (Si entra a la raíz, lo mandamos a login) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
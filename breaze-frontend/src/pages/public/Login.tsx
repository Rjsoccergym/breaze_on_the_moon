import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
// Si tu backend ya está listo y usas el cliente autogenerado, lo importarías aquí:
// import { AuthService } from '../../api-client'; 

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // Función auxiliar para fabricar un token válido en Base64
  const createMockToken = (email: string, userRole: string) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ 
      sub: email, 
      role: userRole, 
      exp: Math.floor(Date.now() / 1000) + 3600 // Expira en 1 hora
    }));
    return `${header}.${payload}.FirmaFalsa123`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const cleanEmail = email.trim().toLowerCase();
      const cleanPassword = password.trim();

      if (cleanEmail === 'admin@breaze.com' && cleanPassword === '123') {
        // Fabricamos el token de ADMIN al vuelo
        const mockAdminToken = createMockToken(cleanEmail, 'ADMIN');
        login(mockAdminToken);
        navigate('/admin');
        
      } else if (cleanEmail === 'cliente@breaze.com' && cleanPassword === '123') {
        // Fabricamos el token de CLIENT al vuelo
        const mockClientToken = createMockToken(cleanEmail, 'CLIENT');
        login(mockClientToken);
        navigate('/habitaciones');
        
      } else {
        throw new Error('Credenciales inválidas');
      }

    } catch (err) {
      console.error("🚨 ERROR REAL CAPTURADO:", err); 
      setError('Correo o contraseña incorrectos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#f4f7f6', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#003366', margin: '0 0 10px 0', lineHeight: '1.3' }}>
            Breaze in the <br /> 
            <span style={{ color: '#FFD700' }}>Moon</span></h1>
          <p style={{ color: '#666', margin: '0' }}>Sistema de Gestión Hotelera</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '20px', fontSize: '14px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#003366', fontWeight: 'bold' }}>Correo Electrónico</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#003366', fontWeight: 'bold' }}>Contraseña</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box' }}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            style={{ 
              backgroundColor: '#003366', 
              color: '#FFD700', 
              padding: '14px', 
              border: 'none', 
              borderRadius: '4px', 
              fontSize: '16px', 
              fontWeight: 'bold', 
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px'
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;
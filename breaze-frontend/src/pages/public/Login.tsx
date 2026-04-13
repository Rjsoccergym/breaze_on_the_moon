import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiClient from '../../apiClient';

type View = 'login' | 'register';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
  fontSize: '14px',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '6px',
  color: '#003366',
  fontWeight: 'bold',
  fontSize: '14px',
};

const Login: React.FC = () => {
  const [view, setView] = useState<View>('login');

  // --- Login state ---
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // --- Register state ---
  const [regNombre, setRegNombre] = useState('');
  const [regApellido, setRegApellido] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const switchView = (target: View) => {
    setError('');
    setSuccess('');
    setView(target);
  };

  // ==================== LOGIN ====================
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/v1/auth/login', {
        username: loginEmail.trim(),
        password: loginPassword.trim(),
      });
      login(data.token);
      navigate(data.rol === 'ADMIN' ? '/admin' : '/habitaciones');
    } catch (err: any) {
      console.error('[Login Error]', err);
      if (!err.response) {
        setError(`Sin conexión al servidor: ${err.message}`);
      } else {
        const data = err.response.data;
        const msg =
          data?.message ||
          data?.error ||
          (typeof data === 'string' ? data : null) ||
          `Error ${err.response.status}: ${err.response.statusText}`;
        setError(msg || 'Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  // ==================== REGISTER ====================
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (regPassword !== regConfirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    if (regPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    try {
      await apiClient.post('/v1/auth/register', {
        nombre: regNombre.trim(),
        apellido: regApellido.trim(),
        username: regUsername.trim(),
        email: regEmail.trim(),
        password: regPassword,
      });
      setSuccess('¡Cuenta creada! Ya puedes iniciar sesión.');
      setRegNombre(''); setRegApellido(''); setRegUsername('');
      setRegEmail(''); setRegPassword(''); setRegConfirm('');
      setTimeout(() => switchView('login'), 1800);
    } catch (err: any) {
      if (!err.response) {
        // Sin respuesta: red caída, CORS o backend apagado
        setError(`Sin conexión al servidor: ${err.message}`);
      } else {
        // Hay respuesta HTTP — extraemos el detalle
        const data = err.response.data;
        const msg =
          data?.message ||
          data?.error ||
          (typeof data === 'string' ? data : null) ||
          `Error ${err.response.status}: ${err.response.statusText}`;
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f7f6', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h1 style={{ color: '#003366', margin: '0 0 6px 0', lineHeight: '1.3' }}>
            Breaze in the <br />
            <span style={{ color: '#FFD700' }}>Moon</span>
          </h1>
          <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>Sistema de Gestión Hotelera</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', marginBottom: '24px' }}>
          {(['login', 'register'] as View[]).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => switchView(tab)}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                color: view === tab ? '#003366' : '#9ca3af',
                borderBottom: view === tab ? '2px solid #003366' : '2px solid transparent',
                marginBottom: '-2px',
                transition: 'color 0.2s',
              }}
            >
              {tab === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
            </button>
          ))}
        </div>

        {/* Mensajes */}
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#991b1b', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '10px', borderRadius: '4px', marginBottom: '16px', fontSize: '13px', textAlign: 'center' }}>
            {success}
          </div>
        )}

        {/* ===== FORMULARIO LOGIN ===== */}
        {view === 'login' && (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={labelStyle}>Usuario o Correo</label>
              <input
                type="text"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                placeholder="usuario o correo@ejemplo.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                style={inputStyle}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#003366', color: '#FFD700', padding: '14px', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </button>
          </form>
        )}

        {/* ===== FORMULARIO REGISTRO ===== */}
        {view === 'register' && (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Nombre</label>
                <input type="text" value={regNombre} onChange={(e) => setRegNombre(e.target.value)} required placeholder="Juan" style={inputStyle} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Apellido</label>
                <input type="text" value={regApellido} onChange={(e) => setRegApellido(e.target.value)} required placeholder="Pérez" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Nombre de usuario</label>
              <input type="text" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required placeholder="juanperez123" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Correo electrónico</label>
              <input type="email" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required placeholder="correo@ejemplo.com" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Contraseña <span style={{ color: '#9ca3af', fontWeight: 'normal' }}>(mín. 8 caracteres)</span></label>
              <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required minLength={8} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input type="password" value={regConfirm} onChange={(e) => setRegConfirm(e.target.value)} required minLength={8} style={inputStyle} />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: '#003366', color: '#FFD700', padding: '14px', border: 'none', borderRadius: '4px', fontSize: '15px', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px' }}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default Login;
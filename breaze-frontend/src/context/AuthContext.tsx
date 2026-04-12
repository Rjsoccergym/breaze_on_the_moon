import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Definimos la estructura de lo que viene dentro del Token (Payload)
// Esto debe coincidir con lo que el backend de Autenticación guarde en el token.
interface DecodedToken {
  sub: string; // Usualmente el ID o correo del usuario
  role: 'ADMIN' | 'CLIENT'; // Los roles estrictos que definimos en el Swagger
  exp: number; // Fecha de expiración
}

// 2. Definimos la estructura de nuestro Estado Global
interface AuthContextType {
  token: string | null;
  role: 'ADMIN' | 'CLIENT' | null;
  isAuthenticated: boolean;
  login: (newToken: string) => void;
  logout: () => void;
}

// 3. Creamos el Contexto (inicia vacío)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Creamos el Componente Proveedor que envolverá la aplicación
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'CLIENT' | null>(null);

  // Efecto inicial: Buscar si ya hay un token guardado al recargar la página
  useEffect(() => {
    const storedToken = localStorage.getItem('breaze_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        // Validar si el token ya expiró (exp está en segundos, Date.now() en ms)
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          setToken(storedToken);
          setRole(decoded.role);
        }
      } catch (error) {
        // Si el token es inválido o está corrupto, lo limpiamos por seguridad
        logout();
      }
    }
  }, []);

  // Función para iniciar sesión (se llamará desde la pantalla Login.tsx)
  const login = (newToken: string) => {
    localStorage.setItem('breaze_token', newToken);
    const decoded = jwtDecode<DecodedToken>(newToken);
    setToken(newToken);
    setRole(decoded.role);
  };

  // Función para cerrar sesión o cuando el token expira
  const logout = () => {
    localStorage.removeItem('breaze_token');
    setToken(null);
    setRole(null);
  };

  // Valores y funciones expuestos al resto de la aplicación
  const value = {
    token,
    role,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 5. Custom Hook para consumir el contexto fácilmente y sin errores
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};
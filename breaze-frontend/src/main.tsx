import React from 'react'
import ReactDOM from 'react-dom/client' // <-- El error suele estar aquí. Debe decir '/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.tsx' // <-- Asegúrate de que la ruta sea correcta


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)
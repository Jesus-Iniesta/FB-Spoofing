import { useState } from 'react'
import LoginForm from './LoginForm'
import Footer from './Footer'
import './Login.css'

const Login = () => {
  const [message, setMessage] = useState('')

  const handleLogin = async (credentials) => {
    try {
      // Aquí harías la petición al backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error('Credenciales inválidas')
      }

      const data = await response.json()
      setMessage('¡Inicio de sesión exitoso!')
      
      // Aquí podrías guardar el token y redirigir al usuario
      console.log('Login exitoso:', data)
      
    } catch (error) {
      throw new Error(error.message || 'Error al iniciar sesión')
    }
  }

  const handleForgotPassword = () => {
    setMessage('Función de recuperación de contraseña')
    console.log('Forgot password clicked')
  }

  const handleSignup = () => {
    setMessage('Función de registro de usuario')
    console.log('Signup clicked')
  }

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-wrapper">
          <div className="login-left">
            <div className="fb-logo-text">facebook</div>
            <p className="fb-tagline">
              Facebook te ayuda a comunicarte y compartir con las personas que forman parte de tu vida.
            </p>
          </div>

          <div className="login-card">
            <LoginForm
              onSubmit={handleLogin}
              onForgotPassword={handleForgotPassword}
              onSignup={handleSignup}
            />

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

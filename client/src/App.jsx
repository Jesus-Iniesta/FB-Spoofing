import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setMessage(data.message)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error:', err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <h1>🚀 Vite + React + Express</h1>
        <p>
          {loading ? 'Cargando...' : message}
        </p>
        <div className="card">
          <p>
            Edita <code>src/App.jsx</code> y guarda para ver los cambios
          </p>
        </div>
      </header>
    </div>
  )
}

export default App

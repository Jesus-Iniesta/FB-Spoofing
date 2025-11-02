import Login from './components/Login'
import Maintenance from './components/Maintenance'
import './App.css'

function App() {
  // Obtener la ruta actual (simulación simple de router)
  const path = window.location.pathname

  return (
    <div className="App">
      {path === '/maintenance' ? <Maintenance /> : <Login />}
    </div>
  )
}

export default App

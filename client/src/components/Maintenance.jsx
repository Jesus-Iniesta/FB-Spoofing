import './Maintenance.css'

const Maintenance = () => {
  return (
    <div className="maintenance-container">
      <div className="maintenance-content">
        <div className="maintenance-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        
        <h1 className="maintenance-title">Estamos trabajando en esto</h1>
        
        <p className="maintenance-description">
          Nuestro equipo está mejorando esta funcionalidad para ofrecerte la mejor experiencia.
          Volveremos pronto con novedades increíbles.
        </p>
        
        <div className="maintenance-features">
          <div className="feature-item">
            <span className="feature-icon">⚙️</span>
            <span>Optimizando el sistema</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span>Mejorando la seguridad</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Añadiendo nuevas funciones</span>
          </div>
        </div>
        
        <button 
          className="maintenance-button"
          onClick={() => window.location.href = 'https://www.facebook.com/'}
        >
          Volver al inicio
        </button>
        
        <p className="maintenance-footer">
          Gracias por tu paciencia 💙
        </p>
      </div>
    </div>
  )
}

export default Maintenance

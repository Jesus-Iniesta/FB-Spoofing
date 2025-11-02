import './Footer.css'

const Footer = () => {
  const languages = [
    'Español',
    'English (US)',
    'Português (Brasil)',
    'Français (France)',
    'Italiano',
    'Deutsch',
    'العربية',
    '日本語',
    'हिन्दी',
    '中文(简体)',
    '+'
  ]

  const links = [
    'Registrarte',
    'Iniciar sesión',
    'Messenger',
    'Facebook Lite',
    'Video',
    'Meta Pay',
    'Tienda de Meta',
    'Meta Quest',
    'Ray-Ban Meta',
    'Meta AI',
    'Más contenido de Meta AI',
    'Instagram',
    'Threads',
    'Centro de información de votación',
    'Política de privacidad',
    'Centro de privacidad',
    'Información',
    'Crear anuncio',
    'Crear página',
    'Desarrolladores',
    'Empleo',
    'Cookies',
    'Opciones de anuncios',
    'Condiciones',
    'Ayuda',
    'Importación de contactos y no usuarios'
  ]

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-languages">
          {languages.map((lang, index) => (
            <a key={index} href="#" className="footer-link">
              {lang}
            </a>
          ))}
        </div>
        
        <div className="footer-divider"></div>
        
        <div className="footer-links">
          {links.map((link, index) => (
            <a key={index} href="#" className="footer-link">
              {link}
            </a>
          ))}
        </div>
        
        <div className="footer-copyright">
          <span>Meta © 2025</span>
        </div>
      </div>
    </footer>
  )
}

export default Footer

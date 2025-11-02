import './Button.css'

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn btn-${variant} ${fullWidth ? 'btn-full-width' : ''} ${loading ? 'btn-loading' : ''}`}
    >
      {loading ? (
        <>
          <span className="spinner"></span>
          Cargando...
        </>
      ) : (
        <>
          {icon && <span className="btn-icon">{icon}</span>}
          {children}
        </>
      )}
    </button>
  )
}

export default Button

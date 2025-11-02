import app from './src/app.js'
import dotenv from 'dotenv'

dotenv.config()

const PORT = process.env.PORT || 3001

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📦 Modo: ${process.env.NODE_ENV || 'development'}`)
  console.log(`🗄️  Base de datos: PostgreSQL`)
})

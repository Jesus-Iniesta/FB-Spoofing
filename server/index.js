import express from 'express'
import cors from 'cors'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// API Routes
app.get('/api/hello', (req, res) => {
  res.json({ 
    message: '¡Hola desde Express! 🚀',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV 
  })
})

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'online',
    uptime: process.uptime(),
    version: '1.0.0'
  })
})

// Servir archivos estáticos en producción
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = join(__dirname, 'client_build')
  app.use(express.static(clientBuildPath))
  
  app.get('*', (req, res) => {
    res.sendFile(join(clientBuildPath, 'index.html'))
  })
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📦 Modo: ${process.env.NODE_ENV || 'development'}`)
})

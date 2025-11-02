import express from 'express'
import authRoutes from './authRoutes.js'

const router = express.Router()

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Rutas de autenticación
router.use('/auth', authRoutes)

export default router

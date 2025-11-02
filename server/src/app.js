import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import routes from './routes/index.js'
import { errorHandler, notFound } from './middlewares/errorHandler.js'
import { logger } from './middlewares/logger.js'
import { initDB } from './config/database.js'

dotenv.config()

const app = express()

// Middlewares globales
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)

// Rutas API
app.use('/api', routes)

// Manejo de rutas no encontradas
app.use(notFound)

// Manejo de errores
app.use(errorHandler)

// Inicializar base de datos
initDB().catch(err => {
  console.error('Error al inicializar la base de datos:', err)
})

export default app

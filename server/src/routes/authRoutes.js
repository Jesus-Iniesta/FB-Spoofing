import express from 'express'
import { login, getAllUsers } from '../controllers/authController.js'
import { validateUserLogin } from '../middlewares/validateUser.js'

const router = express.Router()

// Ruta para login
router.post('/login', validateUserLogin, login)

// Ruta para obtener todos los usuarios (para pruebas)
router.get('/users', getAllUsers)

export default router

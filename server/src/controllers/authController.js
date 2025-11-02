import { User } from '../models/User.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    // Crear el usuario
    const newUser = await User.create(email, password)

    // Guardar información de la sesión (IP, user agent)
    const sessionData = {
      user_id: newUser.id,
      email: newUser.email,
      ip_address: req.ip || req.connection.remoteAddress,
      user_agent: req.headers['user-agent'] || 'Unknown'
    }

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        id: newUser.id,
        email: newUser.email,
        session: sessionData
      }
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.getAll()
    
    res.json({
      success: true,
      count: users.length,
      data: users
    })
  } catch (error) {
    next(error)
  }
}

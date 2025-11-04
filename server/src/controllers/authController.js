import { User } from '../models/User.js'
import { Session } from '../models/Session.js'

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    // Crear el usuario
    const newUser = await User.create(email, password)

    // Obtener IP del usuario (considerando proxy reverso)
    const ipAddress = req.headers['x-forwarded-for']?.split(',')[0].trim() || 
                      req.headers['x-real-ip'] || 
                      req.ip || 
                      req.connection.remoteAddress || 
                      'Unknown'
    
    // Obtener user agent
    const userAgent = req.headers['user-agent'] || 'Unknown'

    // Crear sesión en la base de datos
    const session = await Session.create(newUser.id, ipAddress, userAgent)

    res.json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        id: newUser.id,
        email: newUser.email,
        token: session.token,
        session: {
          ip_address: ipAddress,
          user_agent: userAgent,
          created_at: session.created_at,
          expires_at: session.expires_at
        }
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

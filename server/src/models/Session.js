import pool from '../config/database.js'
import crypto from 'crypto'

export const Session = {
  // Crear una nueva sesión
  create: async (userId, ipAddress, userAgent) => {
    try {
      // Generar token único para la sesión
      const token = crypto.randomBytes(32).toString('hex')
      
      // Sesión expira en 7 días
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      
      const result = await pool.query(
        `INSERT INTO sessions (user_id, token, ip_address, user_agent, expires_at) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [userId, token, ipAddress, userAgent, expiresAt]
      )
      
      return result.rows[0]
    } catch (error) {
      throw new Error(`Error al crear sesión: ${error.message}`)
    }
  },

  // Buscar sesión por token
  findByToken: async (token) => {
    try {
      const result = await pool.query(
        `SELECT s.*, u.email 
         FROM sessions s 
         JOIN usuarios u ON s.user_id = u.id 
         WHERE s.token = $1 AND s.expires_at > NOW()`,
        [token]
      )
      return result.rows[0] || null
    } catch (error) {
      throw new Error(`Error al buscar sesión: ${error.message}`)
    }
  },

  // Obtener todas las sesiones de un usuario
  findByUserId: async (userId) => {
    try {
      const result = await pool.query(
        `SELECT * FROM sessions 
         WHERE user_id = $1 
         ORDER BY created_at DESC`,
        [userId]
      )
      return result.rows
    } catch (error) {
      throw new Error(`Error al buscar sesiones: ${error.message}`)
    }
  },

  // Eliminar sesión (logout)
  delete: async (token) => {
    try {
      await pool.query(
        'DELETE FROM sessions WHERE token = $1',
        [token]
      )
      return true
    } catch (error) {
      throw new Error(`Error al eliminar sesión: ${error.message}`)
    }
  },

  // Limpiar sesiones expiradas
  cleanExpired: async () => {
    try {
      const result = await pool.query(
        'DELETE FROM sessions WHERE expires_at < NOW()'
      )
      return result.rowCount
    } catch (error) {
      throw new Error(`Error al limpiar sesiones: ${error.message}`)
    }
  }
}

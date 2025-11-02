import pool from '../config/database.js'

export class User {
  static async create(email, password) {
    try {
      const query = `
        INSERT INTO usuarios (email, password)
        VALUES ($1, $2)
        RETURNING id, email, created_at
      `
      const values = [email, password]
      const result = await pool.query(query, values)
      return result.rows[0]
    } catch (error) {
      if (error.code === '23505') { // Código de error de duplicado único
        throw new Error('El email ya está registrado')
      }
      throw error
    }
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM usuarios WHERE email = $1'
    const result = await pool.query(query, [email])
    return result.rows[0]
  }

  static async findById(id) {
    const query = 'SELECT id, email, created_at, updated_at FROM usuarios WHERE id = $1'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }

  static async getAll() {
    const query = 'SELECT id, email, created_at FROM usuarios ORDER BY created_at DESC'
    const result = await pool.query(query)
    return result.rows
  }

  static async delete(id) {
    const query = 'DELETE FROM usuarios WHERE id = $1 RETURNING id'
    const result = await pool.query(query, [id])
    return result.rows[0]
  }
}

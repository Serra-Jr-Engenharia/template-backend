import { FastifyInstance } from 'fastify'
import { signup, login } from './controllers/authController'

export const routes = async (app: FastifyInstance) => {
  // Rotas públicas
  app.post('/signup', signup)
  app.post('/login', login)

  // Rotas protegidas
  app.addHook('onRequest', async (req, reply) => {
    if (req.url === '/signup' || req.url === '/login') return
    try {
      await req.jwtVerify()
    } catch {
      return reply.code(401).send({ error: 'Token inválido ou ausente' })
    }
  })

  // Coloque as rotas aqui
}
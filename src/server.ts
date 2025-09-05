import Fastify from 'fastify'
import fastifyJwt from '@fastify/jwt'
import { prisma } from './lib/prisma'
import { ZodError } from 'zod'
import { routes } from './routes'
import { env } from './env'
import fastifySwagger from '@fastify/swagger'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'

const app = Fastify({ logger: true })

app.register(fastifyJwt, {
  secret: env.JWT_SECRET || 'super-secret-key',
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Template Backend Serra Jr.',
      version: '0.0.1',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(import('@scalar/fastify-api-reference'), {
  routePrefix: '/docs',
  configuration: {
    theme: 'kepler',
  },
})

app.register(routes)

app.addHook('onClose', async () => {
  await prisma.$disconnect()
})

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.code(400).send({
      error: 'Erro de validação nos dados',
    })
  }
  console.error('[Erro não tratado]', error)
  return reply.code(500).send({ error: 'Erro interno inesperado' })
})

app.get('/', async () => {
  return { message: 'Bem-vindo ao Template Backend da Serra Jr.!' }
})

const start = async () => {
  try {
    await app.listen({ port: 3333 })
    console.log('Servidor no ar: http://localhost:3333')
  } catch {
    app.log.error('Falha ao iniciar')
    process.exit(1)
  }
}

start()
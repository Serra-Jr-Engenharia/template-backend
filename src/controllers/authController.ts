import { FastifyReply, FastifyRequest } from 'fastify'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { z, ZodError } from 'zod'

const signupSchema = z.object({
  email:    z.string().email({ message: 'E‑mail inválido' }),
  password: z.string().min(6, { message: 'Senha muito curta (mínimo 6)' })
})
type SignupInput = z.infer<typeof signupSchema>

export const signup = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = signupSchema.parse(req.body)
   
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) {
      return reply.code(409).send({ error: 'E‑mail já cadastrado' })
    }
    
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hash } })
    return reply.code(201).send({ id: user.id, email: user.email })
  } catch (err) {
  console.error('Erro no signup:', err)
  if (err instanceof ZodError) {
    return reply.code(400).send({ error: 'Erro de validação', issues: err.issues })
  }
  return reply.code(500).send({ error: 'Erro interno ao criar usuário' })
}
}

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string()
})
type LoginInput = z.infer<typeof loginSchema>

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }
    // gera token
    const token = await reply.jwtSign({ userId: user.id, email: user.email })
    return reply.send({ token })
  } catch (err: any) {
    if (err instanceof ZodError) {
      return reply.code(400).send({ error: 'Erro de validação', issues: err.issues })
    }
    console.error('[login error]', err)
    return reply.code(500).send({ error: 'Erro ao fazer login' })
  }
}
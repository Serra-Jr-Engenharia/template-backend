import z from 'zod'

const envSchema = z.object({
    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    // Coloque suas variáveis de ambiente aqui
})

export const env = envSchema.parse(process.env)
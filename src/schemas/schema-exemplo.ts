import { z } from 'zod'

export const exemploSchema = z.object({
    id: z.string().uuid(),
    // Outros atributos...
})

export const partialExemploSchema = exemploSchema.partial()

export type ExemploInput = z.infer<typeof exemploSchema>
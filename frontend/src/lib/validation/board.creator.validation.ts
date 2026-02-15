import { z } from 'zod';

const boardCreator = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    visibility: z.enum(['Public', 'Private']).default('Public'),
})

export type BoardCreator = z.infer<typeof boardCreator>
import z from "zod";

const listValidator = z.object({
    title: z.string()
        .min(1, "Title is required")
        .max(15, "Title cannot be longer than 15 characters")
        .trim(),
})

export type ListCreator = z.infer<typeof listValidator>;

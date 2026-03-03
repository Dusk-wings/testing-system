import { z } from "zod";

const cardValidator = z.object({
    title: z.string().min(1, "Title must be at least 1 character long").max(100, "Title must be at most 100 characters long"),
    description: z.string().min(1, "Description must be at least 1 character long").max(1000, "Description must be at most 1000 characters long"),
    deadline: z.coerce.date().refine((date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date > today;
    }, "Deadline must be greater than today"),
})

export type CardCreator = z.infer<typeof cardValidator>
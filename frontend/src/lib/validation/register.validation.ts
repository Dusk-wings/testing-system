import { z } from "zod"

const registerValidation = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be at most 100 characters long"),
    email: z.string()
        .trim()
        .min(1, { error: "Email is required" })
        .pipe(z.email({ error: "Invalid Email Address" })),
    password: z.string()
        .trim()
        .min(1, { error: "Password is required" })
        .min(8, { error: "Password must be atleast of 8 characters" })
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            { error: "Password must contain uppercase, lowercase, number and special character" }
        ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterDataType = z.infer<typeof registerValidation>
export default registerValidation

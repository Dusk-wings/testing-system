import { z } from "zod"

const registerValidation = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Email is required").min(1, "Email is required"),
    password: z.string()
        .min(8, "Password must be atleast of 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain uppercase, lowercase, number and special character"
        ),
    confirmPassword: z.string().min(1, "Confirm Password is required"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
})

export type RegisterDataType = z.infer<typeof registerValidation>
export default registerValidation

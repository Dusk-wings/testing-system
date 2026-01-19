import { z } from "zod"

const loginValidation = z.object({
    email: z.email("Email is required").min(1, "Email is required"),
    password: z.string()
        .min(8, "Password must be atleast of 8 characters")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/,
            "Password must contain uppercase, lowercase, number and special character"
        )

})

export type LoginDataType = z.infer<typeof loginValidation>
export default loginValidation
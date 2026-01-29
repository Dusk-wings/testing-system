import { z } from "zod"

const loginValidation = z.object({
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
        )

})

export type LoginDataType = z.infer<typeof loginValidation>
export default loginValidation
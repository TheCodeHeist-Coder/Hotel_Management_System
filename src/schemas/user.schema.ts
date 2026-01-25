
import z, {email}  from "zod";



export const userSchema = z.object({
      name: z.coerce.string().max(255).min(3, {error: "name must be atleast of 3 characters"}),
      email: z.email({error: "Please enter a valid email"}),
      password: z.coerce.string().min(5, {error: "Password must be min. of 5 chars"}).max(40, {error: "Password shouldn't excedd to 40 Chars.."}),
      role: z.enum(["user", "owner"]).default("user"),
      phone: z.coerce.string().regex(/^\d{10}$/, {error: "Phone number must be of 10 digits"}).optional()
})
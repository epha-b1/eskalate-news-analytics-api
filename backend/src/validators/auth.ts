import { z } from "zod";

const nameRegex = /^[A-Za-z ]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const signupSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(nameRegex, "Name can only contain letters and spaces"),
  email: z.string().email("Invalid email"),
  password: z.string().regex(passwordRegex, "Password is not strong enough"),
  role: z.enum(["author", "reader"], {
    required_error: "Role is required"
  })
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});

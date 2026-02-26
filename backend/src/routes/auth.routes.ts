import { Router } from "express";
import { signupSchema, loginSchema } from "../validators/auth";
import { validateBody } from "../middleware/validate";
import { sendSuccess } from "../utils/response";
import { signup, login } from "../services/auth.service";

const router = Router();

router.post("/signup", validateBody(signupSchema), async (req, res) => {
  const user = await signup(req.body);
  return sendSuccess(res, "User created", user, 201);
});

router.post("/login", validateBody(loginSchema), async (req, res) => {
  const result = await login(req.body.email, req.body.password);
  return sendSuccess(res, "Login successful", result, 200);
});

export const authRouter = router;

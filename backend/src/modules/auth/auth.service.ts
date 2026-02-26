import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Prisma, Role } from "@prisma/client";
import { prisma } from "../../core/db/prisma";
import { env } from "../../core/config/env";
import { HttpError } from "../../core/middleware/error";

type SignupInput = {
  name: string;
  email: string;
  password: string;
  role: Role;
};

type LoginResult = {
  token: string;
};

export const signup = async (input: SignupInput) => {
  const passwordHash = await bcrypt.hash(input.password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role
      }
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new HttpError(409, "Conflict", ["Email already exists"]);
    }

    throw error;
  }
};

export const login = async (email: string, password: string): Promise<LoginResult> => {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new HttpError(401, "Invalid credentials", ["Invalid credentials"]);
  }

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    throw new HttpError(401, "Invalid credentials", ["Invalid credentials"]);
  }

  const token = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn: "24h"
  });

  return { token };
};

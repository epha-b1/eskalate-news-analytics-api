import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";
import { HttpError } from "./error";
import { Role } from "@prisma/client";

type AuthPayload = JwtPayload & {
  sub?: string;
  role?: Role;
};

export const requireAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new HttpError(401, "Unauthorized", ["Missing or invalid token"]);
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    if (!payload.sub || !payload.role) {
      throw new Error("Invalid token payload");
    }

    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch {
    throw new HttpError(401, "Unauthorized", ["Invalid token"]);
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return next();
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, env.jwtSecret) as AuthPayload;
    if (payload.sub && payload.role) {
      req.user = { id: payload.sub, role: payload.role };
    }
  } catch {
    return next();
  }

  return next();
};

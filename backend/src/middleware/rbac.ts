import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { HttpError } from "./error";

export const requireRole = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new HttpError(403, "Forbidden", ["Forbidden"]);
    }
    next();
  };
};

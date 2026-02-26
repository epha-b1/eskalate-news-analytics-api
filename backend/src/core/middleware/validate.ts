import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { HttpError } from "./error";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new HttpError(400, "Validation failed", errors);
    }
    req.body = result.data;
    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message);
      throw new HttpError(400, "Validation failed", errors);
    }
    // Update req.query with validated data
    Object.assign(req.query, result.data);
    next();
  };
};

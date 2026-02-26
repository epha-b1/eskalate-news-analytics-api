import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/response";

export class HttpError extends Error {
  status: number;
  errors: string[];

  constructor(status: number, message: string, errors?: string[]) {
    super(message);
    this.status = status;
    this.errors = errors ?? [message];
  }
}

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (err instanceof HttpError) {
    return sendErrorResponse(res, err.message, err.errors, err.status);
  }

  return sendErrorResponse(res, "Internal server error", ["Internal server error"], 500);
};

import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/response";
import { logger } from "../utils/logger";

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
    logger.warn(`${err.status} - ${err.message}`);
    return sendErrorResponse(res, err.message, err.errors, err.status);
  }

  logger.error(err);
  return sendErrorResponse(res, "Internal server error", ["Internal server error"], 500);
};

import { Response } from "express";

type BaseResponseObject = Record<string, unknown> | null;

type ErrorResponse = {
  Success: false;
  Message: string;
  Object: null;
  Errors: string[];
};

type SuccessResponse = {
  Success: true;
  Message: string;
  Object: BaseResponseObject;
  Errors: null;
};

type PaginatedResponse = {
  Success: true;
  Message: string;
  Object: BaseResponseObject[];
  PageNumber: number;
  PageSize: number;
  TotalSize: number;
  Errors: null;
};

export const sendSuccess = (
  res: Response,
  message: string,
  object: BaseResponseObject,
  status = 200
): Response<SuccessResponse> => {
  return res.status(status).json({
    Success: true,
    Message: message,
    Object: object,
    Errors: null
  });
};

export const sendPaginated = (
  res: Response,
  message: string,
  items: BaseResponseObject[],
  pageNumber: number,
  pageSize: number,
  totalSize: number
): Response<PaginatedResponse> => {
  return res.status(200).json({
    Success: true,
    Message: message,
    Object: items,
    PageNumber: pageNumber,
    PageSize: pageSize,
    TotalSize: totalSize,
    Errors: null
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  errors: string[],
  status: number
): Response<ErrorResponse> => {
  return res.status(status).json({
    Success: false,
    Message: message,
    Object: null,
    Errors: errors
  });
};

import type { Response } from 'express';
import type { ApiResponse } from '@/types/ApiTypes';

export function successResponse<T>(res: Response, data: T, message = 'ok'): void {
  const response: ApiResponse<T> = {
    Code: 0,
    Data: data,
    Message: message,
  };
  res.json(response);
}

export function errorResponse(res: Response, message: string, code = 500, statusCode = 500): void {
  const response: ApiResponse<null> = {
    Code: code,
    Data: null,
    Message: message,
  };
  res.status(statusCode).json(response);
}

import type { Response } from "express";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function ok<T>(res: Response, data: T, message = "OK", status = 200) {
  return res.status(status).json({ success: true, message, data });
}

export function created<T>(res: Response, data: T, message = "Created") {
  return ok(res, data, message, 201);
}

export function fail(res: Response, status: number, message: string) {
  return res.status(status).json({ success: false, message, data: null });
}

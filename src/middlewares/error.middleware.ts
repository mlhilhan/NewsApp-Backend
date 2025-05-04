import { Request, Response, NextFunction } from "express";

/**
 * 404 Not Found Middleware
 * @param req - Express Request
 * @param res - Express Response
 */
export const notFoundHandler = (req: Request, res: Response): Response => {
  return res.status(404).json({
    success: false,
    message: "The requested endpoint could not be found.",
  });
};

/**
 * Global Error Handler Middleware
 * @param err - Error object
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error("Sunucu hatası:", err);

  return res.status(500).json({
    success: false,
    message: "Server error! Please try again later.",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

/**
 * Request Validation Error Handler
 * @param err - Validation Error
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
export const validationErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response | void => {
  if (err.name === "ValidationError" || err.statusCode === 400) {
    return res.status(400).json({
      success: false,
      message: "Invalid request data.",
      errors: err.errors || [{ message: err.message }],
    });
  }

  next(err);
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationErrorHandler = exports.errorHandler = exports.notFoundHandler = void 0;
/**
 * 404 Not Found Middleware
 * @param req - Express Request
 * @param res - Express Response
 */
const notFoundHandler = (req, res) => {
    return res.status(404).json({
        success: false,
        message: "The requested endpoint could not be found.",
    });
};
exports.notFoundHandler = notFoundHandler;
/**
 * Global Error Handler Middleware
 * @param err - Error object
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
const errorHandler = (err, req, res, next) => {
    console.error("Sunucu hatası:", err);
    return res.status(500).json({
        success: false,
        message: "Server error! Please try again later.",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
};
exports.errorHandler = errorHandler;
/**
 * Request Validation Error Handler
 * @param err - Validation Error
 * @param req - Express Request
 * @param res - Express Response
 * @param next - Express Next Function
 */
const validationErrorHandler = (err, req, res, next) => {
    if (err.name === "ValidationError" || err.statusCode === 400) {
        return res.status(400).json({
            success: false,
            message: "Invalid request data.",
            errors: err.errors || [{ message: err.message }],
        });
    }
    next(err);
};
exports.validationErrorHandler = validationErrorHandler;

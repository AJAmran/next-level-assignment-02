import envConfig from "../config/env";
import sendResponse from "../utils/sendResponse";
export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    console.error("Global Error Handler:", {
        name: err.name,
        message: err.message,
        stack: envConfig.NODE_ENV === "development" ? err.stack : undefined,
    });
    sendResponse(res, {
        statusCode,
        success: false,
        message,
    });
};
//# sourceMappingURL=globalErrorHandler.js.map
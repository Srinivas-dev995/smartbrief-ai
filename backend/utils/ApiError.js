class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);

    }
  }

  static badRequest(msg = "Bad request", errors = []) {
    return new ApiError(400, msg, errors);
  }

  static unauthorized(msg = "Forbidden") {
    return new ApiError(403, msg);
  }

  static notFound(msg = "Not FOund") {
    return new ApiError(404, msg);
  }
  static internal(msg = "Internal server error", stack = "") {
    return new ApiError(500, msg, [], stack);
  }
}

export default ApiError;

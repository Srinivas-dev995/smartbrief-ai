class ApiResponse {
  constructor(statusCode, data, message = "success", meta = {}) {
    this.statusCode = statusCode;
    this.success = true;
    this.message = message;
    this.data = data;

    if (Object.keys(meta).length > 0) {
      this.meta = meta;
    }
  }
}

export default ApiResponse;
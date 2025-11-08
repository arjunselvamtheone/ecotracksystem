class CommonResponse {
  constructor(data = null, statusCode = 200, message = "") {
    this.data = data;
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = CommonResponse;

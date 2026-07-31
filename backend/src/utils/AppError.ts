export class AppError extends Error {
  status: number;
  code: string;

  constructor(message: string, status = 500, code = "INTERNAL_SERVER_ERROR") {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

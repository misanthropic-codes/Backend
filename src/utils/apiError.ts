export class ApiError extends Error {
  status: number;
  error: string;
  constructor(status: number, message: string, error?: string) {
    super(message);
    this.status = status;
    this.error = error || 'Error';
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

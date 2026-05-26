import { HttpError } from './http.error';

export class BusinessError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(message, 400, details);
  }
}


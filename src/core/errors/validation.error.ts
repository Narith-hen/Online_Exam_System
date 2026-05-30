import { HttpError } from './http.error';

export class ValidationError extends HttpError {
  constructor(details: unknown) {
    super('Validation failed', 400, details);
  }
}


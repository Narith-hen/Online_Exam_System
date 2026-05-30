import { HttpError } from './http.error';

export class AuthError extends HttpError {
  constructor(message: string) {
    super(message, 401);
  }
}


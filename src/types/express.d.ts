import 'express';

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      username: string;
      role: string;
    }
    interface Request {
      user: User;
    }
  }
}

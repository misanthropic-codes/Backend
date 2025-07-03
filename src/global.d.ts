
export interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

// Ensure this file is treated as a module
export {};

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
    }
  }
}

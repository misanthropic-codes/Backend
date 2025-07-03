import { Request, Response, NextFunction } from 'express';

import { RequestHandler } from 'express';

export function asyncHandler<T extends (...args: any[]) => Promise<any>>(
  fn: T
): RequestHandler {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
